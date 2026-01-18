import { TypeMap } from "./index.js";

describe("TypeMap", () => {
  it("keyがコンストラクタ関数であることを確認する", () => {
    class Foo {}

    const typeMap = new TypeMap();
    expect(() => typeMap.set(Foo, new Foo())).not.toThrow();
    expect(() => typeMap.set("not a constructor", "value")).toThrow();
    expect(() => typeMap.set(null, "value")).toThrow();
    expect(() => typeMap.set(undefined, "value")).toThrow();
    expect(() => typeMap.set(function some() {}, "value")).toThrow();
    expect(() => typeMap.set(() => {}, "value")).toThrow();
  });

  it("setメソッドでコンストラクタ関数とそのインスタンスを設定できる。結果をgetで取得出来る", () => {
    class Foo {}
    const instance = new Foo();
    const dateInstance = new Date();

    const typeMap = new TypeMap();
    typeMap.set(Foo, instance);
    expect(typeMap.get(Foo)).toBe(instance);
    typeMap.set(String, "string");
    expect(typeMap.get(String)).toBe("string");
    typeMap.set(Number, 123);
    expect(typeMap.get(Number)).toBe(123);
    typeMap.set(Date, dateInstance);
    expect(typeMap.get(Date)).toBe(dateInstance);
  });

  it("setメソッドで不正な値を設定しようとするとエラーが発生する", () => {
    class Foo {}

    const typeMap = new TypeMap();
    expect(() => typeMap.set(Foo, "not an instance")).toThrow();
    expect(() => typeMap.set(String, 123)).toThrow();
    expect(() => typeMap.set(Number, "not a number")).toThrow();
    expect(() => typeMap.set(Date, "not a date")).toThrow();
  });
});
