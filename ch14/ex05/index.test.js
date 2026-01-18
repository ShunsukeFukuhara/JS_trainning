import { template } from "./index.js";

describe("template", () => {
  test("テンプレートリテラルが期待される場合", () => {
    expect(template``).toBe("");
    expect(template`test`).toBe("test");
    expect(template`Hello, ${"A"}`).toBe("Hello, string");
    expect(template`${1} ${null} ${() => {}}`).toBe("number object function");
    expect(template`type of 'A' is ${"A"}`).toBe("type of 'A' is string");
  });

  test("補間値が undefined やオブジェクトの場合", () => {
    expect(template`Value is ${undefined}`).toBe("Value is undefined");
    expect(template`Value is ${true}`).toBe("Value is boolean");
    expect(template`Value is ${{}}`).toBe("Value is object");
    expect(template`Value is ${[]}`).toBe("Value is object");
    expect(template`Value is ${Symbol("sym")}`).toBe("Value is symbol");
  });

  test("複数の補間値がある場合", () => {
    expect(template`${42} and ${"text"} and ${null}`).toBe(
      "number and string and object"
    );
    expect(template`Mix: ${true}, ${123}, ${"abc"}, ${() => {}}`).toBe(
      "Mix: boolean, number, string, function"
    );
  });

  test("ネストしたテンプレートリテラルの場合", () => {
    const nested = (val) => template`Nested: ${val}`;
    expect(template`Outer: ${nested(100)}`).toBe("Outer: string");
    expect(template`Outer: ${nested("inner")}`).toBe("Outer: string");
  });

  test("特殊文字や改行を含む場合", () => {
    expect(template`Line1\nLine2 ${"A"}`).toBe("Line1\nLine2 string");
    expect(template`Special chars: ${"@#$%^&*()"}`).toBe(
      "Special chars: string"
    );
  });

  test("数値やオブジェクトを補間値にした場合", () => {
    expect(template`Number: ${12345}`).toBe("Number: number");
    expect(template`Object: ${{ key: "value" }}`).toBe("Object: object");
    expect(template`Array: ${[1, 2, 3]}`).toBe("Array: object");
    expect(template`Function: ${function () {}}`).toBe("Function: function");
    expect(template`Boolean: ${false}`).toBe("Boolean: boolean");
    expect(template`Null: ${null}`).toBe("Null: object");
    expect(template`Undefined: ${undefined}`).toBe("Undefined: undefined");
    expect(template`Symbol: ${Symbol("id")}`).toBe("Symbol: symbol");
  });

  test("テンプレートリテラルの先頭や末尾に補間値がある場合", () => {
    expect(template`${"Start"} middle ${"End"}`).toBe("string middle string");
    expect(template`${42}`).toBe("number");
    expect(template`${null}`).toBe("object");
  });

  test("空の補間値がある場合", () => {
    expect(template`Empty: ${""}`).toBe("Empty: string");
    expect(template`Empty: ${null}`).toBe("Empty: object");
    expect(template`Empty: ${undefined}`).toBe("Empty: undefined");
  });
  test("複数行のテンプレートリテラルの場合", () => {
    expect(template`Line1
Line2 ${"A"}
Line3`).toBe("Line1\nLine2 string\nLine3");
  });
  test("補間値がオブジェクトのプロパティの場合", () => {
    const obj = { name: "Alice", age: 30 };
    expect(template`Name: ${obj.name}, Age: ${obj.age}`).toBe(
      "Name: string, Age: number"
    );
  });
  test("補間値が配列の要素の場合", () => {
    const arr = [10, "text", null];
    expect(template`Values: ${arr[0]}, ${arr[1]}, ${arr[2]}`).toBe(
      "Values: number, string, object"
    );
  });
  test("補間値が関数の戻り値の場合", () => {
    const getValue = () => 99;
    expect(template`Value: ${getValue()}`).toBe("Value: number");
  });
});
