// 以下のクラスは常に正の数値を保持するクラスで、0以下の値を保持することを許容していない。
// 一方で、xのフィールドは外部から直接アクセス可能なため、常に正の値を保持するという条件を破った状態を作ることができてしまう。
// このクラスをクロージャを用いて書き直し、フィールドxに対して外部から直接書き換えができないようにしなさい。(実装方法はテキストP.226の例を参考にしなさい。)

export const PositiveNumber = (function () {
  let x;
  return class {
    constructor(value) {
      if (value <= 0) {
        throw new Error("require : x > 0");
      }
      x = value;
    }

    getX() {
      return x;
    }

    setX(value) {
      if (value <= 0) {
        throw new Error("require : x > 0");
      }
      x = value;
    }
  };
})();
