// 絶対値が誤差未満であることと同義
export const equal = (a, b) => Math.abs(a - b) < 1e-10;
