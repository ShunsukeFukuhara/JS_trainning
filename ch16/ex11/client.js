import net from "net";

const CLIENT_COUNT = 500;
const sockets = [];

for (let i = 0; i < CLIENT_COUNT; i++) {
  const socket = new net.Socket();

  socket.connect(8080, "localhost", () => {});

  socket.on("error", (err) => {
    console.error(`Client ${i} error:`, err.code);
  });

  socket.on("close", () => {});

  sockets.push(socket);
}

console.log(`${CLIENT_COUNT} TCP connections established and kept open`);

// プロセス終了時に全接続をクローズ
process.on("SIGINT", () => {
  console.log("\nClosing all connections...");
  for (const socket of sockets) {
    socket.destroy();
  }
  process.exit();
});
