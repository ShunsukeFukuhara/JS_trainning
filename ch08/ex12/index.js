// プログラミング言語によっては無名関数の引数名を省略し、短く書けるものがある。
// JavaScript で同様の書き方ができるような 関数 f を作成しなさい。

export const f = (body) => {
  //$1, $2, ... のようなプレースホルダを抽出
  const placeholders = [...new Set(body.match(/\$(\d+)/g) || [])]
    .map((s) => s.slice(1))
    .map(Number)
    .sort((a, b) => a - b);

  // プレースホルダの数に応じて引数名を生成
  const argNames = placeholders.map((i) => `arg${i}`);

  // プレースホルダを引数名に置き換える
  let replacedBody = body;
  for (const i of placeholders.sort((a, b) => b - a)) {
    const regex = new RegExp(`\\$${i}\\b`, "g");
    replacedBody = replacedBody.replace(regex, `arg${i}`);
  }

  // body が { で始まる場合はブロック文とみなす
  const isBlock = replacedBody.trim().startsWith("{");
  const funcCode = isBlock
    ? // ブロック文の場合はそのまま返す
      `return function(${argNames.join(", ")}) ${replacedBody};`
    : // 式文の場合は return を付けて返す
      `return function(${argNames.join(", ")}) { return ${replacedBody}; };`;

  return new Function(funcCode)();
};
