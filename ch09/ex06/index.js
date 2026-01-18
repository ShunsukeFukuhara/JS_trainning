// 例 9-6 の TypedMap を継承ではなくコンポジションを使って書き換えなさい。処理を完全に Map に委譲するメソッドはテストを省略してもよい。

export class TypedMap {
  constructor(keyType, valueType, entries) {
    this.keyType = keyType;
    this.valueType = valueType;
    this.map = new Map(entries);

    if (entries) {
      for (const [k, v] of entries) {
        this._checkTypes(k, v);
      }
    }
  }

  _checkTypes(key, value) {
    if (typeof key !== this.keyType) {
      throw new TypeError(`${key}は${this.keyType}にする必要がある`);
    }
    if (typeof value !== this.valueType) {
      throw new TypeError(`${value}は${this.valueType}にする必要がある`);
    }
  }

  set(key, value) {
    this._checkTypes(key, value);
    return this.map.set(key, value);
  }

  get(key) {
    return this.map.get(key);
  }

  has(key) {
    return this.map.has(key);
  }

  delete(key) {
    return this.map.delete(key);
  }

  clear() {
    return this.map.clear();
  }

  get size() {
    return this.map.size;
  }
}
