// バイナリデータの先頭数バイト (マジックバイト) を確認することでファイル種別を推測できる。
// 例えば PDF ファイルの場合、ファイルの先頭は 25 50 44 46 2D といったバイト列になっている (参考)。この知識があれば拡張子に頼らずにファイル種別を推測できる。
// 与えられたバイト列に対し、そのバイナリデータのファイル種別を返す関数 detectFileType を書きなさい。
// 考えられる全てのファイル種別に対応することは現実的ではないため、与えられたテストコードに対して動作する関数を書けば十分とする。

export const detectFileType = (data) => {
  // バッファの先頭を Uint8Array として読み取る
  const bytes = new Uint8Array(data.slice(0, 8));

  // PDF
  if (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  ) {
    return "PDF";
  }

  // ZIP
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    return "ZIP";
  }

  // GIF
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39)
  ) {
    return "GIF";
  }

  // PNG
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "PNG";
  }

  // UNKNOWN
  return "UNKNOWN";
};
