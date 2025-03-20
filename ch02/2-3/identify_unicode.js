import path from "path";

// 2つのファイルの絶対パスを取得
const file1Path = path.resolve("テスト.txt");
const file2Path = path.resolve("デズド.txt");

// ファイル名の文字数を比較
console.log("テスト.txt");
console.log(file1Path);
console.log("長さ", file1Path.length);

console.log("デズド.txt");
console.log(file2Path);
console.log("長さ", file2Path.length);

// ファイル名の比較
if (file1Path.length === file2Path.length) {
  console.log("ファイルの長さは同じです。");
} else {
  console.log("ファイルの長さは異なります。");
}
