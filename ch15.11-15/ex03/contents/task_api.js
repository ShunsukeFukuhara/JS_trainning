/**
 * タスクを表すクラス
 */
export class Task {
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
export class APIError extends Error {
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
export class TaskAPI {
  #BASE_URL = "http://localhost:3001/api/tasks";
  #HEADERS = {
    "Content-Type": "application/json",
    charset: "utf-8",
  };

  // 共通のfetch処理
  #fetch = async (path, method, body = null) => {
    const options = {
      method,
      mode: "cors", // CORS モードでのリクエスト送信
      credentials: "include", // クロスオリジンでもCookieを送る
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
  };

  /**
   * タスク一覧を取得する
   * @returns {Promise<Task[]>} - タスク一覧
   * @throws {APIError} - 取得に失敗した場合
   */
  fetchTasks = async () => {
    const data = await this.#fetch("", "GET");
    return data.items.map((task) => new Task(task.id, task.name, task.status));
  };

  /**
   * タスクの ID を指定して取得する
   * @param {number} id - タスクID
   * @returns {Promise<Task>} - 取得したタスク
   * @throws {APIError} - 取得に失敗した場合
   */
  fetchTaskById = async (id) => {
    const data = await this.#fetch(`/${id}`, "GET");
    return new Task(data.id, data.name, data.status);
  };

  /**
   * 新しいタスクを作成する
   * @param {string} name - タスク名
   * @returns {Promise<Task>} - 作成したタスク
   * @throws {APIError} - 作成に失敗した場合
   */
  createTask = async (name) => {
    const data = await this.#fetch("", "POST", { name });
    return new Task(data.id, data.name, data.status);
  };

  /**
   * タスクの一部を更新する
   * id以外のプロパティは省略可能。その場合は現在の値が維持される。
   * @param {{ id: number, name?: string, status?: 'active' | 'completed' }} params - 更新するタスクオブジェクト
   * @returns {Promise<Task>} - 更新したタスク
   * @throws {APIError} - 更新に失敗した場合
   */
  updateTask = async (params) => {
    // bodyに含めるプロパティだけを集める
    const { id, ...body } = params;
    const data = await this.#fetch(`/${id}`, "PATCH", body);
    return new Task(data.id, data.name, data.status);
  };

  /**
   * タスクを削除する
   * @param {number} id - タスクID
   * @returns {Promise<true>} - 削除に成功した場合は true を返す
   * @throws {APIError} - 削除に失敗した場合
   */
  deleteTask = async (id) => {
    await this.#fetch(`/${id}`, "DELETE");
    return true;
  };
}
