import { Worker, isMainThread, parentPort } from "worker_threads";

if (isMainThread) {
  let num = 0;
  const worker = new Worker(new URL(import.meta.url));
  worker.on("message", (msg) => {
    if (msg === "increment") {
      num++;
    }
  });
  worker.on("online", () => {
    for (let i = 0; i < 10_000_000; i++) {
      num++;
    }
    worker.on("exit", () => {
      // 両方のスレッドが終了したら、期待通りの20,000,000 という値になっていることを確認する。
      console.log(num);
    });
  });
} else {
  for (let i = 0; i < 10_000_000; i++) {
    parentPort.postMessage("increment");
  }
  parentPort.close();
}
