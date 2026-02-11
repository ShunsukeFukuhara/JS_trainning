// @flow

type User = { id: number, name: string };

type Task = { title: string, completed: boolean, user: User };

type Priority = 'low' | 'middle' | 'high';

export type PriorityTask = Task & { priority: Priority };

function isUserObject(obj: mixed): boolean {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj['id'] === 'number' &&
    typeof obj['name'] === 'string'
  );
}

type Predicate<T> = (arg: T) => boolean;

export class TaskManager<T: Task> {
  _tasks: T[];

  constructor() {
    this._tasks = [];
  }

  // タスクを追加する
  add(task: T) {
    this._tasks.push(task);
  }

  completeTask(target: string | User) {
    if (isUserObject(target)) {
      this._tasks
        .filter((t) => t.user === target)
        .forEach((t) => (t.completed = true));
    } else {
      this._tasks
        .filter((t) => t.title === target)
        .forEach((t) => (t.completed = true));
    }
  }

  getTasks(predicate: ?Predicate<T>): T[] {
    if (!predicate) {
      return this._tasks;
    } else {
      return this._tasks.filter(predicate);
    }
  }
}

export function isLowOrCompletedTask(priorityTask: PriorityTask): boolean {
  return priorityTask.priority === 'low' || priorityTask.completed;
}

export function not<T>(f: Predicate<T>): Predicate<T> {
  return (arg) => !f(arg);
}
