import { renderGrid } from './renderGrid.js';
import { updateGrid } from './updateGrid.js';
import { ROWS, COLS, RESOLUTION } from './constants.js';

const canvas = document.querySelector('#screen');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');

canvas.width = ROWS * RESOLUTION;
canvas.height = COLS * RESOLUTION;

// https://developer.mozilla.org/ja/docs/Web/API/Window/requestAnimationFrame が返す ID
let animationId = null;

// NOTE: download from https://soundeffect-lab.info/sound/button/mp3/decision1.mp3
const sound = new Audio('/ch17/ex05/decision1.mp3');

// ライフゲームのセル (true or false) をランダムに初期化する
let grid = new Array(ROWS)
  .fill(null)
  .map(() =>
    new Array(COLS).fill(null).map(() => !!Math.floor(Math.random() * 2)),
  );

// canvas がクリックされたときの処理 (セルの値を反転する)
canvas.addEventListener('click', function (evt) {
  const rect = canvas.getBoundingClientRect();
  const pos = { x: evt.clientX - rect.left, y: evt.clientY - rect.top };

  const row = Math.floor(pos.y / RESOLUTION);
  const col = Math.floor(pos.x / RESOLUTION);
  grid[row][col] = !grid[row][col];
  sound.cloneNode().play();
  renderGrid(canvas, grid);
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
    renderGrid(canvas, grid);
    lastTime = timestamp;
  }

  animationId = requestAnimationFrame(update);
}

startButton.addEventListener('click', () => {
  // 既にアニメーションが動いている場合は何もしない
  if (animationId) {
    return;
  }
  update();
});

pauseButton.addEventListener('click', () => {
  // アニメーションが停止している場合は何もしない
  if (!animationId) {
    return;
  }
  cancelAnimationFrame(animationId);
  animationId = null;
});

renderGrid(canvas, grid);

// おまけ
// クリックしたら盤面をグライダー銃にする
const gliderGunButton = document.querySelector('#gliderGun');
gliderGunButton.addEventListener('click', () => {
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
  renderGrid(canvas, grid);
});
