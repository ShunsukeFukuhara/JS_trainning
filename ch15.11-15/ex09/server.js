import WebSocket, { WebSocketServer } from "ws";

// 50 x 50 の盤面とする
const ROWS = 50;
const COLS = 50;
// 1秒当たりの更新頻度
const FRAME_RATE = 10;

// WebSocketのポート
const port = 3003;
const wss = new WebSocketServer({ port });

// ライフゲームのセル (true or false) をランダムに初期化する
let grid = new Array(ROWS)
  .fill(null)
  .map(() =>
    new Array(COLS).fill(null).map(() => !!Math.floor(Math.random() * 2))
  );
// 停止状態
let paused = true;

wss.on("connection", (ws) => {
  // 接続されたクライアントに初期のグリッドを送信
  ws.send(JSON.stringify({ type: "update", grid }));

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    switch (data.type) {
      case "toggle": // セルの反転
        grid[data.row][data.col] = !grid[data.row][data.col];
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "update", grid }));
          }
        });
        break;
      case "pause": // 停止
        paused = true;
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "pause" }));
          }
        });
        break;
      case "start": // 開始・再開
        paused = false;
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "start" }));
          }
        });
        break;
    }
  });
});

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

// 全クライアントにグリッドの状態をブロードキャストする
function broadcast(grid) {
  const message = JSON.stringify({ type: "update", grid });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// 1秒に10回グリッドを更新し、クライアントに送信する
setInterval(() => {
  if (paused) {
    return;
  }
  grid = updateGrid(grid);
  broadcast(grid);
}, 1000 / FRAME_RATE);
