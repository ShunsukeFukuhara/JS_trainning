// Object.assign()と等価な関数 assign() を作成しなさい。与えられたテストを全てパスすること。
export const assign = (target, ...sources) => {
  // targetがundefinedまたはnullはNG
  if (target === undefined || target === null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }

  // targetがオブジェクトでない場合は型変換
  if (typeof target !== "object" || target === null) {
    target = Object(target);
  }

  for (const source of sources) {
    // sourceがオブジェクトでない場合はスキップ
    if (typeof source !== "object" || source === null) {
      continue;
    }

    // 配列の場合
    if (Array.isArray(source)) {
      for (let i = 0; i < source.length; i++) {
        target[i] = source[i];
      }
      continue;
    }

    // プロパティのコピー
    for (const prop of Object.getOwnPropertyNames(source)) {
      target[prop] = source[prop];
    }

    // シンボルのコピー
    for (const sym of Object.getOwnPropertySymbols(source)) {
      // 列挙可能な場合のみコピー
      if (Object.getOwnPropertyDescriptor(source, sym)?.enumerable) {
        target[sym] = source[sym];
      }
    }
  }

  return target;
};
