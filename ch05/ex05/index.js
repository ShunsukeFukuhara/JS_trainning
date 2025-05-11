// 値が数値のプロパティを持つオブジェクトを引数に取り、偶数の値を持つプロパティだけを残した新しいオブジェクトを返す関数を作成しなさい。

const o = { x: 1, y: 2, z: 3 };

const f = (obj) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === "number" && value % 2 === 0) {
      acc[key] = value;
    }
    return acc;
  }, {});

console.log(f(o)); // { y: 2 }
console.log(o); // { x: 1, y: 2, z: 3 } 元のオブジェクトは変更しない
