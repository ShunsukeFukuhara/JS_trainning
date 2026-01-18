// decartesianオブジェクトのテスト
import { decartesian } from "./index.js";

describe("decartesian", () => {
  it("initial values for x and y are 0", () => {
    const point = Object.create(decartesian);
    point.r = 0;
    point.theta = 0;

    expect(point.x).toBeCloseTo(0);
    expect(point.y).toBeCloseTo(0);
  });

  it("setting x to NaN throws an error", () => {
    const point = Object.create(decartesian);
    expect(() => {
      point.x = NaN;
    }).toThrow(TypeError);
  });

  it("setting y to NaN throws an error", () => {
    const point = Object.create(decartesian);
    expect(() => {
      point.y = NaN;
    }).toThrow(TypeError);
  });

  it("setting x (+) updates r,theta and theta correctly", () => {
    const point = Object.create(decartesian);

    point.x = 3;
    expect(point.r).toBeCloseTo(3);
    expect(point.theta).toBeCloseTo(0);
  });

  it("setting x (0) updates r,theta and theta correctly", () => {
    const point = Object.create(decartesian);
    point.r = Math.sqrt(2);
    point.theta = Math.PI / 4;
    point.x = 0;
    expect(point.r).toBeCloseTo(1);
    expect(point.theta).toBeCloseTo(Math.PI / 2);
  });

  it("setting x (-) updates r,theta and theta correctly", () => {
    const point = Object.create(decartesian);
    point.x = -3;
    expect(point.r).toBeCloseTo(3);
    expect(point.theta).toBeCloseTo(Math.PI);
  });

  it("setting y (+) updates r,theta and theta correctly", () => {
    const point = Object.create(decartesian);

    point.y = 4;
    expect(point.r).toBeCloseTo(4);
    expect(point.theta).toBeCloseTo(Math.PI / 2);
  });

  it("setting y (0) updates r,theta and theta correctly", () => {
    const point = Object.create(decartesian);
    point.r = Math.sqrt(2);
    point.theta = Math.PI / 4;
    point.y = 0;
    expect(point.r).toBeCloseTo(1);
    expect(point.theta).toBeCloseTo(0);
  });

  it("setting y (-) updates r,theta and theta correctly", () => {
    const point = Object.create(decartesian);
    point.y = -4;
    expect(point.r).toBeCloseTo(4);
    expect(point.theta).toBeCloseTo(-Math.PI / 2);
  });

  it("setting x (+) and y (+) updates r and theta correctly", () => {
    const point = Object.create(decartesian);

    point.x = 1;
    point.y = Math.sqrt(3);

    expect(point.r).toBeCloseTo(2);
    expect(point.theta).toBeCloseTo(Math.PI / 3);
  });

  it("setting x (+) and y (-) updates r and theta correctly", () => {
    const point = Object.create(decartesian);

    point.x = 1;
    point.y = -Math.sqrt(3);

    expect(point.r).toBeCloseTo(2);
    expect(point.theta).toBeCloseTo(-Math.PI / 3);
  });

  it("setting x (-) and y (+) updates r and theta correctly", () => {
    const point = Object.create(decartesian);

    point.x = -1;
    point.y = Math.sqrt(3);

    expect(point.r).toBeCloseTo(2);
    expect(point.theta).toBeCloseTo((2 * Math.PI) / 3);
  });

  it("setting x (-) and y (-) updates r and theta correctly", () => {
    const point = Object.create(decartesian);

    point.x = -1;
    point.y = -Math.sqrt(3);

    expect(point.r).toBeCloseTo(2);
    expect(point.theta).toBeCloseTo((-Math.PI * 2) / 3);
  });

  it("setting x (0) and y updates r and theta correctly", () => {
    const point = Object.create(decartesian);
    point.x = 0;
    point.y = 5;
    expect(point.r).toBeCloseTo(5);
    expect(point.theta).toBeCloseTo(Math.PI / 2);
  });
  it("setting y (0) and x updates r and theta correctly", () => {
    const point = Object.create(decartesian);
    point.x = 5;
    point.y = 0;
    expect(point.r).toBeCloseTo(5);
    expect(point.theta).toBeCloseTo(0);
  });

  it("setting x (0) and y (0) updates r and theta correctly", () => {
    const point = Object.create(decartesian);
    point.x = 0;
    point.y = 0;
    expect(point.r).toBeCloseTo(0);
    expect(point.theta).toBeCloseTo(0);
  });
});
