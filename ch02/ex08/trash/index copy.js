import { parse } from "acorn";

export const removeSemicolon = (str) => {
  let ast;
  // ASTにパース
  try {
    ast = parse(str, { ecmaVersion: 2020 });
  } catch (e) {
    // パースに失敗した場合はそのまま返す
    return str;
  }

  return generateText(ast.body, str);
};

const generateText = (body, str) => {
  let generated = "";

  // nodeのstartとendを使って該当する部分を取り出す
  const getPart = (node) => {
    return str.slice(node.start, node.end);
  };

  // node開始前の文字を取得
  // nodeが先頭にある場合は空文字を返す
  const getPreChar = (node) => {
    if (node.start === 0) {
      return "";
    }
    return str.slice(node.start - 1, node.start);
  };

  // node内のセミコロンを削除する
  const removeSemicolonFromNode = (node) => {
    let removed = getPart(node).replace(/;$/, "");

    // 本当にセミコロンを削除してよいかどうかの判定
    const backText = str.slice(node.end); // nodeの後ろの文字列
    const backTextWithoutSpace = backText.replace(/ /g, ""); // nodeの後ろの文字列から空白を削除したもの
    const backTextWithoutSpaceOrLineBreak = backText.replace(/\s/g, ""); // nodeの後ろの文字列から空白と改行を削除したもの
    const isEndOfCode = backTextWithoutSpaceOrLineBreak === ""; // コードの最後かどうか

    // 後ろの文字まで改行が挟まっていない場合
    const isNotNewline =
      !backTextWithoutSpace.startsWith("\n") &&
      !backTextWithoutSpace.startsWith("\r") &&
      !isEndOfCode;
    // もしnodeの後ろに(がある場合は関数実行と混ざる
    const existBracket = backTextWithoutSpaceOrLineBreak[0] === "(";

    if (existBracket || isNotNewline) {
      removed += ";";
    }

    return removed;
  };

  const addText = (text) => {
    generated += text;
  };

  // node配列を引き取ってASTを再帰的に処理する関数
  const generate = (nodes) => {
    nodes.forEach((node) => {
      switch (node.type) {
        // ブロック文
        case "BlockStatement":
          generate(node.body);
          return;
        // return文
        case "ReturnStatement":
          addText("return ");
          generate([node.argument]);
          return;
        // 式文
        case "ExpressionStatement":
          generate([node.expression]);
          return;
        // 関数呼び出し
        case "CallExpression":
          // 関数が引数の場合はセミコロンがあるかも
          if (
            node.callee.type === "ArrowFunctionExpression" ||
            node.callee.type === "FunctionExpression"
          ) {
            generate([node.callee]);
            return;
          }
          addText(getPreChar(node));
          addText(getPart(node));
          return;
        // メンバー式
        case "MemberExpression":
          generate([node.object]);
          addText(".");
          generate([node.property]);
          return;
        case "BinaryExpression": {
          return addText(getPart(node));
        }
        // 関数
        case "FunctionExpression":
          addText(`function(`);
          node.params.forEach((param) => {
            generate([param]);
            addText(", ");
          });
          addText(generated.slice(0, -2) + ") { ");
          generate([node.body]);
          addText(" }");
          return;
        // アロー関数
        case "ArrowFunctionExpression":
          addText("(");
          node.params.forEach((param) => {
            generate([param]);
            addText(", ");
          });
          addText(generated.slice(0, -2) + ") => ");
          generate([node.body]);
          return;
        case "Identifier":
          addText(node.name);
          return;
        // 変数宣言
        case "VariableDeclaration":
          // テンプレートリテラルが変数宣言の中にある場合は、全体から再評価する
          node.declarations.forEach((d) => {
            if (d.init.type === "TemplateLiteral") {
              generate([d.init]);
              return;
            }
          });
          // そうでない場合はそのまま返す
          addText(getPreChar(node));
          addText(removeSemicolonFromNode(node));
          return;
        // 変数宣言子
        case "VariableDeclarator":
          addText(getPart(node));
          return;
        // リテラル
        case "Literal":
          addText(node.raw);
          return;

        // テンプレートリテラル
        case "TemplateLiteral":
          addText(generateText(node.expressions, getPart(node)));
          return;
        default:
          console.log(node);
          throw new Error("未対応だお");
      }
    });
  };

  generate(body);

  return generated;
};

const templateLiteralOrg = `const temp = \`
\${(() => {
  const a = 1;
  const b = \`
  \${a};
  \`;
  return b;
})()}hogehoge
foo;
\`;`;
const templateLiteralEx = `const temp = \`
\${(() => {
  const a = 1
  const b = \`
  \${a};
  \`
  return b
})()}hogehoge
foo;
\``;
const made = removeSemicolon(templateLiteralOrg);
console.log(made);
console.log("-----------");
console.log(templateLiteralEx);
console.log(templateLiteralEx === made);
