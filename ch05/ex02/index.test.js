import { escapeStringWithIfElse, escapeStringWithSwitch } from "./index.js";

describe("escapeStringWithIfElse", () => {
  test("single charactor: \0", () => {
    expect(escapeStringWithIfElse("\0")).toBe("\\0");
  });

  test("single charactor: \b", () => {
    expect(escapeStringWithIfElse("\b")).toBe("\\b");
  });

  test("single charactor: \t", () => {
    expect(escapeStringWithIfElse("\t")).toBe("\\t");
  });

  test("single charactor: \n", () => {
    expect(escapeStringWithIfElse("\n")).toBe("\\n");
  });

  test("single charactor: \v", () => {
    expect(escapeStringWithIfElse("\v")).toBe("\\v");
  });

  test("single charactor: \f", () => {
    expect(escapeStringWithIfElse("\f")).toBe("\\f");
  });

  test("single charactor: \r", () => {
    expect(escapeStringWithIfElse("\r")).toBe("\\r");
  });

  test('single charactor: "', () => {
    expect(escapeStringWithIfElse('"')).toBe('\\"');
  });

  test("single charactor: '", () => {
    expect(escapeStringWithIfElse("'")).toBe("\\'");
  });

  test("multiple charactors: \0\b\t\n\v\f\r\"'", () => {
    expect(escapeStringWithIfElse("\0\b\t\n\v\f\r\"'")).toBe(
      "\\0\\b\\t\\n\\v\\f\\r\\" + "\"\\'"
    );
  });
});

describe("escapeStringWithSwitch", () => {
  test("single charactor: \0", () => {
    expect(escapeStringWithSwitch("\0")).toBe("\\0");
  });

  test("single charactor: \b", () => {
    expect(escapeStringWithSwitch("\b")).toBe("\\b");
  });

  test("single charactor: \t", () => {
    expect(escapeStringWithSwitch("\t")).toBe("\\t");
  });

  test("single charactor: \n", () => {
    expect(escapeStringWithSwitch("\n")).toBe("\\n");
  });

  test("single charactor: \v", () => {
    expect(escapeStringWithSwitch("\v")).toBe("\\v");
  });

  test("single charactor: \f", () => {
    expect(escapeStringWithSwitch("\f")).toBe("\\f");
  });

  test("single charactor: \r", () => {
    expect(escapeStringWithSwitch("\r")).toBe("\\r");
  });

  test('single charactor: "', () => {
    expect(escapeStringWithSwitch('"')).toBe('\\"');
  });

  test("single charactor: '", () => {
    expect(escapeStringWithSwitch("'")).toBe("\\'");
  });

  test("multiple charactors: \0\b\t\n\v\f\r\"'", () => {
    expect(escapeStringWithSwitch("\0\b\t\n\v\f\r\"'")).toBe(
      "\\0\\b\\t\\n\\v\\f\\r\\" + "\"\\'"
    );
  });
});
