// 可変長引数を受け取り、以下の仕様でオブジェクトを返却する関数 sequenceToObject(...values)を作成しなさい。

// 奇数番に string の値を受け取り偶数番に任意の値を受け取り、各偶数奇数のペアで {奇数番の値: 偶数番の値}の形式になるオブジェクトを返却する。例えばsequenceToObject("a", 1, "b", 2)は{a: 1, b: 2}を返却する
// いずれかの奇数番の値が string でない場合、または値の個数の合計が偶数ではない場合は例外を発生させる

export const sequenceToObject = (...values) => {
  if (values.length % 2 !== 0) throw new Error("値の個数は偶数");

  // 奇数番の値
  const oddValues = values.filter((_, index) => index % 2 === 0);

  // 偶数番の値
  const evenValues = values.filter((_, index) => index % 2 !== 0);

  oddValues.forEach((value) => {
    if (typeof value !== "string") {
      throw new Error("奇数番の値は string");
    }
  });

  return Object.fromEntries(
    oddValues.map((oddValue, index) => [oddValue, evenValues[index]])
  );
};

// また作成した sequenceToObject に対してスプレッド演算子で配列を与えられることを確認しなさい。
console.log(sequenceToObject(...["a", 1, "b", 2])); // { a: 1, b: 2 }
console.log(sequenceToObject(...["x", 10, "y", 20, "z", 30])); // { x: 10, y: 20, z: 30 }
