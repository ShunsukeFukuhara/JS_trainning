// 初項と第 2 項を 1 とするフィボナッチ数列 (1, 1, 2, 3, ...) の最初の 10 個を配列として返す関数を、while 文によるループを使って書きなさい。
// 同様に、do/while 文を使って書きなさい。
// 同様に、for 文を使って書きなさい。

export const fibonacciWithWhile = () => {
  const result = [1, 1];
  while (result.length < 10) {
    const next = result[result.length - 1] + result[result.length - 2];
    result.push(next);
  }
  return result;
};

export const fibonacciWithDoWhile = () => {
  const result = [1, 1];
  do {
    const next = result[result.length - 1] + result[result.length - 2];
    result.push(next);
  } while (result.length < 10);
  return result;
};

export const fibonacciWithFor = () => {
  const result = [1, 1];
  for (let i = 2; i < 10; i++) {
    const next = result[i - 1] + result[i - 2];
    result.push(next);
  }
  return result;
};
