// 以下の仕様に基づいて RPG の戦士クラスと魔力を持った戦士である魔法戦士クラスをそれぞれ class を使った記法と prototype を使った記法で実装しなさい。
// 仕様

// 戦士は攻撃力 atk フィールドを持つ
// 戦士は攻撃 attack メソッドを持つ

// attack メソッドはそのインスタンスの atk の 2 倍の値をダメージとして返す
// 魔法戦士は戦士を継承する
// 魔法戦士は魔力 mgc フィールドを持つ
// 魔法戦士の attack は戦士としての attack の値にそのインスタンスの mgc の値を加算した値をダメージとして返す

export class Warrior {
  constructor(atk) {
    if (typeof atk !== "number") {
      throw new Error("atkは数値");
    }
    this.atk = atk;
  }

  attack() {
    return this.atk * 2;
  }
}

export class MagicWarrior extends Warrior {
  constructor(atk, mgc) {
    super(atk);
    if (typeof mgc !== "number") {
      throw new Error("mgcは数値");
    }
    this.mgc = mgc;
  }

  attack() {
    return super.attack() + this.mgc;
  }
}

export function WarriorPrototype(atk) {
  if (typeof atk !== "number") {
    throw new Error("atkは数値");
  }
  this.atk = atk;
}

WarriorPrototype.prototype.attack = function () {
  return this.atk * 2;
};

export function MagicWarriorPrototype(atk, mgc) {
  WarriorPrototype.call(this, atk);
  if (typeof mgc !== "number") {
    throw new Error("mgcは数値");
  }
  this.mgc = mgc;
}

MagicWarriorPrototype.prototype = Object.create(WarriorPrototype.prototype);
MagicWarriorPrototype.prototype.constructor = MagicWarriorPrototype;
MagicWarriorPrototype.prototype.attack = function () {
  return WarriorPrototype.prototype.attack.call(this) + this.mgc;
};
