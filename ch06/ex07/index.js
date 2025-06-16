// Object.assign()と等価な関数 assign() を作成しなさい。与えられたテストを全てパスすること。
export const assign = (target, sources) => {
  if (typeof target !== "object" || target === null) {
    throw new TypeError("Target must be an object");
  }

  if (!Array.isArray(sources)) {
    sources = [sources];
  }

  for (const source of sources) {
    if (typeof source !== "object" || source === null) {
      continue;
    }

    const ownPropertyNames = Object.getOwnPropertyNames(source);
    const ownSymbolPropertyNames = Object.getOwnPropertySymbols(source);

    for (const prop of ownPropertyNames) {
      target[prop] = source[prop];
    }

    for (const sym of ownSymbolPropertyNames) {
      target[sym] = source[sym];
    }
  }

  return target;
};
