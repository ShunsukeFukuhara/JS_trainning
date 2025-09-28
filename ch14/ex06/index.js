// 以下のような関数を作成しなさい。
// 任意のオブジェクトを引数に取る
// そのオブジェクトの任意のメソッド呼び出しに対して、以下を持つオブジェクトを配列に追加して保存する Proxy を作成する。言い換えると Proxy 経由のオブジェクトのメソッド呼び出し履歴を配列に記録する
// 呼び出された時刻
// メソッド名
// パラメータ(引数)
// Proxy と 配列 双方への参照を返却する

export const makeProxyAndLogs = (obj) => {
  const logs = [];
  const handler = {
    get(target, prop, receiver) {
      const orig = target[prop];
      if (typeof orig === "function") {
        return function (...args) {
          logs.push({ name: prop, args, timestamp: new Date() });
          return orig.apply(this, args);
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  };

  const proxy = new Proxy(obj, handler);
  return [proxy, logs];
};
