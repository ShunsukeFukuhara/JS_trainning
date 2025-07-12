import {
  Warrior,
  MagicWarrior,
  WarriorPrototype,
  MagicWarriorPrototype,
} from "./index.js";

describe("Warrior", () => {
  it("atkフィールドを持つ", () => {
    const warrior = new Warrior(10);
    expect(warrior.atk).toBe(10);
  });

  it("atkは数値でなければならない", () => {
    expect(() => new Warrior("10")).toThrow();
  });

  it("attackメソッドはそのインスタンスのatkの2倍の値をダメージとして返す", () => {
    const warrior = new Warrior(10);
    expect(warrior.attack()).toBe(20);
  });
});

describe("MagicWarrior", () => {
  it("atkフィールドを持つ", () => {
    const magicWarrior = new MagicWarrior(10, 5);
    expect(magicWarrior.atk).toBe(10);
  });

  it("mgcフィールドを持つ", () => {
    const magicWarrior = new MagicWarrior(10, 5);
    expect(magicWarrior.mgc).toBe(5);
  });

  it("atkは数値でなければならない", () => {
    expect(() => new MagicWarrior("10", 5)).toThrow();
  });

  it("mgcは数値でなければならない", () => {
    expect(() => new MagicWarrior(10, "5")).toThrow();
  });

  it("attackメソッドは戦士としてのattackの値にそのインスタンスのmgcの値を加算した値をダメージとして返す", () => {
    const magicWarrior = new MagicWarrior(10, 5);
    expect(magicWarrior.attack()).toBe(25); // 20 (atk * 2) + 5 (mgc)
  });
});

describe("WarriorPrototype", () => {
  it("atkフィールドを持つ", () => {
    const warrior = new WarriorPrototype(10);
    expect(warrior.atk).toBe(10);
  });

  it("atkは数値でなければならない", () => {
    expect(() => new WarriorPrototype("10")).toThrow();
  });

  it("attackメソッドはそのインスタンスのatkの2倍の値をダメージとして返す", () => {
    const warrior = new WarriorPrototype(10);
    expect(warrior.attack()).toBe(20);
  });
});

describe("MagicWarriorPrototype", () => {
  it("atkフィールドを持つ", () => {
    const magicWarrior = new MagicWarriorPrototype(10, 5);
    expect(magicWarrior.atk).toBe(10);
  });

  it("mgcフィールドを持つ", () => {
    const magicWarrior = new MagicWarriorPrototype(10, 5);
    expect(magicWarrior.mgc).toBe(5);
  });

  it("atkは数値でなければならない", () => {
    expect(() => new MagicWarriorPrototype("10", 5)).toThrow();
  });

  it("mgcは数値でなければならない", () => {
    expect(() => new MagicWarriorPrototype(10, "5")).toThrow();
  });

  it("attackメソッドは戦士としてのattackの値にそのインスタンスのmgcの値を加算した値をダメージとして返す", () => {
    const magicWarrior = new MagicWarriorPrototype(10, 5);
    expect(magicWarrior.attack()).toBe(25); // 20 (atk * 2) + 5 (mgc)
  });
});
