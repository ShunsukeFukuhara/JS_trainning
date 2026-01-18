import { convertLfToCrLf, convertCrLfToLf } from "./index.js";

describe("convertLfToCrLf", () => {
  test("LF -> CR+LF", () => {
    const input = "Hello\nWorld\n";
    const expectedOutput = "Hello\r\nWorld\r\n";
    expect(convertLfToCrLf(input)).toBe(expectedOutput);
  });

  test("CR+LF -> LF", () => {
    const input = "Hello\r\nWorld\r\n";
    const expectedOutput = "Hello\nWorld\n";
    expect(convertCrLfToLf(input)).toBe(expectedOutput);
  });
});
