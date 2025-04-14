console.log("最大値:", Number.MAX_SAFE_INTEGER);
console.log("最小値:", Number.MIN_SAFE_INTEGER);

console.log("最大値 + 1:", Number.MAX_SAFE_INTEGER + 1);

const maxPlusOne = Number.MAX_SAFE_INTEGER + 1;
const maxPlusTwo = Number.MAX_SAFE_INTEGER + 2;
console.log("最大値+1 === 最大値+2:", maxPlusOne === maxPlusTwo);

// 最大値: 9007199254740991
// 最小値: -9007199254740991
// 最大値 + 1: 9007199254740992
// 最大値+1 === 最大値+2: true

// 最大値+1 === 最大値+2がtrueになる理由は、JavaScriptの数値が64ビットの浮動小数点数で表現されており、
// 整数部分は53ビットであるため9007199254740991（2^53 - 1）を超えると整数の精度が失われるからです。
// 今回では、9007199254740993は仮数部の端の1ビットが丸められ、9007199254740992と同じ値として扱われます。

console.log("100000000000000000000000000000000000000000000000000001".length);
