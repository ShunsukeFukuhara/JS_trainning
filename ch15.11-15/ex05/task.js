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

  static createNew(name) {
    // 作成時点ではidは割り当てられていないので仮の値を入れる
    return new Task("temp", name, "active");
  }

  toggledTask() {
    const newStatus = this.isActive ? "done" : "active";
    return new Task(this.#id, this.#name, newStatus);
  }

  idAssignedTask(newId) {
    if (this.#id !== "temp") {
      throw new Error("ID is already assigned");
    }
    return new Task(newId, this.#name, this.#status);
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
    if (this.#id === "temp") {
      return {
        name: this.#name,
        status: this.#status,
      };
    }

    return {
      id: this.#id,
      name: this.#name,
      status: this.#status,
    };
  }
}

const taskUpdatedEventKey = "task-updated";

/**
 * IndexedDBとデータ同期をしながらタスクを管理するクラス
 */
export class TaskRepository {
  #dbName = "task-db";
  #storeName = "tasks";
  #version = 1;
  #db = null;
  #channel = null;

  async init() {
    this.#db = await this.#openDB();
    this.#channel = new BroadcastChannel("task_repository_channel");
  }

  #openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.#dbName, this.#version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(this.#storeName)) {
          db.createObjectStore(this.#storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
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

  #notifyTaskUpdated() {
    this.#channel.postMessage(taskUpdatedEventKey);
  }

  registerOnTaskUpdated(callback) {
    this.#channel.addEventListener("message", (event) => {
      if (event.data === taskUpdatedEventKey) {
        callback();
      }
    });
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

      request.onsuccess = () => {
        const newId = request.result; // 自動採番された id
        // 新しいidを持つTaskオブジェクトを返す
        return resolve(task.idAssignedTask(newId));
      };
      request.onerror = () => reject(request.error);

      this.#notifyTaskUpdated();
    });
  }

  async updateTask(updatedTask) {
    const store = this.#getStore("readwrite");

    return new Promise((resolve, reject) => {
      const request = store.put(updatedTask.toJSON());

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      this.#notifyTaskUpdated();
    });
  }

  async removeTask(taskId) {
    const store = this.#getStore("readwrite");

    return new Promise((resolve, reject) => {
      const request = store.delete(taskId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      this.#notifyTaskUpdated();
    });
  }

  async clearTasks() {
    const store = this.#getStore("readwrite");

    return new Promise((resolve, reject) => {
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      this.#notifyTaskUpdated();
    });
  }

  close() {
    if (this.#db) {
      try {
        this.#db.close();
      } catch (_) {
        // ignore
      }
    }
    if (this.#channel) {
      try {
        this.#channel.close();
      } catch (_) {
        // ignore
      }
    }
  }
}
