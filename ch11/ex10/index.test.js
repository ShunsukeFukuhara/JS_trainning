import {
  daysInMonth,
  weekdaysInRange,
  getWeekday,
  getFirstDayOfLastMonth,
} from "./index.js";

describe("daysInMonth", () => {
  it("正しい月の日数を返す", () => {
    expect(daysInMonth(2025, 1)).toBe(31); // 1月
    expect(daysInMonth(2025, 2)).toBe(28); // 2月 (平年)
    expect(daysInMonth(2024, 2)).toBe(29); // 2月 (閏年)
    expect(daysInMonth(2025, 3)).toBe(31); // 3月
    expect(daysInMonth(2025, 4)).toBe(30); // 4月
    expect(daysInMonth(2025, 5)).toBe(31); // 5月
    expect(daysInMonth(2025, 6)).toBe(30); // 6月
    expect(daysInMonth(2025, 7)).toBe(31); // 7月
    expect(daysInMonth(2025, 8)).toBe(31); // 8月
    expect(daysInMonth(2025, 9)).toBe(30); // 9月
    expect(daysInMonth(2025, 10)).toBe(31); // 10月
    expect(daysInMonth(2025, 11)).toBe(30); // 11月
    expect(daysInMonth(2025, 12)).toBe(31); // 12月
  });
  it("無効な月を指定するとエラーを投げる", () => {
    expect(() => daysInMonth(2023, 0)).toThrow();
    expect(() => daysInMonth(2023, 13)).toThrow();
  });

  it("無効な年を指定するとエラーを投げる", () => {
    expect(() => daysInMonth(-1, 1)).toThrow();
    expect(() => daysInMonth(2023, -1)).toThrow();
  });
});

describe("weekdaysInRange", () => {
  it("指定した期間の土日以外の日数を返す", () => {
    expect(weekdaysInRange("2025-01-01", "2025-01-07")).toBe(3); // 1月1日から7日まで
    expect(weekdaysInRange("2025-02-01", "2025-02-28")).toBe(20); // 2月全体
  });

  it("無効な日付形式を指定するとエラーを投げる", () => {
    expect(() => weekdaysInRange("2025/01/01", "2025/01/07")).toThrow();
    expect(() => weekdaysInRange("2025-01-01", "2025/01/07")).toThrow();
  });

  it("開始日が終了日より後の場合、エラーを投げる", () => {
    expect(() => weekdaysInRange("2025-01-07", "2025-01-01")).toThrow();
  });
});

describe("getWeekday", () => {
  it("指定した日付の曜日をロケールに基づいて返す", () => {
    expect(getWeekday("2025-01-01", "ja-JP")).toBe("水曜日"); // 日本語
    expect(getWeekday("2025-01-01", "en-US")).toBe("Wednesday"); // 英語
    expect(getWeekday("2025-01-02", "fr-FR")).toBe("jeudi"); // フランス語
  });

  it("無効な日付形式を指定するとエラーを投げる", () => {
    expect(() => getWeekday("2025/01/01", "ja-JP")).toThrow();
    expect(() => getWeekday("2025-01-01", "")).toThrow();
  });

  it("無効なロケールを指定するとエラーを投げる", () => {
    expect(() => getWeekday("2025-01-01", null)).toThrow();
    expect(() => getWeekday("2025-01-01", 123)).toThrow();
  });
});

describe("getFirstDayOfLastMonth", () => {
  it("前月の初日を返す", () => {
    expect(getFirstDayOfLastMonth("2025-01-15")).toBe("2024-12-01");
    expect(getFirstDayOfLastMonth("2025-02-28")).toBe("2025-01-01");
    expect(getFirstDayOfLastMonth("2025-03-01")).toBe("2025-02-01");
  });

  it("無効な日付形式を指定するとエラーを投げる", () => {
    expect(() => getFirstDayOfLastMonth("2025/01/15")).toThrow();
    expect(() => getFirstDayOfLastMonth("2025-01-32")).toThrow();
  });
});
