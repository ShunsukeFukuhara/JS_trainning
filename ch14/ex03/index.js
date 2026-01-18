// 合成可能なダイアクリティカルマークを無視して文字列比較を行うパターンクラス定義しなさい。
// 合成可能なダイアクリティカルマークは文字列を Unicode 正規化して分解し、 \u0300-\u036f の範囲を取り除くと除去できます。

export class IgnoreAccentPattern {
  #pattern;
  #isStringPattern;

  constructor(pattern) {
    // 文字列の場合は g フラグなしで正規表現を作成
    if (typeof pattern === "string") {
      const normalized = pattern
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      this.#pattern = new RegExp(normalized);
      this.#isStringPattern = true;
      // 正規表現の場合は g フラグを追加して正規表現を作成
    } else if (pattern instanceof RegExp) {
      const flags = Array.from(new Set(pattern.flags + "g")).join("");
      const normalized = pattern.source
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      this.#pattern = new RegExp(normalized, flags);
      this.#isStringPattern = false;
    } else {
      throw new TypeError("Invalid pattern");
    }
  }

  [Symbol.search](str) {
    const normalizedStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedStr.search(this.#pattern);
  }

  [Symbol.match](str) {
    const normalizedStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (this.#isStringPattern) {
      // 文字列パターンはgフラグなしでmatch
      return normalizedStr.match(this.#pattern);
    } else {
      // 正規表現はgフラグありでmatch
      return normalizedStr.match(
        new RegExp(this.#pattern.source, this.#pattern.flags)
      );
    }
  }
}
