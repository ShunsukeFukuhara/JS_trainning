import { instanceOf } from "./index.js";

// 作成した関数に対してテストを作成しなさい。
// テストケースには少なくとも以下を含むこと。

// 多段に継承したクラスのインスタンスと基底クラスのコンストラクタを入力するケース
// 継承関係にないインスタンスとクラスのコンストラクタを入力するケース

describe("instanceOf", () => {
  class Creature {}
  class Animal extends Creature {}
  class Dog extends Animal {}
  class Vehicle {}

  it("CreatureのインスタンスはCreatureと一致する", () => {
    const creature = new Creature();
    expect(instanceOf(creature, Creature)).toBe(true);
  });

  it("AnimalのインスタンスはCreatureと一致する", () => {
    const animal = new Animal();
    expect(instanceOf(animal, Creature)).toBe(true);
  });

  it("DogのインスタンスはAnimalと一致する", () => {
    const dog = new Dog();
    expect(instanceOf(dog, Animal)).toBe(true);
  });

  it("DogのインスタンスはCreatureと一致する", () => {
    const dog = new Dog();
    expect(instanceOf(dog, Creature)).toBe(true);
  });

  it("VehicleのインスタンスはCreatureと一致しない", () => {
    const vehicle = new Vehicle();
    expect(instanceOf(vehicle, Creature)).toBe(false);
  });

  it("VehicleのインスタンスはAnimalと一致しない", () => {
    const vehicle = new Vehicle();
    expect(instanceOf(vehicle, Animal)).toBe(false);
  });

  it("オブジェクトではない値は常にfalseを返す", () => {
    expect(instanceOf(null, Creature)).toBe(false);
    expect(instanceOf(42, Creature)).toBe(false);
    expect(instanceOf("string", Creature)).toBe(false);
    expect(instanceOf(undefined, Creature)).toBe(false);
  });
});
