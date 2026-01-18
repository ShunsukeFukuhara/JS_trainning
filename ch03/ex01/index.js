const values = [Infinity, -Infinity, NaN];
const operations = ["+", "-", "*", "/"];

values.forEach((val1) => {
  values.forEach((val2) => {
    operations.forEach((op) => {
      let result;
      switch (op) {
        case "+":
          result = val1 + val2;
          break;
        case "-":
          result = val1 - val2;
          break;
        case "*":
          result = val1 * val2;
          break;
        case "/":
          result = val1 / val2;
          break;
      }
      console.log(`${val1} ${op} ${val2} = ${result}`);
    });
  });
});

// Infinity + Infinity = Infinity
// Infinity - Infinity = NaN
// Infinity * Infinity = Infinity
// Infinity / Infinity = NaN
// Infinity + -Infinity = NaN
// Infinity - -Infinity = Infinity
// Infinity * -Infinity = -Infinity
// Infinity / -Infinity = NaN
// Infinity + NaN = NaN
// Infinity - NaN = NaN
// Infinity * NaN = NaN
// Infinity / NaN = NaN
// -Infinity + Infinity = NaN
// -Infinity - Infinity = -Infinity
// -Infinity * Infinity = -Infinity
// -Infinity / Infinity = NaN
// -Infinity + -Infinity = -Infinity
// -Infinity - -Infinity = NaN
// -Infinity * -Infinity = Infinity
// -Infinity / -Infinity = NaN
// -Infinity + NaN = NaN
// -Infinity - NaN = NaN
// -Infinity * NaN = NaN
// -Infinity / NaN = NaN
// NaN + Infinity = NaN
// NaN - Infinity = NaN
// NaN * Infinity = NaN
// NaN / Infinity = NaN
// NaN + -Infinity = NaN
// NaN - -Infinity = NaN
// NaN * -Infinity = NaN
// NaN / -Infinity = NaN
// NaN + NaN = NaN
// NaN - NaN = NaN
// NaN * NaN = NaN
// NaN / NaN = NaN
