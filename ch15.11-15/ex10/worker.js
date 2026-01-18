// worker.js

self.onmessage = (e) => {
  const { imageData, width, height } = e.data;
  const data = imageData.data;
  const outputData = new Uint8ClampedArray(data.length);
  const kernel = [
    [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
  ];

  const kHalf = Math.floor(kernel.length / 2);

  // 各ピクセルにフィルタ適用
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let ky = -kHalf; ky <= kHalf; ky++) {
        for (let kx = -kHalf; kx <= kHalf; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx));
          const py = Math.min(height - 1, Math.max(0, y + ky));
          const idx = (py * width + px) * 4;
          const weight = kernel[ky + kHalf][kx + kHalf];

          r += data[idx] * weight;
          g += data[idx + 1] * weight;
          b += data[idx + 2] * weight;
        }
      }

      const index = (y * width + x) * 4;
      outputData[index] = r;
      outputData[index + 1] = g;
      outputData[index + 2] = b;
      outputData[index + 3] = data[index + 3]; // αはそのままコピー
    }
  }

  // メインスレッドに返す
  // テスト用に処理を敢えて3秒遅延させる
  setTimeout(() => {
    self.postMessage(new ImageData(outputData, width, height));
  }, 3000);
};
