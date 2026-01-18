// index.jsを完成させ、以下の要件を満たすクラスを作成しなさい。
// index.test.jsのテストが通ることを確認すること。

// MyArrayLikeは配列のようなクラスでArrayを継承しない
export class MyArrayLike {
  // この問題では引数は配列またはlengthのnumberが入る
  constructor(arg) {
    if (typeof arg === "number") {
      this.length = arg;
    } else if (Array.isArray(arg)) {
      this.length = arg.length;
      for (let i = 0; i < arg.length; i++) {
        this[i] = arg[i];
      }
    } else {
      this.length = 0;
    }
  }

  // 反復可能にするためにSymbol.iteratorを実装
  [Symbol.iterator]() {
    let index = 0;
    const length = this.length;
    return {
      next: () => {
        return index < length
          ? { value: this[index++], done: false }
          : { value: undefined, done: true };
      },
    };
  }
}

// MyArrayはArrayを継承し、map(), slice()の結果としてMyArrayLikeのオブジェクトを返す。（結果の型を変更するにはSymbol.speciesを指定する）
export class MyArray extends Array {
  constructor(items) {
    super(...items);
  }

  static get [Symbol.species]() {
    return MyArrayLike;
  }
}
