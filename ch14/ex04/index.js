// ひらがな 1 文字とその UTF-16 コード単位をプロパティとしてもつ独自クラスを、
// 50 音順(UTF-16 コード単位順)で<や>で比較、ソートできるよう Symbol.toPrimitive を用いて実装し、テストコードを書きなさい。
// 文字列が期待される場合にはひらがなを、数字が期待される場合には UTF-16 コード単位を、
// どちらでもない場合にはひらがなを返すようにし、テストコードで確認しなさい。

export class Hiragana {
  #char;
  #code;

  constructor(char) {
    if (
      typeof char !== "string" ||
      char.length !== 1 ||
      !char.match(/^[\u3040-\u309F]$/)
    ) {
      throw new TypeError("Invalid Hiragana character");
    }

    this.#char = char;
    this.#code = char.charCodeAt(0);
  }

  get char() {
    return this.#char;
  }

  get code() {
    return this.#code;
  }

  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case "string":
        return this.#char;
      case "number":
        return this.#code;
      default:
        return this.#char;
    }
  }
}
