// ユーザーの環境におけるUnicodeの正規化形式の違いを確認するコード
const normalizeString = (str, form) => str.normalize(form);

const testString = "é"; // U+00E9 (é)はNFDでは分解され、NFCでは合成されます

console.log("NFC形式での正規化:", normalizeString(testString, "NFC"));
console.log("NFD形式での正規化:", normalizeString(testString, "NFD"));

// 文字列が異なる正規化形式で保存されることを示すために、
// WindowsとmacOSで異なる挙動を確認することができます。
// 例えば、macOSのファイルシステムでは、NFCで保存されることが多いですが、
// WindowsではNFD形式が保存されることもあります。
