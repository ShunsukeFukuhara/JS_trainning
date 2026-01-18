// Symbol() を使い、同じ文字列から生成された 2 個の Symbol 変数を作成し、それらをプロパティとして持つオブジェクトを作成しなさい。
const symbolA = Symbol("same");
const symbolB = Symbol("same");

const object = {
  [symbolA]: "valueA",
  [symbolB]: "valueB",
};

// そのオブジェクトに対して、作成したSymbol変数を使って各プロパティの値を取得しなさい。
console.log(object[symbolA]); // "valueA"
console.log(object[symbolB]); // "valueB"

// Symbol()ではなく、Symbol.for()で同名の変数を作成した場合の挙動を確認しなさい。
const symbolC = Symbol.for("same");
const symbolD = Symbol.for("same");

const object2 = {
  [symbolC]: "valueC",
  [symbolD]: "valueD",
};

console.log(symbolA === symbolB); // false
console.log(symbolC === symbolD); // true

console.log(object[symbolA]); // "valueA"
console.log(object2[symbolC]); // "valueD"
