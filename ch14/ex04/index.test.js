// ひらがな 1 文字とその UTF-16 コード単位をプロパティとしてもつ独自クラスを、
// 50 音順(UTF-16 コード単位順)で<や>で比較、ソートできるよう Symbol.toPrimitive を用いて実装し、テストコードを書きなさい。
// 文字列が期待される場合にはひらがなを、数字が期待される場合には UTF-16 コード単位を、
// どちらでもない場合にはひらがなを返すようにし、テストコードで確認しなさい。

import { Hiragana } from "./index.js";

const hiraganaMap = {
  あ: 0x3042,
  い: 0x3044,
  う: 0x3046,
  え: 0x3048,
  お: 0x304a,
  か: 0x304b,
  き: 0x304d,
  さ: 0x3055,
  し: 0x3057,
  た: 0x305f,
  ち: 0x3061,
  つ: 0x3064,
  っ: 0x3063,
  な: 0x306a,
  は: 0x306f,
  ま: 0x307e,
  や: 0x3084,
  ゃ: 0x3083,
  ゆ: 0x3086,
  ゅ: 0x3085,
  よ: 0x3088,
  ょ: 0x3087,
  ら: 0x3089,
  わ: 0x308f,
  を: 0x3092,
  ん: 0x3093,
};

describe("Hiragana", () => {
  test("文字列が期待される場合", () => {
    for (const [char] of Object.entries(hiraganaMap)) {
      const hira = new Hiragana(char);
      expect(String(hira)).toBe(char);
      expect(hira + "").toBe(char);
      expect(`${hira}`).toBe(char);
      expect(hira == char).toBe(true);
      expect(hira === char).toBe(false);
      expect(hira != char).toBe(false);
      expect(hira !== char).toBe(true);
    }
  });

  test("数字が期待される場合", () => {
    for (const [char, code] of Object.entries(hiraganaMap)) {
      const hira = new Hiragana(char);
      expect(Number(hira)).toBe(code);
      expect(+hira).toBe(code);
      expect(hira * 1).toBe(code);
      expect(hira / 1).toBe(code);
      expect(hira == code).toBe(true);
      expect(hira === code).toBe(false);
      expect(hira != code).toBe(false);
      expect(hira !== code).toBe(true);
    }
  });

  test("どちらでもない場合", () => {
    for (const [char] of Object.entries(hiraganaMap)) {
      const hira = new Hiragana(char);
      expect(hira + "").toBe(char);
      expect(hira == char).toBe(true);
      expect(hira === char).toBe(false);
      expect(hira != char).toBe(false);
      expect(hira !== char).toBe(true);
    }
  });

  test("ソートできること", () => {
    // Shuffleの確率で結果が偶然一致しないように、10回試行する
    const chars = Object.keys(hiraganaMap);
    for (let i = 0; i < 10; i++) {
      const shuffled = chars.slice().sort(() => Math.random() - 0.5);
      const hiraganaArray = shuffled.map((char) => new Hiragana(char));
      hiraganaArray.sort();
      const sortedChars = hiraganaArray.map((hira) => hira.char);
      expect(sortedChars).toEqual(chars);
    }
  });
});
