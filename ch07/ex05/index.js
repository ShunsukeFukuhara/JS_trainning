// 本章に登場した push/pop/shift/unshift/sort 等のメソッドは配列自体を変更する。
// このようなメソッドは「破壊的」であると呼ばれる
// push/pop/shift/unshift/sort の非破壊的版関数を書きなさい。各関数は返り値に変更後の新しい配列を返しなさい。
export const push = (arr, item) => {
  const newArr = [...arr];
  newArr[newArr.length] = item;
  return newArr;
};

export const pop = (arr) => {
  if (arr.length === 0) return [];
  const newArr = [...arr];
  newArr.length = newArr.length - 1;
  return newArr;
};

export const shift = (arr) => {
  if (arr.length === 0) return [];
  const newArr = [...arr];
  newArr.splice(0, 1);
  return newArr;
};

export const unshift = (arr, item) => {
  const newArr = [...arr];
  newArr.splice(0, 0, item);
  return newArr;
};

export const sort = (arr, compareFn) => {
  const newArr = [...arr];
  return newArr.sort(compareFn);
};
