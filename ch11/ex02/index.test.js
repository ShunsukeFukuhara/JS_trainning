import { cache, slowFn } from "./index.js";

describe("cache", () => {
  it("同じ引数でslowFnを呼び出すと、2回目以降はキャッシュが返る", () => {
    const cachedSlowFn = cache(slowFn);
    const obj = { a: 1, b: 2 };

    // 初回は計算が行われる
    const result1 = cachedSlowFn(obj);
    expect(result1).toBe(JSON.stringify(obj));

    // 一回の計算に1000ミリ秒かかるが、キャッシュを用いた呼び出しでは時間がかからないことを確認するため実行時間も計測する
    const startTime = Date.now();
    // 同じ計算を10回繰り返す
    for (let i = 0; i < 10; i++) {
      cachedSlowFn(obj);
    }

    const elapsedTime = Date.now() - startTime;
    // 2回目以降はキャッシュが返るため、計算時間は高々1000ミリ秒以内であることを確認
    expect(elapsedTime).toBeLessThan(1000);
  });

  it("異なる引数でslowFnを呼び出すと、別の結果が返る", () => {
    const cachedSlowFn = cache(slowFn);
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };

    const result1 = cachedSlowFn(obj1);
    const result2 = cachedSlowFn(obj2);

    expect(result1).not.toBe(result2);
  });

  // *ガベージコレクションのテストは実行環境に依存するため、直接的なテストは実装出来なかった。
});
