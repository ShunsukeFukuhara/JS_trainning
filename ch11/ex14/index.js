// 以下の各関数を実装しなさい

// 日本語文字列の配列を受け取り、文字列中の大文字・小文字("つ"と"っ"等)、濁点・半濁点("は"と"ば"と"ば"等)の違いを無視してソートする sortJapanese 関数
export const sortJapanese = (arr) => {
  if (!Array.isArray(arr)) {
    throw new Error("配列を渡してください");
  }

  // 正規化用関数
  const normalize = (str) => {
    return (
      str
        // NFDで分解 (例: "ば" → "は"+"゙")
        .normalize("NFD")
        // 濁点 (U+3099)、半濁点 (U+309A) を削除
        .replace(/[\u3099\u309A]/g, "")
        // 小書き文字を大きい仮名に変換
        .replace(/[ぁぃぅぇぉっゃゅょゎ]/g, (ch) => {
          const map = {
            ぁ: "あ",
            ぃ: "い",
            ぅ: "う",
            ぇ: "え",
            ぉ: "お",
            っ: "つ",
            ゃ: "や",
            ゅ: "ゆ",
            ょ: "よ",
            ゎ: "わ",
          };
          return map[ch] || ch;
        })
    );
  };

  // ソート
  return arr.slice().sort((a, b) => {
    const na = normalize(a);
    const nb = normalize(b);
    return na.localeCompare(nb, "ja");
  });
};

// Date オブジェクトを受け取り、令和6年4月2日 のように (和暦)y年m月d日 のフォーマットで日付の文字列を返す toJapaneseDateString 関数
export const toJapaneseDateString = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("有効なDateオブジェクトを渡してください");
  }

  // 和暦に変換
  const formatter = new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
    era: "long", // 令和
    year: "numeric", // 6
    month: "numeric", // 4
    day: "numeric", // 2
  });

  const parts = formatter.formatToParts(date);

  // このままでは令和5/3/19のようになってしまうので、
  // 要素毎に分解し、"年"、"月"、"日"を付け加える
  const era = parts.find((p) => p.type === "era")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";

  return `${era}${year}年${month}月${day}日`;
};
