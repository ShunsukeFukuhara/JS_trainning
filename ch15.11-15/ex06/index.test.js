import { Task, TaskRepository } from "./task.js";
import { jest, test } from "@jest/globals";

// SessionStorageのモックを作成
const mockSessionStorage = () => {
  let store = {};

  return {
    getItem: jest.fn((key) => store[key] ?? null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
};

// Taskのテスト
describe("Task", () => {
  test("create()でactive状態のTaskが生成される", () => {
    const task = Task.create("test");

    expect(task.name).toBe("test");
    expect(task.status).toBe("active");
    expect(task.id).toBeDefined();
  });

  test("isActive/isDoneが正しく判定される", () => {
    const active = new Task("1", "a", "active", 1);
    const done = new Task("2", "b", "done", 1);

    expect(active.isActive).toBe(true);
    expect(active.isDone).toBe(false);

    expect(done.isActive).toBe(false);
    expect(done.isDone).toBe(true);
  });

  test("toggledTask()で状態が反転するが、他のプロパティは保持される", () => {
    const task = new Task("1", "a", "active", 999);

    const toggled = task.toggledTask();

    expect(toggled.status).toBe("done");
    expect(toggled.id).toBe("1");
    expect(toggled.name).toBe("a");
    expect(toggled).not.toBe(task);
  });
});

// TaskRepositoryのテスト
describe("TaskRepository", () => {
  let repo;
  let sessionStorageMock;

  beforeEach(() => {
    sessionStorageMock = mockSessionStorage();

    Object.defineProperty(global, "sessionStorage", {
      value: sessionStorageMock,
      configurable: true,
    });

    // BroadcastChannelが呼ばれたらspyを仕込む
    // postMessageが呼ばれたらjest.fn()で監視できるようにする
    jest.spyOn(global, "BroadcastChannel").mockImplementation(() => {
      const listeners = new Map();

      return {
        postMessage: jest.fn(() => {
          // テスト側で postMessage を監視できるようにするだけ
        }),

        close: jest.fn(),

        addEventListener: jest.fn((eventName, callback) => {
          if (!listeners.has(eventName)) {
            listeners.set(eventName, []);
          }
          listeners.get(eventName).push(callback);
        }),

        // テスト用イベント発火メソッド
        __trigger(eventName, event) {
          const callbacks = listeners.get(eventName) || [];
          callbacks.forEach((cb) => cb(event));
        },
      };
    });

    repo = new TaskRepository();
  });

  afterEach(async () => {
    await repo.close();
    jest.clearAllMocks();
  });

  test("初期状態ではtasksは空", () => {
    expect(repo.getTasks()).toEqual([]);
  });

  test("addTask()でタスクが追加される", () => {
    const task = new Task("1", "test", "active", 1);

    repo.addTask(task);

    const tasks = repo.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].name).toBe("test");
    expect(sessionStorage.setItem).toHaveBeenCalled();
  });

  test("addTask()がBroadcastChannelで通知を送る", () => {
    const task = new Task("1", "test", "active", 1);
    repo.addTask(task);
    expect(global.BroadcastChannel).toHaveBeenCalledWith(
      "task_repository_channel"
    );

    const last = global.BroadcastChannel.mock.results[0].value;

    expect(last.postMessage).toHaveBeenCalledWith({
      type: "task-updated",
      operation: "add",
      input: task.toJSON(),
    });
  });

  test("removeTask()で指定IDのタスクが削除される", () => {
    const t1 = new Task("1", "a", "active", 1);
    const t2 = new Task("2", "b", "active", 2);

    repo.addTask(t1);
    repo.addTask(t2);

    repo.removeTask("1");

    const tasks = repo.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].id).toBe("2");
  });

  test("removeTask()がBroadcastChannelで通知を送る", () => {
    const task = new Task("1", "test", "active", 1);
    repo.addTask(task);
    repo.removeTask("1");
    const last = global.BroadcastChannel.mock.results[0].value;
    expect(last.postMessage).toHaveBeenCalledWith({
      type: "task-updated",
      operation: "remove",
      input: "1",
    });
  });

  test("updateTask()でタスクが更新される", () => {
    const task = new Task("1", "a", "active", 1);
    repo.addTask(task);

    const updated = task.toggledTask();
    repo.updateTask(updated);

    const tasks = repo.getTasks();
    expect(tasks[0].status).toBe("done");
  });

  test("updateTask()がBroadcastChannelで通知を送る", () => {
    const task = new Task("1", "test", "active", 1);
    repo.addTask(task);
    const updated = task.toggledTask();
    repo.updateTask(updated);
    const last = global.BroadcastChannel.mock.results[0].value;
    expect(last.postMessage).toHaveBeenCalledWith({
      type: "task-updated",
      operation: "update",
      input: updated.toJSON(),
    });
  });

  test("clearTasks()で全削除される", () => {
    repo.addTask(new Task("1", "a", "active", 1));
    repo.addTask(new Task("2", "b", "done", 2));

    repo.clearTasks();

    expect(repo.getTasks()).toEqual([]);
  });

  test("clearTasks()がBroadcastChannelで通知を送る", () => {
    repo.addTask(new Task("1", "test", "active", 1));
    repo.clearTasks();
    const last = global.BroadcastChannel.mock.results[0].value;
    expect(last.postMessage).toHaveBeenCalledWith({
      type: "task-updated",
      operation: "clear",
      input: null,
    });
  });

  test("constructorでsessionStorageの内容が復元される", () => {
    const stored = [
      { id: "1", name: "a", status: "active", timestamp: 1 },
      { id: "2", name: "b", status: "done", timestamp: 2 },
    ];

    sessionStorage.setItem("tasks", JSON.stringify(stored));

    const repo2 = new TaskRepository();

    const tasks = repo2.getTasks();
    expect(tasks.length).toBe(2);
    expect(tasks[0]).toBeInstanceOf(Task);
    expect(tasks[1].status).toBe("done");
  });

  test("他タブからaddが届いたらローカルのtasksも更新される", () => {
    const channel = global.BroadcastChannel.mock.results[0].value;

    channel.__trigger("message", {
      data: {
        type: "task-updated",
        operation: "add",
        input: { id: "1", name: "test", status: "active" },
      },
    });

    const tasks = repo.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].id).toBe("1");
  });

  test("他タブからremoveが届いたらローカルのtasksも更新される", () => {
    const task = new Task("1", "a", "active", 1);
    repo.addTask(task);
    const channel = global.BroadcastChannel.mock.results[0].value;

    channel.__trigger("message", {
      data: {
        type: "task-updated",
        operation: "remove",
        input: "1",
      },
    });
    const tasks = repo.getTasks();
    expect(tasks.length).toBe(0);
  });

  test("他タブからupdateが届いたらローカルのtasksも更新される", () => {
    const task = new Task("1", "a", "active", 1);
    repo.addTask(task);
    const channel = global.BroadcastChannel.mock.results[0].value;
    channel.__trigger("message", {
      data: {
        type: "task-updated",
        operation: "update",
        input: { id: "1", name: "a", status: "done" },
      },
    });
    const tasks = repo.getTasks();
    expect(tasks[0].status).toBe("done");
  });

  test("他タブからclearが届いたらローカルのtasksも更新される", () => {
    repo.addTask(new Task("1", "a", "active", 1));
    const channel = global.BroadcastChannel.mock.results[0].value;
    channel.__trigger("message", {
      data: {
        type: "task-updated",
        operation: "clear",
        input: null,
      },
    });
    expect(repo.getTasks().length).toBe(0);
  });

  test("getTasks({ enforceReload: true })で再読み込みされる", () => {
    const initial = [{ id: "1", name: "a", status: "active", timestamp: 1 }];
    sessionStorage.setItem("tasks", JSON.stringify(initial));

    const repo2 = new TaskRepository();
    expect(repo2.getTasks().length).toBe(1);

    const updated = [{ id: "2", name: "b", status: "done", timestamp: 2 }];
    sessionStorage.setItem("tasks", JSON.stringify(updated));

    const reloaded = repo2.getTasks({ enforceReload: true });
    expect(reloaded.length).toBe(1);
    expect(reloaded[0].id).toBe("2");
  });

  test("getTaskById()でID指定でタスクが取得できる", () => {
    const task = new Task("1", "a", "active", 1);
    repo.addTask(task);
    const fetched = repo.getTaskById("1");

    expect(fetched).toBe(task);
  });

  test("getTaskById()で存在しないIDを指定すると例外が投げられる", () => {
    expect(() => {
      repo.getTaskById("nonexistent");
    }).toThrowError("Task with id nonexistent not found");
  });

  test("sessionStorage 例外時でもgetTasksはクラッシュしない", () => {
    sessionStorage.getItem.mockImplementation(() => {
      throw new DOMException("Quota exceeded");
    });
    const repo2 = new TaskRepository();

    expect(repo2.getTasks()).toEqual([]);
  });

  test("sessionStorage 例外時でもaddTaskはクラッシュしない", () => {
    sessionStorage.setItem.mockImplementation(() => {
      throw new DOMException("Quota exceeded");
    });

    repo.addTask(new Task("1", "a", "active", 1));

    expect(repo.getTasks().length).toBe(1);
  });

  test("registerTaskUpdatedListener()で登録したリスナーがBroadcastChannelのメッセージで呼ばれる", () => {
    const listener = jest.fn();
    repo.registerTaskUpdatedListener(listener);

    const channelInstance = global.BroadcastChannel.mock.results[0].value;

    // 登録されたコールバック
    // 0番目TaskRepositoryのコンストラクタ内で登録されたlistenerなので、1番目が今回登録したlistenerとなる
    const handler = channelInstance.addEventListener.mock.calls[1][1];

    // 呼び出す
    const event = new MessageEvent("message", {
      data: { type: "task-updated" },
    });

    handler(event);

    expect(listener).toHaveBeenCalled();
  });
});
