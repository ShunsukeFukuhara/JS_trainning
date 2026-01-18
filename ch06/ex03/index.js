// Object.prototype.isPrototypeOf() は、オブジェクトが別のオブジェクトのプロトタイプチェーンに存在するかどうかを判定できる。
// このメソッドを使って、P149 冒頭のコードにおいて、 o が p および q のプロトタイプチェーン上に存在すること、および、p が q のプロトタイプチェーン上に存在することを確認しなさい。

const o = {}; // o はObject.prototype からメソッドを継承し、
o.x = 1; // 独自プロパティx を持つ。
const p = Object.create(o); // p はo とObject.prototype からプロパティを継承し、
p.y = 2; // 独自プロパティy を持つ。
const q = Object.create(p); // q は、p、o、Object.prototype からプロパティを継承し、
q.z = 3; // 独自プロパティz を持つ。

console.log(Object.getPrototypeOf(o) === Object.prototype); // true
console.log(Object.getPrototypeOf(p) === o); // true
console.log(Object.getPrototypeOf(q) === p); // true

// また同様に、Object, Array, Date, Map のプロトタイプチェーンの継承関係を確認するためのコードも書きなさい。
const array = [];
const date = new Date();
const map = new Map();
console.log(Object.getPrototypeOf(array) === Array.prototype); // true
console.log(Object.getPrototypeOf(date) === Date.prototype); // true
console.log(Object.getPrototypeOf(map) === Map.prototype); // true
