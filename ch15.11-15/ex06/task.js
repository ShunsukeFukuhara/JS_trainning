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

const taskUpdatedEventKey = "task-updated";

/**
 * sessionStorageとデータ同期をしながらタスクを管理するクラス
 */
export class TaskRepository {
  #storageKey = "tasks";
  #tasks = [];
  #channel = null;

  constructor() {
    this.#tasks = this.#loadTasks();
    this.#channel = new BroadcastChannel("task_repository_channel");
    // 他のタブからの更新通知を受け取り、全く同じ操作をこのセッションでも実行する
    this.#channel.addEventListener("message", (event) => {
      const { type, operation, input } = event.data;
      if (type !== taskUpdatedEventKey) return;
      switch (operation) {
        case "add":
          this.addTask(input, true);
          break;
        case "remove":
          this.removeTask(input, true);
          break;
        case "update":
          this.updateTask(input, true);
          break;
        case "clear":
          this.clearTasks(true);
          break;
      }
    });
  }

  #notifyTaskUpdated(operation, input) {
    this.#channel.postMessage({
      type: taskUpdatedEventKey,
      operation: operation,
      input: input,
    });
  }

  #loadTasks() {
    try {
      const tasksJson = sessionStorage.getItem(this.#storageKey);
      if (!tasksJson) {
        return [];
      }

      const tasksData = JSON.parse(tasksJson);
      return tasksData.map((data) => new Task(data.id, data.name, data.status));
    } catch (e) {
      // sessionStorageの読み込みに失敗した場合は空配列を返す
      if (e instanceof DOMException) {
        console.log("NOTE: Failed to load tasks from sessionStorage");
        return [];
      }

      // それ以外は許容しない
      throw e;
    }
  }

  #saveTasks() {
    try {
      sessionStorage.setItem(this.#storageKey, JSON.stringify(this.#tasks));
    } catch (e) {
      // sessionStorageの読み込みに失敗した場合は正常終了する
      if (e instanceof DOMException) {
        console.log("NOTE: Failed to save tasks to sessionStorage");
        return;
      }

      // それ以外は許容しない
      throw e;
    }
  }

  registerTaskUpdatedListener(listener) {
    this.#channel.addEventListener("message", (event) => {
      const { type } = event.data;
      if (type === taskUpdatedEventKey) {
        listener();
      }
    });
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

  addTask(task, byNotifer = false) {
    this.#tasks.push(task);
    this.#saveTasks();
    if (!byNotifer) {
      this.#notifyTaskUpdated("add", task.toJSON());
    }
  }

  removeTask(taskId, byNotifer = false) {
    this.#tasks = this.#tasks.filter((task) => task.id !== taskId);
    this.#saveTasks();
    if (!byNotifer) {
      this.#notifyTaskUpdated("remove", taskId);
    }
  }

  updateTask(updatedTask, byNotifer = false) {
    this.#tasks = this.#tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.#saveTasks();
    if (!byNotifer) {
      this.#notifyTaskUpdated("update", updatedTask.toJSON());
    }
  }

  clearTasks(byNotifer = false) {
    this.#tasks = [];
    this.#saveTasks();
    if (!byNotifer) {
      this.#notifyTaskUpdated("clear", null);
    }
  }

  close() {
    try {
      this.#channel.close();
    } catch (_) {
      // ignore
    }
  }
}
