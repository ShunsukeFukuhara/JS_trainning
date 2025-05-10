// 与えられた数値を 32 ビット整数表現形式で表現した場合に 1 であるビットの数を返す関数 bitCount を書きなさい。
// 例として bitCount(0b111) は 3 を返し、bitCount(0b1111111111111111111111111111111) は 31 を返しなさい

export const bitCount = (n) => {
  let count = 0;
  while (n) {
    count += n & 1; // 最下位ビットが 1 の場合はカウント
    console.log(n, count);
    n >>= 1; // n を右シフト
  }
  return count;
};
