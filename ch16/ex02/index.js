import { spawn } from "child_process";
import path from "path";

// ESMでこのファイルの絶対パスとして__dirnameを定義するイディオム
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// startChildで起動したプロセスの参照
let child = null;

// node ./child.js を起動し、このプロセスが終了したときに解決するPromiseを返す
// cf. https://nodejs.org/api/child_process.html#event-close
async function startChild() {
  const childPath = path.join(__dirname, "child.js");
  child = spawn("node", [childPath]);

  child.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  return new Promise((res) => {
    child.on("close", (code, signal) => {
      res([code, signal]);
    });
  });
}

// TODO: ここに処理を書く
const shutdownSignals = [
  // Ctrl+C
  { signal: "SIGINT", posixCode: 130, windowsCode: 3221225786 },
  // Break
  { signal: "SIGBREAK", posixCode: 21, windowsCode: 3221225786 },
];

shutdownSignals
  .map((s) => s.signal)
  .forEach((signal) => {
    process.on(signal, () => {
      console.log(`${signal}を検知しました。子プロセスに伝達します。`);
      child?.kill(signal);
    });
  });

(async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [code, signal] = await startChild();
    console.log(`子プロセスが終了しました。code: ${code}, signal: ${signal}`);

    const mathcedSignal = shutdownSignals.find(
      (s) =>
        s.signal === signal ||
        (process.platform === "win32" ? s.windowsCode : s.posixCode) === code
    );

    if (mathcedSignal) {
      console.log(
        `親プロセスも${mathcedSignal.signal}を受け取ったので終了します。`
      );
      process.exit(mathcedSignal.posixCode);
    }

    if (code !== 0) {
      console.log("子プロセスが異常終了しました。再起動します。");
      continue;
    }
  }
})();
