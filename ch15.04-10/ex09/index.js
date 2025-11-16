document.getElementById("image").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const img = new Image();
  const reader = new FileReader();

  reader.addEventListener("load", (e) => {
    img.src = e.target.result;
  });

  img.addEventListener("load", () => {
    const originalCanvas = document.getElementById("original");
    const filteredCanvas = document.getElementById("filtered");
    const originalCtx = originalCanvas.getContext("2d");
    const filteredCtx = filteredCanvas.getContext("2d");

    originalCanvas.width = img.width;
    originalCanvas.height = img.height;
    filteredCanvas.width = img.width;
    filteredCanvas.height = img.height;

    originalCtx.drawImage(img, 0, 0);

    const imageData = originalCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    // グレースケールへの変換 (RGB を足して平均を取っている)
    //
    // ガウシアンフィルタを実装する場合はこの周辺のコードを変更しなさい
    // imageData の中身はそのままに別の配列に結果を格納するとよい
    // ```js
    const outputData = new Uint8ClampedArray(imageData.data.length);
    // TODO: ここで imageData.data を参照して outputData に結果を格納
    const kernel = [
      [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
      [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
      [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
      [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
      [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
    ];

    const kHalf = Math.floor(kernel.length / 2); // カーネルの半分のサイズ

    // 画像の各ピクセルに対してフィルタを適用
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const color = { r: 0, g: 0, b: 0 };

        // ピクセルを中心としたカーネルの範囲をループ
        for (let ky = -kHalf; ky <= kHalf; ky++) {
          for (let kx = -kHalf; kx <= kHalf; kx++) {
            // 外側のピクセルにアクセスしないように境界をチェック
            const px = Math.min(img.width - 1, Math.max(0, x + kx));
            const py = Math.min(img.height - 1, Math.max(0, y + ky));

            const pixelIndex = (py * img.width + px) * 4;
            const weight = kernel[ky + kHalf][kx + kHalf];

            // カーネルの重みをかけて色を加算
            color.r += data[pixelIndex] * weight;
            color.g += data[pixelIndex + 1] * weight;
            color.b += data[pixelIndex + 2] * weight;
          }
        }

        // 計算されたr, g, b, (aはそのまま)の値を出力データに設定
        const index = (y * img.width + x) * 4;
        outputData[index] = color.r;
        outputData[index + 1] = color.g;
        outputData[index + 2] = color.b;
        outputData[index + 3] = data[index + 3]; // αはそのままコピー
      }
    }

    const outputImageData = new ImageData(outputData, img.width, img.height);
    filteredCtx.putImageData(outputImageData, 0, 0);
  });

  reader.readAsDataURL(file);
});
