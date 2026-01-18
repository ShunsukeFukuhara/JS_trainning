import { sortJapanese, toJapaneseDateString } from "./index.js";

describe("sortJapanese", () => {
  it("ひらがなの濁点・半濁点を無視してソート", () => {
    const arr = ["ばなな", "ぱん", "はな"];
    const result = sortJapanese(arr);
    expect(result).toEqual(["はな", "ばなな", "ぱん"]);
  });

  it("ひらがなの小書き文字を無視してソート", () => {
    const arr = ["っぽ", "つき"];
    const result = sortJapanese(arr);
    expect(result).toEqual(["つき", "っぽ"]);
  });

  it("カタカナの濁点・半濁点を無視してソート", () => {
    const arr = ["バナナ", "パン", "ハナ"];
    const result = sortJapanese(arr);
    expect(result).toEqual(["ハナ", "バナナ", "パン"]);
  });

  it("カタカナの小書き文字を無視してソート", () => {
    const arr = ["ッポ", "ツキ"];
    const result = sortJapanese(arr);
    expect(result).toEqual(["ツキ", "ッポ"]);
  });

  it("ひらがなとカタカナの混在を正しくソート", () => {
    const arr = ["ばなな", "バナナ", "はな", "ハナ"];
    const result = sortJapanese(arr);
    expect(result).toEqual(["はな", "ハナ", "ばなな", "バナナ"]);
  });

  it("空配列を渡した場合", () => {
    expect(sortJapanese([])).toEqual([]);
  });

  it("配列以外を渡した場合はエラー", () => {
    expect(() => sortJapanese("はな")).toThrow("配列を渡してください");
  });
});

describe("toJapaneseDateString", () => {
  it("有効なDateオブジェクトを和暦フォーマットで返す", () => {
    const date = new Date("2024-04-02");
    const result = toJapaneseDateString(date);
    expect(result).toBe("令和6年4月2日");
  });

  it("他の有効な日付も和暦フォーマットで返す", () => {
    const date = new Date("2023-01-01");
    const result = toJapaneseDateString(date);
    expect(result).toBe("令和5年1月1日");
  });

  it("無効なDateオブジェクトを渡した場合はエラー", () => {
    expect(() => toJapaneseDateString(new Date("invalid"))).toThrow(
      "有効なDateオブジェクトを渡してください"
    );
  });

  it("Dateオブジェクト以外を渡した場合はエラー", () => {
    expect(() => toJapaneseDateString("2024-04-02")).toThrow(
      "有効なDateオブジェクトを渡してください"
    );
  });
});
