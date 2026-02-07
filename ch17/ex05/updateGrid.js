import { ROWS, COLS } from './constants.js';

// Life Game のルールに従ってセルを更新する
export function updateGrid(grid) {
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
      } else {
        // 死んでいるセルに対して
        // 周囲に生きているセルが3つある場合には復活する
        nextGrid[row][col] = liveCellsNeighbor === 3;
      }
    }
  }
  return nextGrid;
}
