import fs from "fs";
import path from "path";

// 実際のファイルパスを指定
const filePath = "éxample.txt";

// ファイルが存在するか確認
fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.log("ファイルが存在しません:", err);
    return;
  }

  // ファイル名を取得
  const fileName = path.basename(filePath);

  // 正規化してNFCに変換
  const fileNameNFC = fileName.normalize("NFC");

  // ファイル名とその正規化結果を比較する
  console.log("元のファイル名:", fileName);
  console.log("NFC形式での正規化:", fileNameNFC);

  // 同一かどうかを比較
  console.log("NFCと同一か?", fileName === fileNameNFC);
});
