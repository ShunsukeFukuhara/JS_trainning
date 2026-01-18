// getPropertyNamesのテスト
import { getPropertyNames } from "./index.js";

describe("getPropertyNames", () => {
  it("should return own property names", () => {
    const obj = { a: 1, b: 2 };
    const result = getPropertyNames(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("should return own symbol property names", () => {
    const sym = Symbol("test");
    const obj = { [sym]: 42 };
    const result = getPropertyNames(obj);
    expect(result).toEqual([sym]);
  });

  it("should return inherited property names", () => {
    const proto = { inherited: "value" };
    const obj = Object.create(proto);
    const result = getPropertyNames(obj);
    expect(result).toEqual(["inherited"]);
  });
});
