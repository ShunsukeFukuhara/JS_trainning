import { Task, TaskRepository } from "./task.js";
import { test } from "@jest/globals";

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

  beforeEach(async () => {
    repo = new TaskRepository();
    await repo.init();
    await repo.clearTasks(); // DB 初期化
  });

  test("初期状態ではtasksは空", async () => {
    const tasks = await repo.getTasks();
    expect(tasks).toEqual([]);
  });

  test("addTask()でタスクが追加される", async () => {
    const task = new Task("1", "test", "active");

    await repo.addTask(task);

    const tasks = await repo.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].name).toBe("test");
  });

  test("removeTask()で指定IDのタスクが削除される", async () => {
    const t1 = new Task("1", "a", "active");
    const t2 = new Task("2", "b", "active");

    await repo.addTask(t1);
    await repo.addTask(t2);

    await repo.removeTask("1");

    const tasks = await repo.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].id).toBe("2");
  });

  test("updateTask()でタスクが更新される", async () => {
    const task = new Task("1", "a", "active");
    await repo.addTask(task);

    const updated = task.toggledTask();
    await repo.updateTask(updated);

    const tasks = await repo.getTasks();
    expect(tasks[0].status).toBe("done");
  });

  test("clearTasks()で全削除される", async () => {
    await repo.addTask(new Task("1", "a", "active"));
    await repo.addTask(new Task("2", "b", "done"));

    await repo.clearTasks();

    const tasks = await repo.getTasks();
    expect(tasks).toEqual([]);
  });

  test("init後にIndexedDBの内容が復元される", async () => {
    const repo1 = new TaskRepository();
    await repo1.init();

    await repo1.addTask(new Task("1", "a", "active"));
    await repo1.addTask(new Task("2", "b", "done"));

    const repo2 = new TaskRepository();
    await repo2.init();

    const tasks = await repo2.getTasks();
    expect(tasks.length).toBe(2);
    expect(tasks[0]).toBeInstanceOf(Task);
    expect(tasks[1].status).toBe("done");
  });

  test("getTaskById()でID指定でタスクが取得できる", async () => {
    const task = new Task("1", "a", "active");
    await repo.addTask(task);

    const fetched = await repo.getTaskById("1");
    expect(fetched.id).toBe("1");
    expect(fetched.name).toBe("a");
  });

  test("getTaskById()で存在しないIDを指定すると例外が投げられる", async () => {
    await expect(repo.getTaskById("nonexistent")).rejects.toThrow(
      "Task with id nonexistent not found"
    );
  });
});
