// 配列 ["r", "i", "c", "o", "h"] の "o" の要素を delete で削除したとき、削除後の配列の内容と length の値をコンソール出力で確認しなさい。

const array = ["r", "i", "c", "o", "h"];

delete array[3];
console.log(array); // ["r", "i", "c", <1 empty item>, "h"]
console.log(array.length); // 5
