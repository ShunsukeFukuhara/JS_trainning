// 実部と虚部をプロパティとして持つ 2 つの複素数オブジェクトを引数として四則演算の結果を返す関数 add、sub、mul、div を実装しなさい。

export const add = (a, b) => {
  return {
    real: a.real + b.real,
    imag: a.imag + b.imag,
  };
};

export const sub = (a, b) => {
  return {
    real: a.real - b.real,
    imag: a.imag - b.imag,
  };
};

export const mul = (a, b) => {
  return {
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real,
  };
};

export const div = (a, b) => {
  const conjugateWithB = { real: b.real, imag: -b.imag };
  const numerator = mul(a, conjugateWithB);
  const denominator = mul(b, conjugateWithB).real; // 共役を掛けると虚部が消えるはず
  return {
    real: numerator.real / denominator,
    imag: numerator.imag / denominator,
  };
};
