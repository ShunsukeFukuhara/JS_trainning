import { parseJson } from "./index.js";

describe("parseJson", () => {
  test("valid JSON string", () => {
    const jsonString = '{"name": "John", "age": 30}';
    const result = parseJson(jsonString);
    expect(result).toEqual({
      success: true,
      data: { name: "John", age: 30 },
    });
  });

  test("invalid JSON string", () => {
    const invalidJsonString = '{"name": "John", "age": 30';
    const result = parseJson(invalidJsonString);
    // result.error が存在すれば内容に関わらず成功とする
    expect(result.error).toBeDefined();
  });
});
