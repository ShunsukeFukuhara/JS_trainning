import { primes } from "./index.js";

describe("primes", () => {
  test("最初の10個の素数を返す", () => {
    const it = primes();
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(it.next().value);
    }
    expect(results).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
  });
});
