// p.157 下部で記載されているテンプレートオブジェクトに存在しないプロパティをあるオブジェクトから削除する restrict()を以下の通り実装しなさい。
// Symbol と継承プロパティは考慮しなくてよい。

/**
 * @param {Object} target - 削除先オブジェクト — 削除対象プロパティを適用するもので、オリジナル変更後に返されます。Symbol と継承プロパティは削除対象外です。
 * @param {Object} template - 削除対象指定オブジェクト (単数または複数) — 削除したいプロパティを含むオブジェクトです。Symbol と継承プロパティは削除対象になりません。
 */
export const restrict = (target, template) => {
  // targetがオブジェクトでない場合は型変換
  if (typeof target !== "object" || target === null) {
    target = Object(target);
  }

  // templateがオブジェクトでない場合は空オブジェクトを使用
  if (typeof template !== "object" || template === null) {
    template = {};
  }

  // templateのプロパティをtargetから削除
  for (const prop of Object.getOwnPropertyNames(target)) {
    if (!Object.prototype.hasOwnProperty.call(template, prop)) {
      delete target[prop];
    }
  }

  return target;
};

// あるオブジェクトのプロパティを別のオブジェクトから削除する substract() 関数を以下の通り実装しなさい。
// Symbol と継承プロパティは考慮しなくてよい。

/**
 * @param {Object} target - 削除先オブジェクト — 削除対象プロパティを適用するもので、オリジナル変更後に返されます。Symbol と継承プロパティは削除対象外です。
 * @param {Object[]} sources - 削除対象指定オブジェクト (単数または複数) — 削除したいプロパティを含むオブジェクトです。Symbol と継承プロパティは削除対象になりません。
 */
export const substract = (target, ...sources) => {
  // targetがオブジェクトでない場合は型変換
  if (typeof target !== "object" || target === null) {
    target = Object(target);
  }

  // sourcesが配列でない場合は空配列を使用
  if (!Array.isArray(sources)) {
    sources = [];
  }

  // 各sourceのプロパティをtargetから削除
  for (const source of sources) {
    if (typeof source !== "object" || source === null) {
      continue;
    }

    for (const prop of Object.getOwnPropertyNames(source)) {
      delete target[prop];
    }
  }

  return target;
};
