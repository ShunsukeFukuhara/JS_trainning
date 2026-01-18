import { Task, TaskRepository } from "./task.js";
import { jest, test } from "@jest/globals";

// LocalStorageのモックを作成
const mockLocalStorage = () => {
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
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = mockLocalStorage();

    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      configurable: true,
    });

    repo = new TaskRepository();
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
    expect(localStorage.setItem).toHaveBeenCalled();
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

  test("updateTask()でタスクが更新される", () => {
    const task = new Task("1", "a", "active", 1);
    repo.addTask(task);

    const updated = task.toggledTask();
    repo.updateTask(updated);

    const tasks = repo.getTasks();
    expect(tasks[0].status).toBe("done");
  });

  test("clearTasks()で全削除される", () => {
    repo.addTask(new Task("1", "a", "active", 1));
    repo.addTask(new Task("2", "b", "done", 2));

    repo.clearTasks();

    expect(repo.getTasks()).toEqual([]);
  });

  test("constructorでlocalStorageの内容が復元される", () => {
    const stored = [
      { id: "1", name: "a", status: "active", timestamp: 1 },
      { id: "2", name: "b", status: "done", timestamp: 2 },
    ];

    localStorage.setItem("tasks", JSON.stringify(stored));

    const repo2 = new TaskRepository();

    const tasks = repo2.getTasks();
    expect(tasks.length).toBe(2);
    expect(tasks[0]).toBeInstanceOf(Task);
    expect(tasks[1].status).toBe("done");
  });

  test("getTasks({ enforceReload: true })で再読み込みされる", () => {
    const initial = [{ id: "1", name: "a", status: "active", timestamp: 1 }];
    localStorage.setItem("tasks", JSON.stringify(initial));

    const repo2 = new TaskRepository();
    expect(repo2.getTasks().length).toBe(1);

    const updated = [{ id: "2", name: "b", status: "done", timestamp: 2 }];
    localStorage.setItem("tasks", JSON.stringify(updated));

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

  test("localStorage 例外時でもgetTasksはクラッシュしない", () => {
    localStorage.getItem.mockImplementation(() => {
      throw new DOMException("Quota exceeded");
    });
    const repo2 = new TaskRepository();

    expect(repo2.getTasks()).toEqual([]);
  });

  test("localStorage 例外時でもaddTaskはクラッシュしない", () => {
    localStorage.setItem.mockImplementation(() => {
      throw new DOMException("Quota exceeded");
    });

    repo.addTask(new Task("1", "a", "active", 1));

    expect(repo.getTasks().length).toBe(1);
  });
});
