// 自作関数のtoString()の出力を確認
function myFunction() {
  return "Hello, World!";
}
console.log(myFunction.toString()); // function myFunction() {  return "Hello, World!";  }

// 組み込み関数に対するtoString()の出力を確認
console.log(Math.max.toString()); // function max() { [native code] }
