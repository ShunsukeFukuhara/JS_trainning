// オブジェクトリテラルで独自プロパティを持つオブジェクトを定義し、Object.create を使用してそのオブジェクトをプロトタイプとして持つ新しいオブジェクト生成しなさい。
// Object.getPrototypeOf()を利用して、生成したオブジェクトのプロトタイプが Object.create で渡したオブジェクトになっていることを確認しなさい。

const uniqueObject = {
  uniqueProperty: "This is a unique property",
  anotherProperty: "This is another property",
};

const newObject = Object.create(uniqueObject);

console.log(newObject); // {}
console.log(Object.getPrototypeOf(newObject) === uniqueObject); // true
console.log(newObject.uniqueProperty); // This is a unique property
console.log(newObject.anotherProperty); // This is another property
