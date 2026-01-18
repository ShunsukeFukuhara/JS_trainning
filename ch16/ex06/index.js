// P.664 では fs.truncate() を利用してファイルを拡張した場合には拡張された部分には 0 が書き込まれる、
// と説明されていますが、これは ASCII の"0"が書き込まれるという意味ではありません。
// 実際に fs.truncate() を利用してファイルを拡張し、拡張されたファイルの内容を
// バイナリエディタ(Stirling や VSCode の HexEditor 拡張機能等)で確認しなさい。

import fs from "fs";

const filename = "ex06/example.txt";
const initialContent = "Hello, World!";

// 初期ファイルを作成
fs.writeFileSync(filename, initialContent);

// ファイルを拡張
const newSize = 30;

fs.truncateSync(filename, newSize);

console.log(`File content after truncation to ${newSize} bytes`);

// 拡張されたファイルの内容をバイナリ形式で表示
const content = fs.readFileSync(filename);
console.log(content);
