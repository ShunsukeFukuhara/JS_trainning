// ベースの URLbase、追加するクエリadditionalQuery、パスpathを持つオブジェクトを引数に取り、
// ベースの URL のパスとクエリを修正した文字列を返す関数modifyUrlを実装しなさい。

export const modifyUrl = ({ base, addQuery = [], path = "" }) => {
  try {
    const url = new URL(base);
    if (path) {
      url.pathname = new URL(path, url).pathname;
    }
    addQuery.forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  } catch (error) {
    throw new Error("URLのフォーマットが正しくありません");
  }
};
