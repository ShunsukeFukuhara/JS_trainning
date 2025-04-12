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

  // 文字列の操作
  // generateに値を追加する
  const addText = (text) => (generated += text);

  // node背後のセミコロンを削除した文字列を返す
  const getSemicolonRemovedText = (node) => getPart(node).replace(/;$/, "");

  // 文字列の判定
  // nodeの後ろの文字列
  const backText = (node) => str.slice(node.end); // nodeの後ろの文字列

  // nodeの後ろの文字列から空白を削除したもの
  const backTextWithoutSpace = (node) => backText(node).replace(/ /g, "");

  // nodeの後ろの文字列から空白と改行を削除したもの
  const backTextWithoutSpaceOrLineBreak = (node) =>
    backText(node).replace(/\s/g, "");

  // nodeの後ろから次の文字までの間にある空白と改行をそのまま取得する
  const backSpaceAndLineBreak = (node) => {
    // 次の非空白文字が現れるまでの文字列（空白と改行を含む）を取得
    const match = backText(node).match(/^\s*/); // 先頭の空白と改行を取得

    return match ? match[0] : "";
  };

  // nodeの後ろに(空白や改行の有無に依らず)"("のかっこがあるかどうか。
  const existsBrancketAfter = (node) =>
    backTextWithoutSpaceOrLineBreak(node).startsWith("(");

  // nodeの後ろに(空白の有無によらず)改行があるかどうか
  const exsitsLineBreakAfter = (node) =>
    backTextWithoutSpace(node).startsWith("\n");

  // nodeがコードの最後かどうか
  const isEndOfCode = (node) => backTextWithoutSpace(node) === "";

  // node配列を引き取ってASTを再帰的に処理する関数
  const generate = (nodes) => {
    nodes.forEach((node) => {
      switch (node.type) {
        // 変数宣言
        case "VariableDeclaration":
          // テンプレートリテラルが含まれる場合、文の中間にも削除対象のセミコロンがある可能性がある
          // 別途処理が必要なので、その場合はテンプレートリテラルの処理を行う
          if (
            node.declarations.some((d) => d.init.type === "TemplateLiteral")
          ) {
            const tempText = getTextWithTemplateLiteral(node.declarations);
            addText(tempText);
          } else {
            addText(getSemicolonRemovedText(node));
          }
          // 直後に(がある場合は後続行と被らないようにセミコロンを入れる
          // 改行がある場合は改行を入れる。また文の最後でない場合は後続行と被らないようにセミコロンを入れる
          if (
            existsBrancketAfter(node) ||
            (!exsitsLineBreakAfter(node) && !isEndOfCode(node))
          ) {
            addText(";");
          }

          // 後ろにあった空白と改行はそのまま戻す
          addText(backSpaceAndLineBreak(node));
          return;

        // 式文
        case "ExpressionStatement":
          addText(getSemicolonRemovedText(node));
          return;

        // 呼び出し式
        case "CallExpression":
          addText(str.slice(node.start, node.callee.start)); // (を取得
          generate([node.callee]);
          addText(str.slice(node.callee.end, node.end)); // )()を取得
          return;

        // アロー関数
        case "ArrowFunctionExpression":
          // todo: voidの引数しか対応していない
          addText(str.slice(node.start, node.body.start)); // () => を取得
          generate([node.body]);
          return;

        // ブロック文
        case "BlockStatement":
          addText(str.slice(node.start, node.body[0].start));
          addText(getTextWithBlockStatement(node.body));
          addText(str.slice(node.body[node.body.length - 1].end, node.end));
          return;

        // 直値
        case "Identifier":
          addText(getPart(node));
          return;

        // return文
        case "ReturnStatement":
          addText(getPart(node));
          return;

        default:
          console.log(node);
          console.log(getPart(node));
          throw new Error("未対応だお");
      }
    });
  };

  // ブロック文の処理
  const getTextWithBlockStatement = (nodes) => generateText(nodes, str);

  // テンプレートリテラルがある場合の処理
  const getTextWithTemplateLiteral = (nodes) => {
    let generatedInner = "";

    nodes.forEach((node) => {
      const text = getPart(node);

      if (node.init.type === "TemplateLiteral") {
        // テンプレート文字列全体から `${...}` を取り出して処理
        generatedInner += text.replace(/\$\{([\s\S]*?)\}/g, (_, inner) => {
          // inner（中のコード）を再帰的にセミコロン除去
          const cleaned = removeSemicolon(inner);
          return "${" + cleaned + "}";
        });
      } else {
        generatedInner += text;
      }
    });

    return generatedInner;
  };
  // const getTextWithTemplateLiteral = (nodes) => {
  //   let generatedInner = "";
  //   nodes.forEach((node) => {
  //     // テンプレートリテラル内部の再帰処理
  //     if (node.init.type === "TemplateLiteral") {
  //       const tempText = generateText(node.init.expressions, str);
  //       generatedInner += tempText;
  //       return;
  //     }

  //     // そうでない場合はそのまま返す
  //     generatedInner += getPart(node);
  //   });

  //   return generatedInner;
  // };

  generate(body);

  return generated;
};

const org = `const temp = \`
\${(() => {
  const a = 1;
  const b = \`
  \${a};
  \`;
  return b;
})()}hogehoge
foo;
\`;`;
const exp = `const temp = \`
\${(() => {
  const a = 1
  const b = \`
  \${a};
  \`
  return b
})()}hogehoge
foo;
\``;
const made = removeSemicolon(org);
console.log("-----------");
console.log(made);
console.log("-----------");
console.log(exp);
console.log(exp === made);
