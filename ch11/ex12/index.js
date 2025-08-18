// テキストでは独自のエラーとして ParseError や HTTPError クラスの例がありました。自分でも独自のエラーを実装しなさい。
// エラーの例が思いつかない場合には、ファイルのパスを引数に受けとる関数で、ファイルのサイズが許容サイズをオーバーしている場合に投げるエラーを実装しなさい。

export class FileSizeError extends Error {
  constructor(filePath, maxSize) {
    super(
      `ファイル ${filePath} のサイズが許容サイズ ${maxSize} をオーバーしています`
    );
    this.name = "FileSizeError";
    this.filePath = filePath;
    this.maxSize = maxSize;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}
