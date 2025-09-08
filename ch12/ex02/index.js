// ジェネレータ関数を使わずに、P.367 のfibonacciSequence()が返すジェネレータと同等のイテレータを返す関数を実装しなさい。

export const fibonacciSequenceIter = () => {
  let x = 0,
    y = 1;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const currentValue = y;
      [x, y] = [y, x + y];
      return { value: currentValue, done: false };
    },
  };
};
