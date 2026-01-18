// 2次元配列を行列として扱い、行列の加算・乗算を行う関数を作成しなさい。

export const add = (a, b) => {
  // 2次元配列であることを確認
  if (
    !Array.isArray(a) ||
    !Array.isArray(b) ||
    !Array.isArray(a[0]) ||
    !Array.isArray(b[0])
  ) {
    throw new Error("Both inputs must be 2D arrays");
  }

  // 行列の次元が異なる場合はNG
  if (a.length !== b.length || a[0].length !== b[0].length) {
    throw new Error("Matrices must have the same dimensions");
  }

  return a.map((row, i) => row.map((value, j) => value + b[i][j]));
};

export const multiply = (a, b) => {
  // 2次元配列であることを確認
  if (
    !Array.isArray(a) ||
    !Array.isArray(b) ||
    !Array.isArray(a[0]) ||
    !Array.isArray(b[0])
  ) {
    throw new Error("Both inputs must be 2D arrays");
  }

  // 行列の次元が適合するか確認
  // A の列数 = B の行数
  if (a[0].length !== b.length) {
    throw new Error(
      "Number of columns in the first matrix must match number of rows in the second matrix"
    );
  }

  return a.map((row) =>
    b[0].map((_, j) => row.reduce((sum, value, i) => sum + value * b[i][j], 0))
  );
};
