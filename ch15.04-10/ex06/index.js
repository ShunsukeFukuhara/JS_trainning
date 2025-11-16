const template = document.createElement("template");
template.innerHTML = `\
<style>
.completed {
  text-decoration: line-through;
}
</style>

<form id="new-todo-form">
  <input type="text" id="new-todo" placeholder="What needs to be done?" />
  <button>Add</button>
</form>
<ul id="todo-list"></ul>
`;

class TodoApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.form = this.shadowRoot.querySelector("#new-todo-form");
    // TODO: 残りを実装
    this.input = this.shadowRoot.querySelector("#new-todo");

    // フォームの送信イベント
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (this.input.value.trim() === "") {
        return;
      }

      this.addTodo(this.input.value);
      this.input.value = "";
    });
  }

  addTodo(text) {
    const list = this.shadowRoot.querySelector("#todo-list");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const span = document.createElement("span");
    span.textContent = text;

    // チェックボックスの変更イベント
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        span.classList.add("completed");
      } else {
        span.classList.remove("completed");
      }
    });

    const listItem = list.appendChild(document.createElement("li"));
    listItem.appendChild(checkbox);
    listItem.appendChild(span);
    // 追加したアイテムを先頭に表示
    list.insertBefore(listItem, list.firstChild);

    // アイテムから先頭の・を削除
    listItem.style.listStyle = "none";

    // submit時に、完了したアイテムをリストの最後に移動
    this.form.addEventListener("submit", () => {
      if (checkbox.checked) {
        list.appendChild(listItem);
      }
    });
  }
}

customElements.define("todo-app", TodoApp);
