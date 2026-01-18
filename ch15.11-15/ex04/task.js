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
 * localStorageとデータ同期をしながらタスクを管理するクラス
 */
export class TaskRepository {
  #storageKey = "tasks";
  #tasks = [];

  constructor() {
    this.#tasks = this.#loadTasks();
  }

  #loadTasks() {
    try {
      const tasksJson = localStorage.getItem(this.#storageKey);
      if (!tasksJson) {
        return [];
      }

      const tasksData = JSON.parse(tasksJson);
      return tasksData.map((data) => new Task(data.id, data.name, data.status));
    } catch (e) {
      // localStorageの読み込みに失敗した場合は空配列を返す
      if (e instanceof DOMException) {
        console.log("NOTE: Failed to load tasks from localStorage");
        return [];
      }

      // それ以外は許容しない
      throw e;
    }
  }

  #saveTasks() {
    try {
      localStorage.setItem(this.#storageKey, JSON.stringify(this.#tasks));
    } catch (e) {
      // localStorageの読み込みに失敗した場合は正常終了する
      if (e instanceof DOMException) {
        console.log("NOTE: Failed to save tasks to localStorage");
        return;
      }

      // それ以外は許容しない
      throw e;
    }
  }

  getTasks({ enforceReload = false } = {}) {
    if (enforceReload) {
      this.#tasks = this.#loadTasks();
    }
    // 内部の配列を直接変更されないようにコピーを返す
    return [...this.#tasks];
  }

  getTaskById(taskId) {
    const task = this.#tasks.find((task) => task.id === taskId);
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    return task;
  }

  addTask(task) {
    this.#tasks.push(task);
    this.#saveTasks();
  }

  removeTask(taskId) {
    this.#tasks = this.#tasks.filter((task) => task.id !== taskId);
    this.#saveTasks();
  }

  updateTask(updatedTask) {
    this.#tasks = this.#tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.#saveTasks();
  }

  clearTasks() {
    this.#tasks = [];
    this.#saveTasks();
  }
}
