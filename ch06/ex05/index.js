// 次の条件を満たすオブジェクトを作成し、for/in ループで順番を確認しなさい。

// 以下のプロパティを持つオブジェクトをプロトタイプとして持つ

// プロパティ名が数値のプロパティ
// プロパティ名が文字列のプロパティ
// 列挙可能なプロパティ

const protoObj = Object.create(
  {
    1: "one",
    two: "two",
  },
  {
    // 列挙可能なプロパティ
    enumerable: {
      value: "enumerable",
      enumerable: true,
      writable: false,
      configurable: false,
    },
  }
);

// 以下のプロパティを持つ

// プロパティ名が数値かつプロトタイプの数値プロパティと同名のプロパティ
// プロパティ名が数値かつプロトタイプの数値プロパティと同名でないプロパティ
// プロパティ名が文字列かつプロトタイプの文字列プロパティと同名のプロパティ
// プロパティ名が文字列かつプロトタイプの文字列プロパティと同名でないプロパティ
// 列挙不可かつプロトタイプの列挙可能プロパティと同名のプロパティ

const obj2 = Object.create(protoObj, {
  // プロパティ名が数値かつプロトタイプの数値プロパティと同名のプロパティ
  1: {
    value: "one",
    enumerable: false,
    writable: false,
    configurable: false,
  },
  // プロパティ名が数値かつプロトタイプの数値プロパティと同名でないプロパティ
  2: {
    value: "two",
    enumerable: true,
    writable: false,
    configurable: false,
  },
  // プロパティ名が文字列かつプロトタイプの文字列プロパティと同名のプロパティ
  two: {
    value: "two",
    enumerable: false,
    writable: false,
    configurable: false,
  },
  // プロパティ名が文字列かつプロトタイプの文字列プロパティと同名でないプロパティ
  three: {
    value: "three",
    enumerable: true,
    writable: false,
    configurable: false,
  },
  // 列挙不可かつプロトタイプの列挙可能プロパティと同名のプロパティ
  enumerable: {
    value: "enumerable",
    enumerable: false,
    writable: false,
    configurable: false,
  },
});

// for/in ループで順番を確認
for (const key in obj2) {
  console.log(key); // 1, 2, three
}
