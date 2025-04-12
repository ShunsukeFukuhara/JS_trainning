import { parse } from "acorn";
import fs from "fs";

export const parseSourceCode = (str) => {
  let ast;
  // ASTにパース
  try {
    ast = parse(str, { ecmaVersion: 2020 });
  } catch (e) {
    // パースに失敗した場合はそのまま返す
    return str;
  }

  const json = generate(ast);

  fs.writeFileSync("ast.json", json);
};

const generate = (body) => {
  const json = JSON.stringify(body, null, 2);
  // jsonで出力する
  console.log(json);

  return json;
};

// const org = `let a
// a
// =
// 3
// console.log(a)
// `;
// console.log("result1----------------");
// parseSourceCode(org);

const org2 = `let a; a = 3; console.log(a);`;
console.log("result2----------------");
parseSourceCode(org2);
