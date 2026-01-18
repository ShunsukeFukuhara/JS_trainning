// valueOf(), toString() を持つクラスを定義しなさい。
// そのクラスのインスタンスを作成し、valueOf(), toString() を直接呼び出さずにそれぞれの結果を出力するコードを書きなさい。

class Example extends Object {
  constructor(value) {
    super();
    this.value = value;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return `${this.value}`;
  }
}

const example = new Example(999);
console.log(example.valueOf()); // 0
console.log(example.toString()); // Value: 0

const test = new Object(999);
console.log(test.valueOf()); // 999
console.log(test.toString()); // '999'
