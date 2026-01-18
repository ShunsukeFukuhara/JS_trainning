// reduce を使って関数 (sum, join, reverse, every, some) を実装しなさい。

const guardArray = (array) => {
  if (!Array.isArray(array)) {
    throw new Error("Input must be an array");
  }
};
export const sum = (array) => {
  // 配列が undefined または null の場合は 0 を返す
  if (array === undefined || array === null) {
    return 0;
  }

  guardArray(array);
  return array.reduce((acc, value) => acc + value, 0);
};

export const join = (array, separator = ",") => {
  guardArray(array);
  return array.reduce(
    (acc, value, index) => acc + (index > 0 ? separator : "") + (value || ""),
    ""
  );
};

export const reverse = (array) => {
  guardArray(array);
  return array.reduce((acc, value) => [value, ...acc], []);
};

export const every = (array, predicate) => {
  guardArray(array);
  return array.reduce(
    (acc, value, index, arr) => acc && predicate(value, index, arr),
    true
  );
};

export const some = (array, predicate) => {
  guardArray(array);
  return array.reduce(
    (acc, value, index, arr) => acc || predicate(value, index, arr),
    false
  );
};
