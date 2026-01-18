export const greet = (name) => {
  return `Hello, ${name}!`;
};

export const farewell = (name) => {
  return `Goodbye, ${name}!`;
};

export default class MyClass {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}!`;
  }
}
