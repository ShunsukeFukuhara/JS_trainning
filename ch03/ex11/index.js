// オブジェクトが可変であることと、オブジェクトが参照で比較されることを以下のコードを書いて確認しなさい:
const obj1 = { x: 1 };
// 問題: ここに1行コードを書くことで以下の行で {x: 1, y: 2} が出力されること
console.log(obj1);

const obj2 = { x: 1, y: 2 };
// 問題: 以下の行では何が出力されるか、予想してから結果を確認しなさい
// 予想: false
// 結果: false
console.log(obj1 === obj2);

// 次に引数で与えられた2つのオブジェクト o1 と o2 を比較する関数 equals を以下の仕様に従って作成しなさい:
// o1 と o2 のプロパティの各値を equals で比較し、全て true ならば true を返し、1つでも false があれば false を返す
export const equals = (obj1, obj2) => {
  // o1 と o2 が 厳密に等価 である場合 true を返す。
  if (obj1 === obj2) return true;
  // o1 または o2 に null またはオブジェクト以外が指定された場合 false を返す (tyepof の返り値が object かどうかを確認しなさい)
  if (obj1 === null || obj2 === null) return false;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;
  // o1 と o2 のプロパティの数・名前が一致しない場合は false を返す
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  if (!keys1.every((key) => keys2.includes(key))) return false;
  // o1 と o2 のプロパティの各値を equals で比較し、全て true ならば true を返し、1つでも false があれば false を返す
  return keys1.every((key) => equals(obj1[key], obj2[key]));
};
