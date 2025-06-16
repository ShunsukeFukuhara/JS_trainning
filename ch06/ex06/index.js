// 任意のオブジェクトを受け取り、そのオブジェクトのすべての独自プロパティ（列挙不可、プロパティ名が Symbol のものを含む）
// および列挙可能な継承プロパティのプロパティ名の配列を返す関数を作成しなさい。
// 継承プロパティのプロパティ名については Symbol のものは必須とはしない。

export const getPropertyNames = (obj) => {
  const ownPropertyNames = Object.getOwnPropertyNames(obj);
  const ownSymbolPropertyNames = Object.getOwnPropertySymbols(obj);
  const inheritedPropertyNames = Object.keys(Object.getPrototypeOf(obj));

  return [
    ...ownPropertyNames,
    ...ownSymbolPropertyNames,
    ...inheritedPropertyNames,
  ];
};
