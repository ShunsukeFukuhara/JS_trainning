const form = document.querySelector("#new-todo-form");
const list = document.querySelector("#todo-list");
const input = document.querySelector("#new-todo");

// エラー発生時の共通処理で関数をラップする
// catchしたエラーはalertで表示し、そのまま例外を投げない
const withHandler = (fn) => {
  return async (...args) => {
    try {
      const result = await fn(...args);
      return result;
    } catch (err) {
      if (err instanceof APIError) {
        alert(`API Error: ${err.message} (status: ${err.status})`);
      } else {
        alert(`Unexpected Error: ${err.message}`);
      }
    }
  };
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log(document.cookie === "" ? "No cookies set" : document.cookie);
  // TODO: ここで API を呼び出してタスク一覧を取得し、
  // 成功したら取得したタスクを appendToDoItem で ToDo リストの要素として追加しなさい
  const tasks = await withHandler(() => new TaskAPI().fetchTasks())();
  (tasks ?? []).forEach((task) => {
    appendToDoItem(task);
  });
});

form.addEventListener("submit", async (e) => {
  // TODO: ここで form のイベントのキャンセルを実施しなさい (なぜでしょう？)
  // デフォルトのフォーム送信動作をキャンセルする
  e.preventDefault();

  // 両端からホワイトスペースを取り除いた文字列を取得する
  const todo = input.value.trim();
  if (todo === "") {
    return;
  }

  // new-todo の中身は空にする
  input.value = "";

  // TODO: ここで API を呼び出して新しいタスクを作成し
  // 成功したら作成したタスクを appendToDoItem で ToDo リストの要素として追加しなさい
  const newTask = await withHandler(() => new TaskAPI().createTask(todo))();

  if (!newTask) {
    return;
  }

  appendToDoItem(newTask);
});

// API から取得したタスクオブジェクトを受け取って、ToDo リストの要素を追加する
function appendToDoItem(task) {
  // ここから #todo-list に追加する要素を構築する
  const elem = document.createElement("li");

  const label = document.createElement("label");
  label.textContent = task.name;
  label.style.textDecorationLine = "none";

  const toggle = document.createElement("input");

  // TODO: toggle が変化 (change) した際に API を呼び出してタスクの状態を更新し
  // 成功したら label.style.textDecorationLine を変更しなさい
  // toggle.type = "checkbox";
  toggle.addEventListener("change", async () => {
    // APIを呼び出してタスクの状態を更新
    const newStatus = toggle.checked ? "completed" : "active";
    const updated = await withHandler(() =>
      new TaskAPI().updateTask({
        id: task.id,
        status: newStatus,
      })
    )();

    if (!updated) {
      return;
    }

    // labelの装飾を変更
    // 厳密な更新を行うため、APIから返ってきたstatusを使う
    if (updated.status === "completed") {
      label.style.textDecorationLine = "line-through";
    } else {
      label.style.textDecorationLine = "none";
    }
  });

  const destroy = document.createElement("button");
  // TODO: destroy がクリック (click) された場合に API を呼び出してタスク を削除し
  // 成功したら elem を削除しなさい
  destroy.addEventListener("click", async () => {
    // APIを呼び出してタスクを削除
    await withHandler(() => new TaskAPI().deleteTask(task.id))();

    if (!task) {
      return;
    }

    // elemを削除
    elem.remove();
  });

  // TODO: elem 内に toggle, label, destroy を追加しなさい
  list.prepend(elem);

  // 要素を組み立てる
  // トグル
  toggle.type = "checkbox";
  if (task.status === "completed") {
    toggle.checked = true;
    label.style.textDecorationLine = "line-through";
  }
  elem.appendChild(toggle);

  // ラベル
  if (task.status === "completed") {
    label.style.textDecorationLine = "line-through";
  }
  label.style.marginLeft = "8px";
  elem.appendChild(label);

  // 削除ボタン
  destroy.textContent = "×";
  destroy.style.marginLeft = "8px";
  elem.appendChild(destroy);
}

/**
 * タスクを表すクラス
 */
class Task {
  /**
   * @param {number} id - タスクを識別するID
   * @param {string} name - タスク名
   * @param {'active' | 'completed'} status - タスクの状態
   * @throws {Error} 不正なstatusが渡された場合
   */
  constructor(id, name, status) {
    this.id = id;
    this.name = name;

    if (status !== "active" && status !== "completed") {
      throw new Error("Invalid status");
    }

    this.status = status;
  }
}

/**
 * APIエラークラス
 */
class APIError extends Error {
  /**
   * @param {string} message - エラーメッセージ
   * @param {number} status - HTTPステータスコード
   */
  constructor({ message, status }) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

/**
 * API仕様をまとめたクラス
 */
class TaskAPI {
  #BASE_URL = "http://localhost:3000/api/tasks";
  #HEADERS = {
    "Content-Type": "application/json",
    charset: "utf-8",
  };

  async #fetch(path, method, body = null) {
    const options = {
      method,
      headers: this.#HEADERS,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.#BASE_URL}${path}`, options);

    // エラーの場合
    if (!response.ok) {
      const err = await response.json();
      throw new APIError({
        message: err.message,
        status: response.status,
      });
    }

    // 成功した場合
    if (response.status === 204) {
      // No Contentの場合は何も返さない
      return;
    }
    return await response.json();
  }

  /**
   * タスク一覧を取得する
   * @returns {Promise<Task[]>} - タスク一覧
   * @throws {APIError} - 取得に失敗した場合
   */
  async fetchTasks() {
    const data = await this.#fetch("", "GET");
    return data.items.map((task) => new Task(task.id, task.name, task.status));
  }

  /**
   * タスクの ID を指定して取得する
   * @param {number} id - タスクID
   * @returns {Promise<Task>} - 取得したタスク
   * @throws {APIError} - 取得に失敗した場合
   */
  async fetchTaskById(id) {
    const data = await this.#fetch(`/${id}`, "GET");
    return new Task(data.id, data.name, data.status);
  }

  /**
   * 新しいタスクを作成する
   * @param {string} name - タスク名
   * @returns {Promise<Task>} - 作成したタスク
   * @throws {APIError} - 作成に失敗した場合
   */
  async createTask(name) {
    const data = await this.#fetch("", "POST", { name });
    return new Task(data.id, data.name, data.status);
  }

  /**
   * タスクの一部を更新する
   * id以外のプロパティは省略可能。その場合は現在の値が維持される。
   * @param {{ id: number, name?: string, status?: 'active' | 'completed' }} params - 更新するタスクオブジェクト
   * @returns {Promise<Task>} - 更新したタスク
   * @throws {APIError} - 更新に失敗した場合
   */
  async updateTask(params) {
    // bodyに含めるプロパティだけを集める
    const { id, ...body } = params;
    const data = await this.#fetch(`/${id}`, "PATCH", body);
    return new Task(data.id, data.name, data.status);
  }

  /**
   * タスクを削除する
   * @param {number} id - タスクID
   * @returns {Promise<void>}
   * @throws {APIError} - 削除に失敗した場合
   */
  async deleteTask(id) {
    await this.#fetch(`/${id}`, "DELETE");
    return;
  }
}
