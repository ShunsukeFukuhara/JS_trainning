import { Task, TaskRepository } from "./task.js";

(async (repository) => {
  await repository.init();

  const form = document.querySelector("#new-todo-form");
  const list = document.querySelector("#todo-list");
  const input = document.querySelector("#new-todo");

  // task: {id: string, name: string, status: "active" | "done"}から要素を作成して返す関数
  const createItem = (task) => {
    const elem = document.createElement("li");
    const label = document.createElement("label");
    label.textContent = task.name;
    label.style.textDecorationLine = "none";

    // チェックボックス
    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = task.isDone;
    // チェック状態に応じて取り消し線を引く
    const checkToggle = () => {
      if (toggle.checked) {
        label.style.textDecorationLine = "line-through";
      } else {
        label.style.textDecorationLine = "none";
      }
    };
    checkToggle();

    toggle.addEventListener("change", async () => {
      // idで指定されたタスクを取ってくる
      // taskはcreateItem呼び出し時の古いままのオブジェクトなので、最新の状態を取ってくる必要がある
      const target = await repository.getTaskById(task.id);
      await repository.updateTask(target.toggledTask());
      checkToggle();
    });

    // 削除ボタン
    const destroy = document.createElement("button");
    destroy.textContent = "❌";
    destroy.addEventListener("click", async () => {
      await repository.removeTask(task.id);
      elem.remove();
    });

    elem.append(toggle, label, destroy);

    return elem;
  };

  form.addEventListener("submit", async (e) => {
    // TODO: ここで form のイベントのキャンセルを実施しなさい (なぜでしょう？)
    // 理由: フォームのデフォルトの送信動作を防ぎ、ページのリロードを防ぐため
    e.preventDefault();

    // 両端からホワイトスペースを取り除いた文字列を取得する
    if (input.value.trim() === "") {
      return;
    }
    const todo = input.value.trim();
    // new-todo の中身は空にする
    input.value = "";

    // Taskの作成と保存
    // 保存した後、idが割り当てられたTaskオブジェクトが返される
    const newTask = await repository.addTask(Task.createNew(todo));

    // ここから #todo-list に追加する要素を構築する
    const item = createItem(newTask);

    list.append(item);
  });

  // ページ読み込み時に保存されているタスクを表示する
  const tasks = await repository.getTasks();
  tasks.forEach((task) => {
    const item = createItem(task);
    list.append(item);
  });

  // storageイベントを検知したら、一度listをクリアしてから再描画するコールバックを登録
  repository.registerOnTaskUpdated(async () => {
    // listの中身をクリア
    list.textContent = "";

    // 再描画
    const tasks = await repository.getTasks();
    tasks.forEach((task) => {
      const item = createItem(task);
      list.append(item);
    });
  });
})(new TaskRepository());
