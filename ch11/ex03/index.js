// 引数として与えられる 符号なし 32 ビット整数の配列(Uint32Array) を受け取り、変換して符号なし 32 ビット整数の配列(Uint32Array) を返す次の二つの関数を実装しなさい。

// リトルエンディアンのバイト列として引数のデータを読み込み、ビッグエンディアンのバイト列に変換して返す関数
// ビッグエンディアンのバイト列として引数のデータを読み込み、リトルエンディアンのバイト列に変換して返す関数

// データがバイト列であることを確認する
const isByteArray = (data) => {
  if (data instanceof Uint32Array) {
    return;
  }

  throw new Error("引数はUint32Arrayでなければなりません");
};

export const toBigEndian = (data) => {
  isByteArray(data);
  // Uint32Arrayをビッグエンディアンに変換するためのバッファを作成
  const buffer = new ArrayBuffer(data.length * 4);
  const view = new DataView(buffer);

  // 各要素をビッグエンディアンで書き込む
  data.forEach((value, index) => {
    view.setUint32(index * 4, value, false); // 第3引数をfalseにするとビッグエンディアン
  });

  return new Uint32Array(buffer);
};

export const toLittleEndian = (data) => {
  isByteArray(data);
  // Uint32Arrayをリトルエンディアンに変換するためのバッファを作成
  const buffer = new ArrayBuffer(data.length * 4);
  const view = new DataView(buffer);

  // 各要素をリトルエンディアンで書き込む
  data.forEach((value, index) => {
    view.setUint32(index * 4, value, true); // 第3引数をtrueにするとリトルエンディアン
  });

  return new Uint32Array(buffer);
};
