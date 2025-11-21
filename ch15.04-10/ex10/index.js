// 50 x 50 の盤面とする
const ROWS = 50;
const COLS = 50;
// 1セルのサイズ
const RESOLUTION = 10;

const canvas = document.querySelector("#screen");
const ctx = canvas.getContext("2d");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");

canvas.width = ROWS * RESOLUTION;
canvas.height = COLS * RESOLUTION;

// https://developer.mozilla.org/ja/docs/Web/API/Window/requestAnimationFrame が返す ID
let animationId = null;

// NOTE: download from https://soundeffect-lab.info/sound/button/mp3/decision1.mp3
const sound = new Audio("/ch15.04-10/ex10/decision1.mp3");

// ライフゲームのセル (true or false) をランダムに初期化する
let grid = new Array(ROWS)
  .fill(null)
  .map(() =>
    new Array(COLS).fill(null).map(() => !!Math.floor(Math.random() * 2))
  );

// grid を canvas に描画する
function renderGrid(grid) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = grid[row][col];
      ctx.beginPath();
      ctx.rect(col * RESOLUTION, row * RESOLUTION, RESOLUTION, RESOLUTION);
      ctx.fillStyle = cell ? "black" : "white";
      ctx.fill();
      ctx.stroke();
    }
  }
}

// Life Game のルールに従ってセルを更新する
function updateGrid(grid) {
  // 新しいグリッドを作成
  const nextGrid = grid.map((arr) => [...arr]);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // 周囲のセルの生存数を数えて nextGrid[row][col] に true or false を設定する
      let liveCellsNeighbor = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // 自分自身は除外
          if (i === 0 && j === 0) continue;

          // 盤面の範囲外は無視
          const newRow = row + i;
          const newCol = col + j;
          if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS) {
            continue;
          }

          if (grid[newRow][newCol]) {
            liveCellsNeighbor++;
          }
        }
      }
      // ライフゲームのルール
      // 生きているセルに対して
      if (grid[row][col]) {
        // 周囲に生きているセルが2つか3つある場合には生存する。それ以外は過疎または過密で死亡する
        nextGrid[row][col] = liveCellsNeighbor === 2 || liveCellsNeighbor === 3;
      }
      // 死んでいるセルに対して
      else {
        // 周囲に生きているセルが3つある場合には復活する
        nextGrid[row][col] = liveCellsNeighbor === 3;
      }
    }
  }
  return nextGrid;
}

// canvas がクリックされたときの処理 (セルの値を反転する)
canvas.addEventListener("click", function (evt) {
  const rect = canvas.getBoundingClientRect();
  const pos = { x: evt.clientX - rect.left, y: evt.clientY - rect.top };

  const row = Math.floor(pos.y / RESOLUTION);
  const col = Math.floor(pos.x / RESOLUTION);
  grid[row][col] = !grid[row][col];
  sound.cloneNode().play();
  renderGrid(grid);
});

// requestAnimationFrame によって一定間隔で更新・描画を行う
// TODO: リフレッシュレートの高い画面では速く実行されてしまうため、以下を参考に更新頻度が常に一定となるようにしなさい
// https://developer.mozilla.org/ja/docs/Web/API/Window/requestAnimationFrame

let lastTime = 0; // 前回の更新時刻
const interval = 10; // 1ターンの間隔

function update(timestamp) {
  // 初回呼び出しなら lastTime を初期化
  if (!lastTime) lastTime = timestamp;

  const difference = timestamp - lastTime;

  // 一定時間経過したら更新処理を行う
  if (difference >= interval) {
    grid = updateGrid(grid);
    renderGrid(grid);
    lastTime = timestamp;
  }

  animationId = requestAnimationFrame(update);
}

startButton.addEventListener("click", () => {
  // 既にアニメーションが動いている場合は何もしない
  if (animationId) {
    return;
  }
  update();
});

pauseButton.addEventListener("click", () => {
  // アニメーションが停止している場合は何もしない
  if (!animationId) {
    return;
  }
  cancelAnimationFrame(animationId);
  animationId = null;
});

renderGrid(grid);

// おまけ
// クリックしたら盤面をグライダー銃にする
const gliderGunButton = document.querySelector("#gliderGun");
gliderGunButton.addEventListener("click", () => {
  const gunPattern = [
    [1, 5],
    [1, 6],
    [2, 5],
    [2, 6],
    [11, 5],
    [11, 6],
    [11, 7],
    [12, 4],
    [12, 8],
    [13, 3],
    [14, 3],
    [15, 6],
    [16, 4],
    [17, 5],
    [17, 6],
    [17, 7],
    [18, 6],
    [16, 8],
    [13, 9],
    [14, 9],
    [21, 3],
    [22, 3],
    [21, 4],
    [22, 4],
    [21, 5],
    [22, 5],
    [23, 2],
    [23, 6],
    [25, 1],
    [25, 2],
    [25, 6],
    [25, 7],
    [35, 3],
    [36, 3],
    [35, 4],
    [36, 4],
  ];

  // グリッドを全て白紙にする
  const newGrid = new Array(ROWS)
    .fill(null)
    .map(() => new Array(COLS).fill(false));

  // グライダー銃のパターンをセットする
  gunPattern.forEach(([col, row]) => {
    newGrid[col][row] = true; // 軸取り間違えた
  });

  grid = newGrid;
  renderGrid(grid);
});
