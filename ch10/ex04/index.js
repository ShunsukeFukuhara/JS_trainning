// 任意の関数とクラスを作成し、「ES6のモジュール」方式で別ファイルから利用するコードを実装しなさい。
// ただし、デフォルトのエクスポート、名前変更を伴うインポート、再エクスポートをそれぞれ実施すること。

import MyClass, { greet } from "./my_class.js";
import { farewell as sayGoodbye } from "./re_export.js";

const instance = new MyClass("Alice");
console.log(instance.greet()); // "Hello, Alice!"

console.log(greet("Bob")); // "Hello, Bob!"
console.log(sayGoodbye("Charlie")); // "Goodbye, Charlie!"
