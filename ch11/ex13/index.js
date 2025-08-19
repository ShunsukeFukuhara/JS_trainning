// JSON.stringify を自作した stringifyJSON 関数を作成しなさい。第二引数と第三引数には対応しなくて良いものとする。

// Jsonにそのまま含めると壊れる文字をエスケープする関数
const escapeString = (str) =>
  // eslint-disable-next-line no-control-regex
  str.replace(/[\\"\u0000-\u001F]/g, (ch) => {
    switch (ch) {
      case '"':
        return '\\"';
      case "\\":
        return "\\\\";
      case "\b":
        return "\\b";
      case "\f":
        return "\\f";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\t":
        return "\\t";
      default: {
        const code = ch.charCodeAt(0);
        return "\\u" + code.toString(16).padStart(4, "0");
      }
    }
  });

export function stringifyJSON(value) {
  if (value === null) return "null";

  if (typeof value === "boolean") return value ? "true" : "false";

  if (typeof value === "number") {
    if (!isFinite(value)) return "null";
    return String(value);
  }

  if (typeof value === "string") {
    return `"${escapeString(value)}"`;
  }

  if (Array.isArray(value)) {
    const elements = value.map((v) =>
      v === undefined || typeof v === "function" ? "null" : stringifyJSON(v)
    );
    return `[${elements.join(",")}]`;
  }

  if (typeof value === "object") {
    const entries = [];
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const v = value[key];
        if (v !== undefined && typeof v !== "function") {
          entries.push(`"${escapeString(key)}":${stringifyJSON(v)}`);
        }
      }
    }
    return `{${entries.join(",")}}`;
  }

  return undefined;
}
