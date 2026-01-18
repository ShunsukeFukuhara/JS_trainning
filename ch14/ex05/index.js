// テンプレートリテラルを受けとり文字列を返す関数を作成しなさい。ただし戻り値において補間値はその値ではなく、その型名を展開しなさい。（厳密な型でなくて可）

export const template = (strings, ...values) => {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    const type = typeof value;
    return i === 0 ? str : result + type + str;
  }, "");
};

// NOTE: 以下の例では template という関数を作成したものとしている:
console.log(template``); // ""
console.log(template`test`); // "test"
console.log(template`Hello, ${"A"}`); // "Hello, string"
console.log(template`${1} ${null} ${() => {}}`); // "number object function"
console.log(template`type of 'A' is ${"A"}`); // "type of 'A' is string"
