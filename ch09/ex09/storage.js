// 端末に適当なデータが入っているものとする
const data = {
  1: { name: "Alice", age: 30 },
  2: { name: "Bob", age: 25 },
  3: { name: "Charlie", age: 35 },
};

// 原則に従わないコード(これ自体が問題ではない)
export class InternalStorage {
  #data = data;

  getData(id) {
    return this.#data[id] || null;
  }

  saveData(id, data) {
    this.#data[id] = data;
  }
}

// 原則に従ったコード
// インターフェースを定義
export class Storage {
  getData(id) {
    void id;
    throw new Error("getData() must be implemented");
  }

  saveData(id, data) {
    void id;
    void data;
    throw new Error("saveData() must be implemented");
  }
}

// 具体的な実装はインターフェースを実装する形で定義
export class InternalStorageWithDI extends Storage {
  getData(id) {
    return data[id] || null;
  }

  saveData(id, data) {
    data[id] = data;
  }
}
