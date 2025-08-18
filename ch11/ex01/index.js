// 以下のような動作を実現する、 TypeMap クラスを作成しなさい。

// Map と同様のインタフェース(get, set)を持つ。ただし、key はコンストラクタ関数に限定する
// set では、 コンストラクタ関数の key と そのクラスの value のみ受け付け、それ以外の値が渡された場合はエラーとする。これにより、get で取得する値が key に指定したコンストラクタ関数のクラスであることを保証する。
// TypeScript の場合はそのような key, value の型定義とする
// プリミティブ値は、ラッパークラスのコンストラクタ関数で get/set 可能とする

export class TypeMap {
  constructor() {
    this.map = new Map();
  }

  #checkConstructor(key) {
    try {
      // newを実際に実行してコンストラクタ関数化を確認する
      // ただし直接実行してしまうと副作用が起きるため、Proxyを使って関数の中身を差し替えておく
      new new Proxy(key, { construct: () => ({}) })();
    } catch (e) {
      throw new Error(`${key.name}はコンストラクタ関数ではありません`);
    }
  }

  #checkValueType(key, value) {
    // instanceof 判定（オブジェクト用）
    if (value instanceof key) {
      return;
    }

    // プリミティブ型チェック
    if (
      (key === String && typeof value === "string") ||
      (key === Number && typeof value === "number") ||
      (key === Boolean && typeof value === "boolean") ||
      (key === BigInt && typeof value === "bigint") ||
      (key === Symbol && typeof value === "symbol")
    ) {
      return;
    }

    // それ以外の型はエラー
    throw new Error(
      `${value.constructor.name}は${key.name}のインスタンスではありません`
    );
  }

  set(key, value) {
    this.#checkConstructor(key);
    this.#checkValueType(key, value);
    this.map.set(key, value);
  }

  get(key) {
    this.#checkConstructor(key);
    return this.map.get(key);
  }
}
