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

// 以下の定数で、マンデルブロ集合の計算の並行性を制御する。お使いのコンピュータで
// 最適なパフォーマンスを得るには、これらを調整する必要があるかもしれない。
const ROWS = 3,
  COLS = 4,
  NUMWORKERS = navigator.hardwareConcurrency || 2;

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
    if (this.pendingRender) {
      this.wantsRerender = true;
      return;
    }

    const perPixel = 3 / this.height; // 初期スケール
    const maxIterations = 500;
    const x0 = -1.5,
      y0 = -1.5;

    const promises = this.tiles.map((tile) =>
      this.workerPool.addWork({
        tile,
        x0: x0 + tile.x * perPixel,
        y0: y0 + tile.y * perPixel,
        perPixel,
        maxIterations,
        cx: this.cx,
        cy: this.cy,
      })
    );

    this.pendingRender = Promise.all(promises)
      .then((responses) => {
        let min = maxIterations,
          max = 0;
        for (const r of responses) {
          if (r.min < min) min = r.min;
          if (r.max > max) max = r.max;
        }

        if (!this.colorTable || this.colorTable.length !== maxIterations + 1)
          this.colorTable = new Uint32Array(maxIterations + 1);

        if (min === max && min === maxIterations) {
          this.colorTable[min] = 0xff000000;
        } else {
          const maxlog = Math.log(1 + max - min);
          for (let i = min; i <= max; i++) {
            this.colorTable[i] =
              Math.ceil((Math.log(1 + i - min) / maxlog) * 255) << 24;
          }
        }

        for (const r of responses) {
          const iters = new Uint32Array(r.imageData.data.buffer);
          for (let i = 0; i < iters.length; i++)
            iters[i] = this.colorTable[iters[i]];
        }

        this.canvas.style.transform = "";
        for (const r of responses)
          this.context.putImageData(r.imageData, r.tile.x, r.tile.y);
      })
      .finally(() => {
        this.pendingRender = null;
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
      case "+":
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
