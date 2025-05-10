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
  const denominator = b.real ** 2 + b.imag ** 2;
  const molecule = mul(a, { real: b.real, imag: -b.imag });
  return {
    real: molecule.real / denominator,
    imag: molecule.imag / denominator,
  };
};
