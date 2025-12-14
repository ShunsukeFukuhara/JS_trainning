// 1. WebSocket サーバに文字列データを含むリクエストメッセージを送信する sendRequest 関数を実装しなさい。

export class RequestBody {
  constructor(message) {
    this.id = crypto.randomUUID();

    if (typeof message !== "string") {
      throw new Error("Message must be a string");
    }
    this.message = message;
  }
}

export class ResponseBody {
  constructor(id, message) {
    this.id = id;
    this.message = message;
  }
}

const ws = new WebSocket("ws://localhost:3003");

ws.onopen = () => {
  console.log("WebSocket connection established");
};

const pending = new Map();

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const handler = pending.get(data.id);
  if (!handler) return;

  handler.resolve(new ResponseBody(data.id, data.message));
  pending.delete(data.id);
};

export const sendRequest = (requestBody) => {
  return new Promise((resolve, reject) => {
    const timeout = 5000;
    const timer = setTimeout(() => {
      pending.delete(requestBody.id);
      reject(new Error("Request timed out"));
    }, timeout);

    pending.set(requestBody.id, {
      resolve: (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      reject: (err) => {
        clearTimeout(timer);
        reject(err);
      },
    });

    ws.send(JSON.stringify(requestBody));
  });
};

// 2 1.とは別の WebSocket 接続で、WebSocket サーバから転送されたリクエストメッセージを受信してレスポンスを返す実装をしなさい。
const responseWs = new WebSocket("ws://localhost:3003");

responseWs.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (typeof data.id !== "string" || typeof data.message !== "string") {
    console.error("Invalid request format");
    return;
  }

  const responseMessage = `Hello, ${data.message}`;
  responseWs.send(JSON.stringify(new ResponseBody(data.id, responseMessage)));
};

responseWs.onopen = () => {
  console.log("Response WebSocket connection established");
};

responseWs.onerror = (error) => {
  console.error("Response WebSocket error:", error);
};

responseWs.onclose = () => {
  console.log("Response WebSocket connection closed");
};
