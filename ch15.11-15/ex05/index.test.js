import { Task, TaskRepository } from "./task.js";
import { test, jest } from "@jest/globals";
// IndexedDBのモックを自動で有効化
import "fake-indexeddb/auto";

// Taskのテスト
describe("Task", () => {
  test("createNew()でactive状態の仮idを持つTaskが生成される", () => {
    const task = Task.createNew("test");

    expect(task.name).toBe("test");
    expect(task.status).toBe("active");
    expect(task.id).toBe("temp");
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

  test("idAssignedTask()で仮idが本物のidに置き換えられる", () => {
    const task = new Task("temp", "a", "active");
    const assigned = task.idAssignedTask("100");

    expect(assigned.id).toBe("100");
    expect(assigned.name).toBe("a");
    expect(assigned.status).toBe("active");
    expect(assigned).not.toBe(task);
  });

  test("idAssignedTask()は本物のidが既に割り当てられている場合例外を投げる", () => {
    const task = new Task("1", "a", "active");
    expect(() => {
      task.idAssignedTask("100");
    }).toThrow();
  });

  test("toJSON()で適切なオブジェクトが得られる", () => {
    const task = new Task("1", "a", "active");
    const json = task.toJSON();
    expect(json).toEqual({ id: "1", name: "a", status: "active" });
  });

  test("toJSON()は仮idのときidを含まないオブジェクトを返す", () => {
    const task = new Task("temp", "a", "active");
    const json = task.toJSON();
    expect(json).toEqual({ name: "a", status: "active" });
  });
});

// TaskRepositoryのテスト
describe("TaskRepository", () => {
  let repo;

  beforeEach(async () => {
    repo = new TaskRepository();
    await repo.init();
    await repo.clearTasks(); // DB 初期化

    // BroadcastChannelが呼ばれたらspyを仕込む
    jest.spyOn(global, "BroadcastChannel").mockImplementation(() => {
      return {
        postMessage: jest.fn(),
        close: jest.fn(),
      };
    });
  });

  afterEach(async () => {
    await repo.close();
    jest.clearAllMocks();
  });

  test("初期状態ではtasksは空", async () => {
    const tasks = await repo.getTasks();
    expect(tasks).toEqual([]);
  });

  test("addTask()で仮タスクが追加され、idを持つタスクになる", async () => {
    const task = Task.createNew("test");
    const savedTask = await repo.addTask(task);
    expect(savedTask.id).not.toBe("temp");
  });

  test("addTask()実行時にBroadcastChannelで通知が送られる", async () => {
    const task = Task.createNew("test");
    await repo.addTask(task);
    expect(global.BroadcastChannel).toHaveBeenCalledWith(
      "task_repository_channel"
    );
    const channelInstance = global.BroadcastChannel.mock.results[0].value;
    expect(channelInstance.postMessage).toHaveBeenCalledWith("task-updated");
  });

  test("removeTask()で指定IDのタスクが削除される", async () => {
    const t1 = await repo.addTask(Task.createNew("a"));
    const t2 = await repo.addTask(Task.createNew("b"));

    await repo.removeTask(t1.id);

    const tasks = await repo.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].id).toBe(t2.id);
  });

  test("removeTask()実行時にBroadcastChannelで通知が送られる", async () => {
    const task = await repo.addTask(Task.createNew("test"));
    await repo.removeTask(task.id);
    const channelInstance = global.BroadcastChannel.mock.results[0].value;
    expect(channelInstance.postMessage).toHaveBeenCalledWith("task-updated");
  });

  test("updateTask()でタスクが更新される", async () => {
    const task = await repo.addTask(Task.createNew("a"));

    const updated = task.toggledTask();
    await repo.updateTask(updated);

    const tasks = await repo.getTasks();
    expect(tasks[0].status).toBe("done");
  });

  test("updateTask()実行時にBroadcastChannelで通知が送られる", async () => {
    const task = await repo.addTask(Task.createNew("test"));
    const updated = task.toggledTask();
    await repo.updateTask(updated);
    const channelInstance = global.BroadcastChannel.mock.results[0].value;
    expect(channelInstance.postMessage).toHaveBeenCalledWith("task-updated");
  });

  test("clearTasks()で全削除される", async () => {
    await repo.addTask(Task.createNew("a"));
    const taskB = await repo.addTask(Task.createNew("b"));
    await repo.updateTask(taskB.toggledTask());
    await repo.clearTasks();

    const tasks = await repo.getTasks();
    expect(tasks).toEqual([]);
  });

  test("clearTasks()実行時にBroadcastChannelで通知が送られる", async () => {
    await repo.addTask(Task.createNew("test"));
    await repo.clearTasks();
    const channelInstance = global.BroadcastChannel.mock.results[0].value;
    expect(channelInstance.postMessage).toHaveBeenCalledWith("task-updated");
  });

  test("init後にIndexedDBの内容が復元される", async () => {
    const repo1 = new TaskRepository();
    await repo1.init();

    await repo1.addTask(Task.createNew("a"));
    const task2 = await repo1.addTask(Task.createNew("b"));
    await repo1.updateTask(task2.toggledTask());

    const repo2 = new TaskRepository();
    await repo2.init();

    const tasks = await repo2.getTasks();
    expect(tasks.length).toBe(2);
    expect(tasks[0]).toBeInstanceOf(Task);
    expect(tasks[1].status).toBe("done");

    await repo1.close();
    await repo2.close();
  });

  test("getTaskById()でID指定でタスクが取得できる", async () => {
    const task = await repo.addTask(Task.createNew("a"));
    await repo.updateTask(task.toggledTask());

    const fetched = await repo.getTaskById(task.id);
    expect(fetched.id).toBe(task.id);
    expect(fetched.name).toBe("a");
    expect(fetched.status).toBe("done");
  });

  test("getTaskById()で存在しないIDを指定すると例外が投げられる", async () => {
    await expect(repo.getTaskById("nonexistent")).rejects.toThrow(
      "Task with id nonexistent not found"
    );
  });
});
