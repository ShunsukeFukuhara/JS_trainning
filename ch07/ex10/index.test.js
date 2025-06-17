import { DynamicSizeArray } from "./index.js";

describe("DynamicSizeArray", () => {
  test("initial length is 0", () => {
    const array = new DynamicSizeArray();
    expect(array.length()).toBe(0);
  });

  describe("get/set", () => {
    test("get returns undefined for empty array", () => {
      const array = new DynamicSizeArray();
      expect(() => array.get(0)).toThrow();
    });

    test("set throws error for empty array", () => {
      const array = new DynamicSizeArray();
      expect(() => array.set(0, 1)).toThrow();
    });

    test("get/set works for single element", () => {
      const array = new DynamicSizeArray();
      array.push(1);
      expect(array.get(0)).toBe(1);
      array.set(0, 2);
      expect(array.get(0)).toBe(2);
    });

    test("get/set throws error for out of range index", () => {
      const array = new DynamicSizeArray();
      array.push(1);
      expect(() => array.get(1)).toThrow();
      expect(() => array.set(1, 2)).toThrow();
    });
  });

  describe("length", () => {
    test("length returns correct size", () => {
      const array = new DynamicSizeArray();
      for (let i = 0; i < 5; i++) {
        array.push(i);
        expect(array.length()).toBe(i + 1);
      }
    });
  });

  describe("push", () => {
    test("push works with multiple elements", () => {
      const array = new DynamicSizeArray();
      for (let i = 0; i < 10; i++) {
        array.push(i);

        expect(array.length()).toBe(i + 1);
      }

      expect(array.length()).toBe(10);
      for (let i = 0; i < 10; i++) {
        expect(array.get(i)).toBe(i);
      }
    });

    test("push resizes array when full", () => {
      const array = new DynamicSizeArray();
      for (let i = 0; i < 4; i++) {
        array.push(i);
      }
      expect(array.length()).toBe(4);
      expect(array.get(3)).toBe(3);

      array.push(4);
      expect(array.length()).toBe(5);
      expect(array.get(4)).toBe(4);
    });
  });
});
