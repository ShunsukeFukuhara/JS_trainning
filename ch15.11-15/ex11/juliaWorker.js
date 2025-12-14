onmessage = function (message) {
  const { tile, x0, y0, perPixel, maxIterations, cx, cy } = message.data;
  const { width, height } = tile;

  const imageData = new ImageData(width, height);
  const iterations = new Uint32Array(imageData.data.buffer);

  let index = 0,
    max = 0,
    min = maxIterations;

  for (let row = 0, y = y0; row < height; row++, y += perPixel) {
    for (let col = 0, x = x0; col < width; col++, x += perPixel) {
      let r = x,
        i = y; // z0 = pixel
      let n;
      for (n = 0; n < maxIterations; n++) {
        const rr = r * r,
          ii = i * i;
        if (rr + ii > 4) break;
        i = 2 * r * i + cy; // c = cx + i*cy
        r = rr - ii + cx;
      }
      iterations[index++] = n;
      if (n > max) max = n;
      if (n < min) min = n;
    }
  }

  postMessage({ tile, imageData, min, max }, [imageData.data.buffer]);
};
