// Object.defineProperty() を使うと、writable 属性/enumerable 属性/configurable 属性を設定してオブジェクトのプロパティを定義できる。
// このメソッドを使って明示的に各属性を設定したプロパティを定義し、
// プロパティの変更、削除、hasOwnProperty と propertyIsEnumerable の結果に対してどのように影響するか確認するコードを書きなさい。

const obj = {};
Object.defineProperty(obj, "num", {
  value: 42,
  writable: false, // 書き込み不可
  enumerable: true, // 列挙可能
  configurable: false, // 再定義不可
});

console.log(obj.num); // 42
// eslint-disable-next-line no-prototype-builtins
console.log(obj.hasOwnProperty("num")); // true
// eslint-disable-next-line no-prototype-builtins
console.log(obj.propertyIsEnumerable("num")); // true
console.log(Object.keys(obj)); // ['num']
// 書き込み不可なのでエラーになる
// obj.num = 100; // TypeError: Cannot assign to read only property 'num' of object '#<Object>'
// 再定義不可なのでエラーになる
// Object.defineProperty(obj, "num", {
// value: 100,
// writable: true,
// enumerable: true,
// configurable: true,
// }); // TypeError: Cannot redefine property: num

Object.defineProperty(obj, "str", {
  value: "Hello",
  writable: true, // 書き込み可能
  enumerable: false, // 列挙不可
  configurable: true, // 再定義可能
});

console.log(obj.str); // Hello
// eslint-disable-next-line no-prototype-builtins
console.log(obj.hasOwnProperty("str")); // true
// eslint-disable-next-line no-prototype-builtins
console.log(obj.propertyIsEnumerable("str")); // false
console.log(Object.keys(obj)); // ['num']
obj.str = "World"; // 書き込み可能なプロパティの値を変更
console.log(obj.str); // World
console.log(obj); // { num: 42, str: 'World' }
