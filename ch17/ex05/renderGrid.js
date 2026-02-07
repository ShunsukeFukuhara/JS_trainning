import { ROWS, COLS, RESOLUTION } from './constants.js';

// grid を canvas に描画する
export function renderGrid(canvas, grid) {
  const ctx = canvas.getContext('2d');
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = grid[row][col];
      ctx.beginPath();
      ctx.rect(col * RESOLUTION, row * RESOLUTION, RESOLUTION, RESOLUTION);
      ctx.fillStyle = cell ? 'black' : 'white';
      ctx.fill();
      ctx.stroke();
    }
  }
}
