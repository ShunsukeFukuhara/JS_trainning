/*
 * このクラスは、キャンバスや画像の矩形を表す。Tile を使って、キャンバスを領域に
 * 分割して、ワーカーが独立して処理できるようにする。
 */
class Tile {
  constructor(x, y, width, height) {
    this.x = x; // Tile オブジェクトの
    this.y = y; // プロパティは、大きな
    this.width = width; // 矩形の中でのTile の
    this.height = height; // 位置とサイズを表す。
  }
  // この静的メソッドは、指定された幅と高さの矩形を、指定された数の行と
  // 列に分割し、その矩形を覆うように、numRows*numCols 個のTile オブジェクトを
  // // 生成するジェネレータ。
  static *tiles(width, height, numRows, numCols) {
    const columnWidth = Math.ceil(width / numCols);
    const rowHeight = Math.ceil(height / numRows);
    for (let row = 0; row < numRows; row++) {
      const tileHeight =
        row < numRows - 1
          ? rowHeight // 行の高さ。
          : height - rowHeight * (numRows - 1); // 最後の行の高さ。
      for (let col = 0; col < numCols; col++) {
        const tileWidth =
          col < numCols - 1
            ? columnWidth // 列の幅。
            : width - columnWidth * (numCols - 1); // 最後の列の幅。
        yield new Tile(
          col * columnWidth,
          row * rowHeight,
          tileWidth,
          tileHeight
        );
      }
    }
  }
}
/*
 * このクラスは、同じコードを実行するワーカーのプールを表す。指定した
 * ワーカーコードは、受信した各メッセージに応答して、何らかの計算を行い、
 * その計算結果を1 つのメッセージとして送信する。
 *
 * WokerPool と実行する作業を表すメッセージがあれば、メッセージを引数
 * としてaddWork() を呼び出すだけ。現在アイドル状態のWorker オブジェクトが
 * あれば、メッセージはすぐにそのワーカーに送信される。アイドル状態の
 * Woker が存在しない場合、メッセージはキューに入れられ、ワーカーが利用
 * 可能になったときに送信される。
 *
 * addWork() はPromise を返す。このPromise はワーカーから受け取ったメッセージで
 * 解決する。または、ワーカーが未処理のエラーをスローした場合は失敗する。
 */
class WorkerPool {
  constructor(numWorkers, workerSource) {
    this.idleWorkers = []; // 現在処理を行っていないワーカー。
    this.workQueue = []; // 現在処理されていない仕事。
    this.workerMap = new Map(); // ワーカーと解決、失敗時の関数をマッピングする。
    // 指定した数のワーカーを作成し、メッセージハンドラとエラーハンドラを
    // 追加し、idleWorkers 配列に保存する。
    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(workerSource);
      worker.onmessage = (message) => {
        this._workerDone(worker, null, message.data);
      };
      worker.onerror = (error) => {
        this._workerDone(worker, error, null);
      };
      this.idleWorkers[i] = worker;
    }
  }
  // この内部メソッドは、ワーカーがメッセージを送信したり、エラーを
  // スローしたりして、処理を終了したときに呼び出される。
  _workerDone(worker, error, response) {
    // このWorker のresolve() とreject() 関数を検索し、
    // マップからこのワーカーのエントリを削除する。
    const [resolver, rejector] = this.workerMap.get(worker);
    this.workerMap.delete(worker);
    // キューに入っている仕事がなければ、このワーカーをアイドル状態の
    // ワーカーリストに戻す。キューに入っている仕事があれば、キューから
    // 仕事を取り出し、このワーカーに送信する。
    if (this.workQueue.length === 0) {
      this.idleWorkers.push(worker);
    } else {
      const [work, resolver, rejector] = this.workQueue.shift();
      this.workerMap.set(worker, [resolver, rejector]);
      worker.postMessage(work);
    }
    // 最後に、ワーカーに関連するPromise を解決させるか、失敗させる。
    error === null ? resolver(response) : rejector(error);
  }
  // このメソッドは、ワーカープールに仕事を追加し、Promise を返す。
  // このPromise は、仕事が完了したときに、ワーカーの応答で解決する。
  // 仕事は、postMessage() を使ってワーカーに渡される。アイドル状態の
  // ワーカーがあれば、仕事のメッセージはすぐに送信される。ない場合は、
  // ワーカーが利用可能になるまで仕事はキューに入れられる。
  addWork(work) {
    return new Promise((resolve, reject) => {
      if (this.idleWorkers.length > 0) {
        const worker = this.idleWorkers.pop();
        this.workerMap.set(worker, [resolve, reject]);
        worker.postMessage(work);
      } else {
        this.workQueue.push([work, resolve, reject]);
      }
    });
  }
}
const ROWS = 3;
const COLS = 4;
const NUMWORKERS = navigator.hardwareConcurrency || 2;

