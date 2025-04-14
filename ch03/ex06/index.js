export function slice(str, indexStart, indexEnd) {
  const result = [];
  const strArray = Array.from(str);
  const length = strArray.length;

  // indexStart 補正
  if (!Number.isFinite(indexStart)) indexStart = 0;
  indexStart = Math.trunc(indexStart);
  if (indexStart < 0) indexStart += length;
  indexStart = Math.max(0, Math.min(length, indexStart));

  // indexEnd 補正
  if (indexEnd == null || (!Number.isFinite(indexEnd) && !isNaN(indexEnd))) {
    indexEnd = length;
  } else if (isNaN(indexEnd)) {
    indexEnd = 0;
  }
  indexEnd = Math.trunc(indexEnd);
  if (indexEnd < 0) indexEnd += length;
  indexEnd = Math.max(0, Math.min(length, indexEnd));

  // 無効な範囲なら空文字
  if (indexStart >= indexEnd) return "";

  // 始端と終端の間を1文字ずつ入れる
  strArray.forEach((char, index) => {
    if (index >= indexStart && index < indexEnd) {
      result.push(char);
    }
  });

  return result.join("");
}
