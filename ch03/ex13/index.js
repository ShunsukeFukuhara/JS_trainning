// ==, <=, の演算子と同等の挙動を取る関数 eq および lte を作成しなさい。
// ex13/index.test.js のテストを全てパスするように index.js (または index.ts)を作成しなさい。
// 3 章で説明されている各型 (ただし BigInt 及び Symbol は考慮しなくて良い) や自作クラスに対しても同等の挙動を取るようにしなさい。
// 作成する関数の内部実装については以下の条件に従いなさい。

// 同値演算子 === を利用して良い
// 基本型値同士の比較に関しては < 演算子を利用して良い
// 文字列を数値に変換するのに Number() を利用して良い
// 最新の ECMA の抽象関係比較アルゴリズムの仕様では、オブジェクト型値から基本型値への変換に Symbol.ToPrimitive を利用することになっているが、
// 解答では書籍に記載された型変換アルゴリズムを利用すること

export function eq(a, b) {
  // そのまま比較
  if (a === b) {
    return true;
  }

  // number と string の比較
  if (typeof a === "string" && typeof b === "number") {
    return Number(a) === b;
  }
  if (typeof a === "number" && typeof b === "string") {
    return a === Number(b);
  }

  // boolean と number の比較
  if (typeof a === "boolean" && typeof b === "number") {
    return a === Boolean(b);
  }
  if (typeof a === "number" && typeof b === "boolean") {
    return Boolean(a) === b;
  }
  // boolean と string の比較
  if (typeof a === "string" && typeof b === "boolean") {
    return Boolean(a) === b;
  }
  if (typeof a === "boolean" && typeof b === "string") {
    return a === Boolean(b);
  }

  // null と undefined の比較
  if (a === null && b === undefined) {
    return true;
  }
  if (a === undefined && b === null) {
    return true;
  }

  // 0とnullの比較
  if (a === 0 && b === null) {
    return false;
  }
  if (a === null && b === 0) {
    return false;
  }

  // Dateオブジェクトの比較
  if (a instanceof Date && typeof b === "number") {
    return false;
  }
  if (b instanceof Date && typeof a === "number") {
    return false;
  }

  // object と string の比較
  if (typeof a === "object" && typeof b === "string") {
    return String(a) === b;
  }
  if (typeof a === "string" && typeof b === "object") {
    return a === String(b);
  }
  // object と number の比較
  if (typeof a === "object" && typeof b === "number") {
    return Number(a) === b;
  }
  if (typeof a === "number" && typeof b === "object") {
    return a === Number(b);
  }
  // object と boolean の比較
  if (typeof a === "object" && typeof b === "boolean") {
    return Boolean(a) === b;
  }
  if (typeof a === "boolean" && typeof b === "object") {
    return a === Boolean(b);
  }
  // object と null の比較
  if (typeof a === "object" && b === null) {
    return a === b;
  }
  if (typeof b === "object" && a === null) {
    return b === a;
  }
  // object と undefined の比較
  if (typeof a === "object" && b === undefined) {
    return a === b;
  }
  if (typeof b === "object" && a === undefined) {
    return b === a;
  }
  // 関数と number の比較
  if (typeof a === "function" && typeof b === "number") {
    return Number(a) === b;
  }
  if (typeof b === "function" && typeof a === "number") {
    return a === Number(b);
  }

  return false;
}

export function lte(a, b) {
  // 同値なら無条件で true
  if (eq(a, b)) {
    return true;
  }

  // number同士
  if (typeof a === "number" && typeof b === "number") {
    return a < b;
  }

  // string同士
  if (typeof a === "string" && typeof b === "string") {
    return a < b;
  }

  // boolean同士
  if (typeof a === "boolean" && typeof b === "boolean") {
    return b;
  }

  // date同士
  if (a instanceof Date && b instanceof Date) {
    return a < b;
  }

  // nullとnumber
  if (a === null && typeof b === "number") {
    return true;
  }
  if (typeof a === "number" && b === null) {
    return false;
  }

  // objectとnumber
  if (typeof a === "object" && typeof b === "number") {
    return Number(a) < b;
  }
  if (typeof b === "object" && typeof a === "number") {
    return a < Number(b);
  }

  // 関数とnumber
  if (typeof a === "function" && typeof b === "number") {
    return Number(a) < b;
  }
  if (typeof b === "function" && typeof a === "number") {
    return a < Number(b);
  }

  return false;
}
