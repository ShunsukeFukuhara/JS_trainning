import { toBigEndian, toLittleEndian } from "./index.js";

describe("Endian conversion", () => {
  it("toBigEndian が正しく変換できること", () => {
    const data = new Uint32Array([0x12345678, 0x90abcdef]);
    const be = toBigEndian(data);

    // DataViewでバイト順を確認
    const view = new DataView(be.buffer);
    expect(view.getUint8(0)).toBe(0x12);
    expect(view.getUint8(1)).toBe(0x34);
    expect(view.getUint8(2)).toBe(0x56);
    expect(view.getUint8(3)).toBe(0x78);

    expect(view.getUint8(4)).toBe(0x90);
    expect(view.getUint8(5)).toBe(0xab);
    expect(view.getUint8(6)).toBe(0xcd);
    expect(view.getUint8(7)).toBe(0xef);
  });

  it("toLittleEndian が正しく変換できること", () => {
    const data = new Uint32Array([0x12345678, 0x90abcdef]);
    const le = toLittleEndian(data);

    const view = new DataView(le.buffer);
    expect(view.getUint8(0)).toBe(0x78);
    expect(view.getUint8(1)).toBe(0x56);
    expect(view.getUint8(2)).toBe(0x34);
    expect(view.getUint8(3)).toBe(0x12);

    expect(view.getUint8(4)).toBe(0xef);
    expect(view.getUint8(5)).toBe(0xcd);
    expect(view.getUint8(6)).toBe(0xab);
    expect(view.getUint8(7)).toBe(0x90);
  });

  it("引数がUint32Arrayでない場合、エラーを投げること", () => {
    expect(() => toBigEndian([1, 2, 3])).toThrow();
    expect(() => toBigEndian("string")).toThrow();
    expect(() => toBigEndian(null)).toThrow();
    expect(() => toLittleEndian([1, 2, 3])).toThrow();
    expect(() => toLittleEndian("string")).toThrow();
    expect(() => toLittleEndian(null)).toThrow();
  });
});
