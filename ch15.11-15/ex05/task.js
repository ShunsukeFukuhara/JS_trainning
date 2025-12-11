/**
 * タスク
 * イミュータブルなオブジェクトとして実装
 */
export class Task {
  #id;
  #name;
  #status;

  constructor(id, name, status) {
    this.#id = id;
    this.#name = name;
    this.#status = status;

    Object.freeze(this);
  }

  static create(name) {
    const id = crypto.randomUUID();
    return new Task(id, name, "active");
  }

  toggledTask() {
    const newStatus = this.isActive ? "done" : "active";
    return new Task(this.#id, this.#name, newStatus);
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get status() {
    return this.#status;
  }

  get isActive() {
    return this.#status === "active";
  }

  get isDone() {
    return this.#status === "done";
  }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      status: this.#status,
    };
  }
}

/**
 * IndexedDBとデータ同期をしながらタスクを管理するクラス
 */

export class TaskRepository {
  #dbName = "task-db";
  #storeName = "tasks";
  #version = 1;
  #db = null;

  async init() {
    this.#db = await this.#openDB();
  }

  #openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.#dbName, this.#version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(this.#storeName)) {
          db.createObjectStore(this.#storeName, { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  #getStore(mode = "readonly") {
    const tx = this.#db.transaction(this.#storeName, mode);
    return tx.objectStore(this.#storeName);
  }

  async getTasks() {
    const store = this.#getStore("readonly");

    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => {
        const tasks = request.result.map(
          (data) => new Task(data.id, data.name, data.status)
        );
        resolve(tasks);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getTaskById(taskId) {
    const store = this.#getStore("readonly");

    return new Promise((resolve, reject) => {
      const request = store.get(taskId);

      request.onsuccess = () => {
        if (!request.result) {
          reject(new Error(`Task with id ${taskId} not found`));
          return;
        }

        const data = request.result;
        resolve(new Task(data.id, data.name, data.status));
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async addTask(task) {
    const store = this.#getStore("readwrite");

    return new Promise((resolve, reject) => {
      const request = store.add(task.toJSON());

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateTask(updatedTask) {
    const store = this.#getStore("readwrite");

    return new Promise((resolve, reject) => {
      const request = store.put(updatedTask.toJSON());

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async removeTask(taskId) {
    const store = this.#getStore("readwrite");

    return new Promise((resolve, reject) => {
      const request = store.delete(taskId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearTasks() {
    const store = this.#getStore("readwrite");

    return new Promise((resolve, reject) => {
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
