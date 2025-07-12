// べき乗 (xnx^nxn) を計算する関数を、べき乗演算子 (**) を使わずに 時間計算量 が O(ln⁡n)O(\ln n)O(lnn) となるように再帰およびループでぞれぞれ実装しなさい。nnn は正の整数とする。

export const recursivePower = (base, exponent) => {
  if (typeof base !== "number" || typeof exponent !== "number") {
    throw new Error("base と exponent は数値");
  }
  if (!(Number.isInteger(exponent) && exponent >= 0)) {
    throw new Error("exponent は非負整数");
  }

  if (exponent === 0) return 1;
  if (exponent === 1) return base;

  if (exponent % 2 === 0) {
    const half = recursivePower(base, exponent / 2);
    return half * half;
  } else {
    return base * recursivePower(base, exponent - 1);
  }
};
