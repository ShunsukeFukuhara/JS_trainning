// P.372 で例示されている、throw()を使ってリセットを行うカウンタのようなジェネレータを実装しなさい。

export function* createResettableCounter(cleanUpFunc) {
  let count = 0;
  try {
    while (true) {
      try {
        yield ++count;
      } catch {
        count = 0;
        // catch 内で一度 yieldすることで、throw() 呼び出し後に次の next() が正しく動作するようにする
        yield count;
      }
    }
  } finally {
    cleanUpFunc?.();
  }
}
