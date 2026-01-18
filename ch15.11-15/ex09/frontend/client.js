export class RequestBody {
  constructor(type, row = null, col = null) {
    this.type = type;

    if (type === "toggle") {
      if (!Number.isInteger(row) || !Number.isInteger(col)) {
        throw new Error("row and col must be integers for toggle");
      }
      this.row = row;
      this.col = col;
    }

    if (type === "pause" || type === "start") {
      // この２つの場合、他のパラメータは不要
    }
  }

  static toggle(row, col) {
    return new RequestBody("toggle", row, col);
  }

  static pause() {
    return new RequestBody("pause");
  }

  static start() {
    return new RequestBody("start");
  }
}

export class ResponseBody {
  constructor(type, grid = []) {
    if (type !== "update") {
      throw new Error("type must be 'update'");
    }

    if (!grid.every((r) => r.every((c) => typeof c === "boolean"))) {
      throw new Error("grid must be a 2D array of booleans");
    }

    this.type = type;
    this.grid = grid;
  }

  static update(grid) {
    return new ResponseBody("update", grid);
  }
}

const ws = new WebSocket("ws://localhost:3003");

ws.onopen = () => {
  console.log("WebSocket connection established");
};

export const sendRequest = (requestBody) => {
  return new Promise((resolve, reject) => {
    try {
      ws.send(JSON.stringify(requestBody));
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

let onResponseCallback = null;

export const onResponse = (callback) => {
  onResponseCallback = callback;
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // サーバからレスポンスとして受け取るのはupdateメッセージのみ。そのほかのメッセージは無視。
  if (data.type === "update") {
    const response = ResponseBody.update(data.grid);
    if (onResponseCallback) {
      onResponseCallback(response);
    }
  }
};
