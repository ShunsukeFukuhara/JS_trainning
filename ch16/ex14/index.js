import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import { Worker } from "worker_threads";

// 画像を読み込み、キャンバスに描画してImageDataを取得
const img = await loadImage("./ex14/original.png");
const canvas = createCanvas(img.width, img.height);
const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0); // 画像をキャンバスに描画
const inputImageData = ctx.getImageData(0, 0, img.width, img.height);

// ワーカースレッドを作成
const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});

// ワーカースレッドからの返答を受け取って画像を保存
worker.on("message", ({ data, width, height }) => {
  const outputImageData = ctx.createImageData(width, height);
  outputImageData.data.set(data);

  ctx.putImageData(outputImageData, 0, 0);

  const out = fs.createWriteStream("./ex14/filtered.png");
  canvas.createPNGStream().pipe(out);

  // 完了したらワーカーを終了
  out.on("finish", () => {
    console.log("Main: 画像の保存が完了しました。");
    worker.terminate();
  });

  // プロセスを終了
  out.on("close", () => {
    process.exit(0);
  });
});

// ワーカーの処理を開始
worker.postMessage(
  {
    data: inputImageData.data,
    width: inputImageData.width,
    height: inputImageData.height,
  },
  [inputImageData.data.buffer]
);
