import { TaskAPI, APIError } from "./task_api.js";
import { TimeoutError } from "./backoff_helper.js";

const form = document.querySelector("#new-todo-form");
const list = document.querySelector("#todo-list");
const input = document.querySelector("#new-todo");

// 処理中は画面全体をブロックする
const withUIblocker = async (callback) => {
  // オーバーレイ要素を作成
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.5)";

  // 中央にローディングするgifを追加
  const loading = document.createElement("img");
  loading.src = "https://media.giphy.com/media/3o7TKtbdY5oZuiyucg/giphy.gif"; // ローディングgifのパスを指定
  loading.style.position = "absolute";
  loading.style.top = "50%";
  loading.style.left = "50%";
  loading.style.transform = "translate(-50%, -50%)";
  overlay.appendChild(loading);

  // 要素を追加
  document.body.appendChild(overlay);

  // 処理を実行
  return await callback().finally(() => {
    // オーバーレイ要素を削除
    overlay.remove();
  });
};

// 通信の共通処理で関数をラップする
const withHandler = async (callback) => {
  try {
    return await withUIblocker(callback);
  } catch (err) {
    // catchしたエラーはalertで表示し、そのまま例外を投げない
    if (err instanceof APIError) {
      alert(`API Error: ${err.message} (status: ${err.status})`);
    } else if (err instanceof TimeoutError) {
      alert(`Operation timed out`);
    } else {
      alert(`Unexpected Error: ${err.message}`);
    }
    return undefined;
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log(document.cookie === "" ? "No cookies set" : document.cookie);
  // TODO: ここで API を呼び出してタスク一覧を取得し、
  // 成功したら取得したタスクを appendToDoItem で ToDo リストの要素として追加しなさい
  const tasks = await withHandler(new TaskAPI().fetchTasks);
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
  const newTask = await withHandler(() => new TaskAPI().createTask(todo));

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
    );

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
    const isDeleted = await withHandler(() =>
      new TaskAPI().deleteTask(task.id)
    );

    if (!isDeleted) {
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
