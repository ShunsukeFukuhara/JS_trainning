// 文字列の書記素を反転させる関数を実装しなさい。例えば "家族 👨‍👨‍👧‍👧" が与えられれば "👨‍👨‍👧‍👧 族家" を返しなさい。

export const reverse = (str) => {
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const graphemes = [...segmenter.segment(str)].map(
    (segment) => segment.segment
  );
  return graphemes.reverse().join("");
};
