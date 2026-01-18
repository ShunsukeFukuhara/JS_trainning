import net from "net";
import fs from "fs";
import path from "path";
import querystring from "querystring";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writeResponse = (socket, statusLine, headers = {}, body = "") => {
  socket.write(`${statusLine}\r\n`);
  for (const [key, value] of Object.entries(headers)) {
    socket.write(`${key}: ${value}\r\n`);
  }
  socket.write("\r\n");
  if (body) socket.write(body);
  socket.end();
};

const handleRequest = (socket, request) => {
  const headerEnd = request.indexOf("\r\n\r\n");
  const headerPart = request.slice(0, headerEnd).toString();
  const bodyPart = request.slice(headerEnd + 4);

  const [requestLine, ...headerLines] = headerPart.split("\r\n");
  const [method, url] = requestLine.split(" ");

  const headers = {};
  for (const line of headerLines) {
    const [key, value] = line.split(": ");
    headers[key.toLowerCase()] = value;
  }

  // 1. "/"が GET されたとき以下の HTML を返却する
  if (method === "GET" && url === "/") {
    const filePath = path.join(__dirname, "content", "index.html");
    console.log(filePath);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        writeResponse(socket, "HTTP/1.1 500 Internal Server Error");
        return;
      }
      writeResponse(
        socket,
        "HTTP/1.1 200 OK",
        {
          "Content-Type": "text/html",
          "Content-Length": content.length,
          Connection: "close",
        },
        content
      );
    });
    return;
  }

  // 2. 1.のフォームから/greetingに POST されたとき、nameとgreeting の内容をボディに含む HTML を返却する
  if (method === "POST" && url === "/greeting") {
    const parsedBody = querystring.parse(bodyPart.toString());
    const name = parsedBody.name || "Guest";
    const greeting = parsedBody.greeting || "Hello";

    fs.readFile(
      path.join(__dirname, "content", "result.html"),
      "utf-8",
      (err, template) => {
        if (err) {
          writeResponse(socket, "HTTP/1.1 500 Internal Server Error");
          return;
        }

        const responseBody = template
          .replace("{{name}}", name)
          .replace("{{greeting}}", greeting);

        writeResponse(
          socket,
          "HTTP/1.1 200 OK",
          {
            "Content-Type": "text/html",
            "Content-Length": Buffer.byteLength(responseBody),
            Connection: "close",
          },
          responseBody
        );
      }
    );
    return;
  }

  // 3. 1.2.で非対応のパスとメソッドの組み合わせでアクセスされた場合、HTTP のプロトコルにしたがい 404 または 405 を返す
  if (url === "/" && method !== "GET") {
    writeResponse(socket, "HTTP/1.1 405 Method Not Allowed");
  } else if (url === "/greeting" && method !== "POST") {
    writeResponse(socket, "HTTP/1.1 405 Method Not Allowed");
  } else {
    writeResponse(socket, "HTTP/1.1 404 Not Found");
  }
};

const server = net.createServer((socket) => {
  let buffer = Buffer.alloc(0);

  socket.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) return;

    const headerText = buffer.slice(0, headerEnd).toString();
    const contentLengthMatch = headerText.match(/content-length:\s*(\d+)/i);
    const contentLength = contentLengthMatch
      ? Number(contentLengthMatch[1])
      : 0;

    const totalLength = headerEnd + 4 + contentLength;
    if (buffer.length < totalLength) return;

    const request = buffer.slice(0, totalLength);
    buffer = buffer.slice(totalLength);

    handleRequest(socket, request);
  });
});

const PORT = 8080;
const HOST = "localhost";

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
