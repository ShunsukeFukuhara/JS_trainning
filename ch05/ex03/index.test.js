import { is31daysWithIfElse, is31daysWithSwitch } from "./index.js";

describe("is31daysWithIfElse", () => {
  test("Invalid month", () => {
    expect(() => is31daysWithIfElse("InvalidMonth")).toThrow("Invalid month");
  });

  test("Jan", () => {
    expect(is31daysWithIfElse("Jan")).toBe(true);
  });

  test("Feb", () => {
    expect(is31daysWithIfElse("Feb")).toBe(false);
  });

  test("Mar", () => {
    expect(is31daysWithIfElse("Mar")).toBe(true);
  });

  test("Apr", () => {
    expect(is31daysWithIfElse("Apr")).toBe(false);
  });

  test("May", () => {
    expect(is31daysWithIfElse("May")).toBe(true);
  });

  test("Jun", () => {
    expect(is31daysWithIfElse("Jun")).toBe(false);
  });

  test("Jul", () => {
    expect(is31daysWithIfElse("Jul")).toBe(true);
  });

  test("Aug", () => {
    expect(is31daysWithIfElse("Aug")).toBe(true);
  });

  test("Sep", () => {
    expect(is31daysWithIfElse("Sep")).toBe(false);
  });

  test("Oct", () => {
    expect(is31daysWithIfElse("Oct")).toBe(true);
  });

  test("Nov", () => {
    expect(is31daysWithIfElse("Nov")).toBe(false);
  });

  test("Dec", () => {
    expect(is31daysWithIfElse("Dec")).toBe(true);
  });
});

describe("is31daysWithSwitch", () => {
  test("Invalid month", () => {
    expect(() => is31daysWithSwitch("InvalidMonth")).toThrow("Invalid month");
  });

  test("Jan", () => {
    expect(is31daysWithSwitch("Jan")).toBe(true);
  });

  test("Feb", () => {
    expect(is31daysWithSwitch("Feb")).toBe(false);
  });

  test("Mar", () => {
    expect(is31daysWithSwitch("Mar")).toBe(true);
  });

  test("Apr", () => {
    expect(is31daysWithSwitch("Apr")).toBe(false);
  });

  test("May", () => {
    expect(is31daysWithSwitch("May")).toBe(true);
  });

  test("Jun", () => {
    expect(is31daysWithSwitch("Jun")).toBe(false);
  });

  test("Jul", () => {
    expect(is31daysWithSwitch("Jul")).toBe(true);
  });

  test("Aug", () => {
    expect(is31daysWithSwitch("Aug")).toBe(true);
  });

  test("Sep", () => {
    expect(is31daysWithSwitch("Sep")).toBe(false);
  });

  test("Oct", () => {
    expect(is31daysWithSwitch("Oct")).toBe(true);
  });

  test("Nov", () => {
    expect(is31daysWithSwitch("Nov")).toBe(false);
  });

  test("Dec", () => {
    expect(is31daysWithSwitch("Dec")).toBe(true);
  });
});
