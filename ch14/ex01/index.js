// 与えられたテストを通過するように、プロパティ、属性を設定したオブジェクトを返す関数を作成しなさい。

export const unwritableAndUnconfigurableObj = () => {
  const obj = { a: 1 };
  Object.defineProperty(obj, "a", {
    writable: false, // 書込不可
    configurable: false, // 削除不可
  });
  return obj;
};

export const writableAndUnconfigurableObj = () => {
  const obj = { b: 2 };
  Object.defineProperty(obj, "b", {
    writable: true, // 書込可
    configurable: false, // 削除不可
  });
  return obj;
};

export const nestedUnwritableObj = () => {
  const obj = { c: { d: { e: 3 } } };
  Object.freeze(obj); // 最上位のオブジェクトを凍結
  Object.freeze(obj.c); // ネストされたオブジェクトを凍結
  Object.freeze(obj.c.d); // ネストされたオブジェクトを凍結
  Object.freeze(obj.c.d.e); // 最下位のプリミティブ値を凍結
  return obj;
};
