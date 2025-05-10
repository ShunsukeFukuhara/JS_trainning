// typeof 演算子のオペランドに、undefined, null, オブジェクト, NaN, 数値, 関数 を指定したときの返り値を予想しなさい。
// その後実装しコンソール出力で確認しなさい。

// 予想
// undefined: "undefined"
// null: null
// オブジェクト: "object"
// NaN: "number"
// 数値: "number"
// 関数: "function"

console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object"
console.log(typeof {}); // "object"
console.log(typeof NaN); // "number"
console.log(typeof 123); // "number"
console.log(typeof function () {}); // "function"

// メモ: typeof null は "object" になるのは、JavaScript の初期の実装に由来するバグらしい
// https://2ality.com/2013/10/typeof-null.html
