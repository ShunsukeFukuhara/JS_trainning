import React from 'react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type AppState = {
  todos: Todo[];
  inputValue: string;
};

class App extends React.Component {
  state: AppState = {
    todos: [],
    inputValue: '',
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ページリロード防止

    const value = this.state.inputValue.trim();
    if (value === '') return;

    const newTodo: Todo = {
      id: Date.now(),
      text: value,
      completed: false,
    };

    this.setState((prevState: AppState) => ({
      todos: [newTodo, ...prevState.todos],
      inputValue: '',
    }));
  };

  toggleTodo = (id: number) => {
    this.setState((prevState: AppState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    }));
  };

  deleteTodo = (id: number) => {
    this.setState((prevState: AppState) => ({
      todos: prevState.todos.filter((todo) => todo.id !== id),
    }));
  };

  render() {
    return (
      <>
        <form id='new-todo-form' onSubmit={this.handleSubmit}>
          <input
            type='text'
            id='new-todo'
            placeholder='What needs to be done?'
            value={this.state.inputValue}
            onChange={this.handleInputChange}
          />
          <button type='submit'>Add</button>
        </form>

        <ul id='todo-list'>
          {this.state.todos.map((todo) => (
            <li key={todo.id}>
              <input
                type='checkbox'
                checked={todo.completed}
                onChange={() => this.toggleTodo(todo.id)}
              />
              <label
                style={{
                  textDecorationLine: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.text}
              </label>
              <button onClick={() => this.deleteTodo(todo.id)}>❌</button>
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default App;
