// 任意の関数とクラスを作成し、「Nodeのモジュール」方式で別ファイルから利用するコードを実装しなさい。

// myClass.jsから呼び出す
const MyClass = require("./my_class.cjs");

const myInstance = new MyClass("Alice");
console.log(myInstance.greet()); // "Hello, Alice!"

// * node ch10/ex03/index.cjsで実行してあげる必要あり
