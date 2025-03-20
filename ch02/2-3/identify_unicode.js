import fs from "fs";
import path from "path";
import unicodify from "unorm"; // unorm ライブラリを使う

// テストファイル名を指定
const fileName = "デズド.txt"; // 例: ファイル名に濁音や半濁音を含む

// ファイルのパスを取得
const filePath = path.resolve(fileName);

// NFDとNFCに正規化
const nfdFileName = unicodify.nfd(fileName);
const nfcFileName = unicodify.nfc(fileName);

// ファイルシステム上の保存形式（正規化前のファイル名）を確認
console.log("オリジナルファイル名:", fileName);
console.log("NFD形式に正規化:", nfdFileName);
console.log("NFC形式に正規化:", nfcFileName);

// ファイルパスの正規化形式を比較
console.log("NFDとNFCの比較:");
if (fileName === nfcFileName) {
  console.log("同じ。");
} else {
  console.log("異なる");
}

// ファイルが存在するか確認（ファイルシステムが保存する形式での確認）
fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error("ファイルが存在しません:", filePath);
  } else {
    console.log("ファイルは存在します:", filePath);
  }
});
