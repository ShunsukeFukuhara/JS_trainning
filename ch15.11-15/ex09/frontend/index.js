import { sendRequest, RequestBody, onResponse } from "./client.js";

const ROWS = 50;
const COLS = 50;
const RESOLUTION = 10;

const canvas = document.querySelector("#screen");
const ctx = canvas.getContext("2d");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");

canvas.width = COLS * RESOLUTION;
canvas.height = ROWS * RESOLUTION;

const sound = new Audio("/ch15.04-10/ex10/decision1.mp3");

// サーバからの盤面更新を受けるための変数
let grid = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => false)
);

// 盤面描画
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      ctx.fillStyle = grid[row][col] ? "black" : "white";
      ctx.fillRect(col * RESOLUTION, row * RESOLUTION, RESOLUTION, RESOLUTION);
    }
  }
}

// canvasクリックでセル反転イベント発火
canvas.addEventListener("click", async (e) => {
  const rect = canvas.getBoundingClientRect();
  const col = Math.floor((e.clientX - rect.left) / RESOLUTION);
  const row = Math.floor((e.clientY - rect.top) / RESOLUTION);

  // サウンド再生
  sound.currentTime = 0;
  sound.play();

  // サーバに通知
  await sendRequest(RequestBody.toggle(row, col));
});

// Startボタン
startButton.addEventListener("click", async () => {
  await sendRequest(RequestBody.start());
});

// Pauseボタン
pauseButton.addEventListener("click", async () => {
  await sendRequest(RequestBody.pause());
});

// サーバから盤面更新を受け取り描画
onResponse((response) => {
  if (response.type === "update") {
    grid = response.grid;
    drawGrid();
  }
});

// 初期描画
drawGrid();
