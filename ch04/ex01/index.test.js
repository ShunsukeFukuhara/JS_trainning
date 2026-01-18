import { add, sub, mul, div } from "./index.js";

const expectCloseTo = (received, expected) => {
  if (isNaN(received.real) || isNaN(received.imag)) {
    expect(received.real).toBeNaN();
    expect(received.imag).toBeNaN();
    return;
  }
  expect(received.real).toBeCloseTo(expected.real, 10);
  expect(received.imag).toBeCloseTo(expected.imag, 10);
};

test("add", () => {
  expectCloseTo(add({ real: 3, imag: 2 }, { real: 1, imag: 4 }), {
    real: 4,
    imag: 6,
  });

  expectCloseTo(add({ real: 3, imag: 2 }, { real: -1, imag: -4 }), {
    real: 2,
    imag: -2,
  });

  expectCloseTo(add({ real: 3, imag: 2 }, { real: 0, imag: 0 }), {
    real: 3,
    imag: 2,
  });

  expectCloseTo(add({ real: 0, imag: 0 }, { real: 0, imag: 0 }), {
    real: 0,
    imag: 0,
  });

  expectCloseTo(add({ real: 0, imag: 0 }, { real: 1, imag: 1 }), {
    real: 1,
    imag: 1,
  });
});

test("sub", () => {
  expectCloseTo(sub({ real: 3, imag: 2 }, { real: 1, imag: 4 }), {
    real: 2,
    imag: -2,
  });

  expectCloseTo(sub({ real: 3, imag: 2 }, { real: -1, imag: -4 }), {
    real: 4,
    imag: 6,
  });

  expectCloseTo(sub({ real: 3, imag: 2 }, { real: 0, imag: 0 }), {
    real: 3,
    imag: 2,
  });

  expectCloseTo(sub({ real: 0, imag: 0 }, { real: 0, imag: 0 }), {
    real: 0,
    imag: 0,
  });

  expectCloseTo(sub({ real: 0, imag: 0 }, { real: 1, imag: 1 }), {
    real: -1,
    imag: -1,
  });
});

test("mul", () => {
  expectCloseTo(mul({ real: 3, imag: 2 }, { real: 1, imag: 4 }), {
    real: -5,
    imag: 14,
  });

  expectCloseTo(mul({ real: 3, imag: 2 }, { real: -1, imag: -4 }), {
    real: 5,
    imag: -14,
  });

  expectCloseTo(mul({ real: 3, imag: 2 }, { real: 0, imag: 0 }), {
    real: 0,
    imag: 0,
  });

  expectCloseTo(mul({ real: 0, imag: 0 }, { real: 0, imag: 0 }), {
    real: 0,
    imag: 0,
  });

  expectCloseTo(mul({ real: 0, imag: 0 }, { real: 1, imag: 1 }), {
    real: 0,
    imag: 0,
  });
});

test("div", () => {
  expectCloseTo(div({ real: 3, imag: 2 }, { real: 1, imag: 4 }), {
    real: 0.6470588235,
    imag: -0.5882352941,
  });

  expectCloseTo(div({ real: 3, imag: 2 }, { real: -1, imag: -4 }), {
    real: -0.6470588235,
    imag: 0.5882352941,
  });

  expectCloseTo(div({ real: 3, imag: 2 }, { real: 0, imag: 0 }), {
    real: NaN,
    imag: NaN,
  });

  expectCloseTo(div({ real: 0, imag: 0 }, { real: 0, imag: 0 }), {
    real: NaN,
    imag: NaN,
  });

  expectCloseTo(div({ real: 0, imag: 0 }, { real: 1, imag: 1 }), {
    real: 0,
    imag: 0,
  });
});
