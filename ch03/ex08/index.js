// Number() 関数で true, 1234, "text" をそれぞれ数値変換しコンソール出力しなさい。
console.log(Number(true)); // 1
console.log(Number(1234)); // 1234
console.log(Number("text")); // NaN
// 同様に、Boolean() 関数で 1234, 0 を
console.log(Boolean(1234)); // true
console.log(Boolean(0)); // false
// 真偽値変換、String() 関数で true, 1234 を文字列変換しなさい。
console.log(String(true)); // true
console.log(String(1234)); // 1234
// 更に、parseInt() で "12,742 km：地球の直径"、
console.log(parseInt("12,742 km：地球の直径")); // 12
// parseFloat() で "1.618：黄金比" を変換してコンソール出力しなさい。
console.log(parseFloat("1.618：黄金比")); // 1.618
