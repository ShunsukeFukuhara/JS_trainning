const form = document.querySelector("#new-todo-form");
const list = document.querySelector("#todo-list");
const input = document.querySelector("#new-todo");
const template = document.querySelector("#todo-template");

// { content: "...", completed: true or false } の配列
let todos = [];

function renderTodos(todos) {
  list.innerHTML = "";
  todos.forEach((todo, index) => {
    const clone = template.content.cloneNode(true);
    const li = clone.querySelector("li");
    const toggle = clone.querySelector("input");
    const label = clone.querySelector("label");
    const destroy = clone.querySelector("button");

    li.classList.toggle("completed", todo.completed);
    toggle.addEventListener("change", () => {
      todo.completed = toggle.checked;
      renderTodos(todos);
      filterByHash();
    });
    label.textContent = todo.content;
    toggle.checked = todo.completed;
    destroy.addEventListener("click", () => {
      todos.splice(index, 1);
      deleteTodo(todo.content);
      renderTodos(todos);
      filterByHash();
    });

    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim() === "") {
    return;
  }
  const todo = input.value.trim();
  input.value = "";

  todos.push({ content: todo, completed: false });
  renderTodos(todos);
  filterByHash();
  // /completed時に新規追加すると即時非表示になるので、alertで通知
  if (location.hash === "#/completed") {
    alert(
      `新しいTODO("${todo}")が追加されましたが、現在のフィルタ設定のため表示されていません。`
    );
  }
});

// URLのハッシュが変化したときに実行される
window.addEventListener("hashchange", () => {
  filterByHash();
});

function deleteTodo(content) {
  todos = todos.filter((t) => t.content !== content);
}

// ハッシュに基づいてTODOをフィルタリングして表示する関数
// URL変化だけでなく、各操作後にも呼び出される
const filterByHash = () => {
  // "/active"の場合、未完了のTODOのみ表示
  if (location.hash === "#/active") {
    const activeTodos = todos.filter((t) => !t.completed);
    renderTodos(activeTodos);
  }
  // "/completed"の場合、完了済みのTODOのみ表示
  else if (location.hash === "#/completed") {
    const completedTodos = todos.filter((t) => t.completed);
    renderTodos(completedTodos);
  }
  // それ以外の場合、全てのTODOを表示
  else {
    renderTodos(todos);
  }
};
