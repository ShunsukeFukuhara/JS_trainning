// ワーカーが親スレッドからメッセージを受け取ったときの処理
onmessage = function (message) {
  // 親から送られてきた計算パラメータを展開
  // tile: { width, height, x, y } - 計算対象の矩形領域
  // x0, y0: このタイルの左上の複素平面上座標
  // perPixel: ピクセル1つあたりの複素平面の幅
  // maxIterations: 脱出判定の最大反復回数
  // cx, cy: ジュリア集合の定数 c = cx + i*cy
  const { tile, x0, y0, perPixel, maxIterations, cx, cy } = message.data;
  const { width, height } = tile;

  // 描画用ImageDataを作成し、ArrayBufferをUint32Arrayとして扱う
  // 各ピクセルの反復回数を整数として格納する
  const imageData = new ImageData(width, height);
  const iterations = new Uint32Array(imageData.data.buffer);

  // ループ用のインデックスと反復回数の最小/最大を初期化
  let index = 0,
    max = 0,
    min = maxIterations;

  // タイル内のすべてのピクセルをループ
  for (let row = 0, y = y0; row < height; row++, y += perPixel) {
    for (let col = 0, x = x0; col < width; col++, x += perPixel) {
      let r = x,
        i = y; // z0 = 現在のピクセルの複素座標
      let n;

      // 脱出判定の反復計算
      for (n = 0; n < maxIterations; n++) {
        const rr = r * r,
          ii = i * i;
        if (rr + ii > 4) break; // |z| > 2 なら脱出

        // ジュリア集合の更新式: z(n+1) = z(n)^2 + c
        // r: 実部、i: 虚部
        i = 2 * r * i + cy; // 虚部更新
        r = rr - ii + cx; // 実部更新
      }

      // 各ピクセルの反復回数を記録
      iterations[index++] = n;

      // タイル内の最小・最大反復回数を更新
      if (n > max) max = n;
      if (n < min) min = n;
    }
  }

  postMessage({ tile, imageData, min, max }, [imageData.data.buffer]);
};
