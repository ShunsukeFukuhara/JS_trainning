// 文字列のパラメータを取り、制御文字など文字列リテラル作成時エスケープシーケンスで記述する必要がある文字 (p37 表 3-1 の\\より上)を、エスケープシーケンスに変換した文字列を返すメソッドを書きなさい。
// 例えば文字列中に\が含まれていたら、\\に変換しなさい。
// if-else で分岐するバージョンと switch で分岐するバージョンの両方を作りなさい。

// 対象: \0 \b \t \n \v \f \r \" \'

export const escapeStringWithIfElse = (str) => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "\0") {
      result += "\\0";
    } else if (str[i] === "\b") {
      result += "\\b";
    } else if (str[i] === "\t") {
      result += "\\t";
    } else if (str[i] === "\n") {
      result += "\\n";
    } else if (str[i] === "\v") {
      result += "\\v";
    } else if (str[i] === "\f") {
      result += "\\f";
    } else if (str[i] === "\r") {
      result += "\\r";
    } else if (str[i] === '"') {
      result += '\\"';
    } else if (str[i] === "'") {
      result += "\\'";
    } else {
      result += str[i];
    }
  }
  return result;
};

export const escapeStringWithSwitch = (str) => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      case "\0":
        result += "\\0";
        break;
      case "\b":
        result += "\\b";
        break;
      case "\t":
        result += "\\t";
        break;
      case "\n":
        result += "\\n";
        break;
      case "\v":
        result += "\\v";
        break;
      case "\f":
        result += "\\f";
        break;
      case "\r":
        result += "\\r";
        break;
      case '"':
        result += '\\"';
        break;
      case "'":
        result += "\\'";
        break;
      default:
        result += str[i];
    }
  }
  return result;
};
