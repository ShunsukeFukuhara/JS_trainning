// 以下のアロー関数を簡潔に記載しなさい。なお、引数や戻り値の括弧の要否などをコードコメントで説明しなさい。

// 自然数nと英数文字cを引数にとり、文字cをn回コンソール出力してから文字cをn個含む配列を返す
// 数値xを引数にとり、xの二乗の数値を返す
// 引数なしで、現在時刻のプロパティnowを含むオブジェクトを返す

export const repeatChar = (n, c) => {
  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error("引数nは自然数");
  }

  if (typeof c !== "string" || c.length !== 1 || !/^[a-zA-Z0-9]$/.test(c)) {
    throw new Error("引数cは英数文字");
  }

  Array.from({ length: n }, () => {
    console.log(c);
  });

  return Array(n).fill(c);
};

export const square = (x) => {
  if (typeof x !== "number") {
    throw new Error("引数xは数値");
  }

  return x * x;
};

export const currentTime = () => ({
  now: new Date(),
});
