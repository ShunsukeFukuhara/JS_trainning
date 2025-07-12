import { InternalStorage, InternalStorageWithDI } from "./storage.js";

// 依存性逆転の原則（dependency inversion principle）の説明
// コードは各原則を説明するためのスケルトンコードで良く、実際に動作する必要はない

// 原則に従っていないコード
class UserService {
  getUser(id) {
    // 具体的なデータベースの実装に依存している
    const db = new InternalStorage();
    return db.getData(id);
  }

  setUser(id, data) {
    // **ビジネスロジック的な処理
    if (data === null || typeof data !== "object" || !data.name || !data.age) {
      throw new Error("Invalid data");
    }
    const { name, age } = data;
    if (name.length < 1 || name.length > 100) {
      throw new Error("Name must be between 1 and 100 characters");
    }
    if (age < 0) {
      throw new Error("Age must be non-negative");
    }
    // **

    // 具体的なデータベースの実装に依存している
    const db = new InternalStorage();
    db.saveData(id, data);
  }
}

const service = new UserService();
service.setUser(1, { name: "Alice", age: 50 });
console.log(service.getUser(1));

// 原則に従ったコード
// UserServiceは抽象のStorageに依存する
class UserServiceWithDI {
  constructor(storage) {
    this.storage = storage;
  }

  getUser(id) {
    // 抽象のStorageに依存している
    return this.storage.getData(id);
  }

  setUser(id, data) {
    // **ビジネスロジック的な処理
    if (data === null || typeof data !== "object" || !data.name || !data.age) {
      throw new Error("Invalid data");
    }
    const { name, age } = data;
    if (name.length < 1 || name.length > 100) {
      throw new Error("Name must be between 1 and 100 characters");
    }
    if (age < 0) {
      throw new Error("Age must be non-negative");
    }
    // **

    // 抽象のStorageに依存している
    this.storage.saveData(id, data);
  }
}

// 具体的な実装を渡して外部から依存性を注入する
const storage = new InternalStorageWithDI();
const serviceWithDI = new UserServiceWithDI(storage);
serviceWithDI.setUser(2, { name: "Bob", age: 40 });
console.log(serviceWithDI.getUser(2));
