import fs from "fs";

// NFCのファイルパス
const nfcE = "\u00E9";
const nfcFilePath = `${nfcE}xample.txt`;

// NFDのファイルパス
const nfdE = "e\u0301";
const nfdFilePath = `${nfdE}xample.txt`;

// ファイルが存在するか確認
fs.access(nfcFilePath, fs.constants.F_OK, (err) => {
  if (err) {
    return;
  }

  console.log("NFCファイルが存在します");
});

fs.access(nfdFilePath, fs.constants.F_OK, (err) => {
  if (err) {
    return;
  }

  console.log("NFDファイルが存在します");
});