class JuliaCanvas {
  constructor(canvas, cx = -0.7, cy = 0.27015) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.workerPool = new WorkerPool(NUMWORKERS, "juliaWorker.js");
    this.tiles = null;
    this.pendingRender = null;
    this.wantsRerender = false;
    this.resizeTimer = null;
    this.colorTable = null;
    this.cx = cx;
    this.cy = cy;

    this.canvas.addEventListener("pointerdown", (e) => this.handlePointer(e));
    window.addEventListener("keydown", (e) => this.handleKey(e));
    window.addEventListener("resize", (e) => this.handleResize(e));

    this.setSize();
    this.render();
  }

  setSize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.tiles = [...Tile.tiles(this.width, this.height, ROWS, COLS)];
  }

  render() {
    // すでに描画処理が進行中の場合は、新しい描画リクエストを記録して処理をスキップ
    if (this.pendingRender) {
      this.wantsRerender = true; // 描画が完了したら再描画するフラグをセット
      return;
    }

    // 描画に使用する初期スケール（1ピクセルあたりの複素平面の長さ）
    const perPixel = 3 / this.height; // 高さを基準にスケールを決定
    const maxIterations = 500; // 計算の反復回数の上限
    const x0 = -1.5,
      y0 = -1.5; // 描画開始位置（複素平面上の左上座標）

    // Tileごとにワーカープールで計算を依頼
    const promises = this.tiles.map((tile) =>
      this.workerPool.addWork({
        tile, // Tileオブジェクト（矩形領域）
        x0: x0 + tile.x * perPixel, // Tile 左上の複素座標（実数部）
        y0: y0 + tile.y * perPixel, // Tile 左上の複素座標（虚数部）
        perPixel, // ピクセルあたりのスケール
        maxIterations, // 反復回数の上限
        cx: this.cx, // 描画中心の複素平面の x 座標
        cy: this.cy, // 描画中心の複素平面の y 座標
      })
    );

    // 全Tileの計算が完了するのを待つ
    this.pendingRender = Promise.all(promises)
      .then((responses) => {
        // 全Tileの反復回数の最小値と最大値を計算
        let min = maxIterations,
          max = 0;
        for (const r of responses) {
          if (r.min < min) min = r.min;
          if (r.max > max) max = r.max;
        }

        // 色テーブルが未作成、またはサイズが合わない場合は再作成
        if (!this.colorTable || this.colorTable.length !== maxIterations + 1)
          this.colorTable = new Uint32Array(maxIterations + 1);

        // すべてのピクセルが同じ反復回数の場合の処理
        if (min === max && min === maxIterations) {
          this.colorTable[min] = 0xff000000; // 完全な黒
        } else {
          // 反復回数を対数スケールで0〜255の不透明度に変換して色テーブルを作成
          const maxlog = Math.log(1 + max - min);
          for (let i = min; i <= max; i++) {
            this.colorTable[i] =
              Math.ceil((Math.log(1 + i - min) / maxlog) * 255) << 24;
          }
        }

        // 各TileのImageDataの反復回数を色テーブルの値に置き換える
        for (const r of responses) {
          const iters = new Uint32Array(r.imageData.data.buffer);
          for (let i = 0; i < iters.length; i++)
            iters[i] = this.colorTable[iters[i]];
        }

        // 描画用のCSS変換をリセット
        this.canvas.style.transform = "";

        // 各TileのImageDataをCanvasに描画
        for (const r of responses)
          this.context.putImageData(r.imageData, r.tile.x, r.tile.y);
      })
      .finally(() => {
        // 描画処理完了
        this.pendingRender = null;

        // 描画中に新しい描画要求が来ていた場合、再度render()を呼ぶ
        if (this.wantsRerender) {
          this.wantsRerender = false;
          this.render();
        }
      });
  }

  handleResize() {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.resizeTimer = null;
      this.setSize();
      this.render();
    }, 200);
  }

  handleKey(e) {
    switch (e.key) {
      case "0":
        this.cx += 0.01;
        break;
      case "-":
        this.cx -= 0.01;
        break;
      case "ArrowUp":
        this.cy -= 0.01;
        break;
      case "ArrowDown":
        this.cy += 0.01;
        break;
    }
    this.render();
  }

  handlePointer(e) {
    // 簡易クリックで中心変更、ズームイン
    const x = e.clientX - this.width / 2;
    const y = e.clientY - this.height / 2;
    this.cx += x * (3 / this.height);
    this.cy += y * (3 / this.height);
    this.render();
  }
}

// 最後に、canvas を設定する。なお、このJavaScript ファイルは自己完結している。
// HTML ファイルには、<script>タグだけを記述すればよい。
const canvas = document.createElement("canvas"); // canvas 要素を作成する。
document.body.append(canvas); // ボディに挿入する。
document.body.style = "margin:0"; // ボディのマージンをゼロに。
canvas.style.width = "100%"; // canvas の幅をボディと同じにする。
canvas.style.height = "100%"; // 高さもボディと同じにする。
new JuliaCanvas(canvas); // そして、描画を開始する。
