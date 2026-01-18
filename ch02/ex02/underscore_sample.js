// ES6のimportを使ってUnderscoreを呼び出す
import _ from "underscore";

// 例: _.eachを使って配列の各要素を表示
const numbers = [1, 2, 3, 4, 5];
_.each(numbers, (num) => {
  console.log(num);
});
