import { parentPort } from "worker_threads";

const kernel = [
  [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
  [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
  [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
  [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
  [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
];

const kHalf = Math.floor(kernel.length / 2);

parentPort.on("message", ({ data, width, height }) => {
  console.log("Worker: 画像を処理中...");
  const outputData = new Uint8ClampedArray(data.length);

  // 画像の各ピクセルに対してフィルタを適用
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = { r: 0, g: 0, b: 0 };

      // ピクセルを中心としたカーネルの範囲をループ
      for (let ky = -kHalf; ky <= kHalf; ky++) {
        for (let kx = -kHalf; kx <= kHalf; kx++) {
          // 外側のピクセルにアクセスしないように境界をチェック
          const px = Math.min(width - 1, Math.max(0, x + kx));
          const py = Math.min(height - 1, Math.max(0, y + ky));

          const pixelIndex = (py * width + px) * 4;
          const weight = kernel[ky + kHalf][kx + kHalf];

          // カーネルの重みをかけて色を加算
          color.r += data[pixelIndex] * weight;
          color.g += data[pixelIndex + 1] * weight;
          color.b += data[pixelIndex + 2] * weight;
        }
      }

      // 計算されたr, g, b, (aはそのまま)の値を出力データに設定
      const index = (y * width + x) * 4;
      outputData[index] = color.r;
      outputData[index + 1] = color.g;
      outputData[index + 2] = color.b;
      outputData[index + 3] = data[index + 3]; // αはそのままコピー
    }
  }

  console.log("Worker: 処理完了");

  parentPort.postMessage({ data: outputData, width, height }, [
    outputData.buffer,
  ]);
});
