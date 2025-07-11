// ゲッターメソッドは値の取得以外の処理も記述することができる。
// 一例として、以下のような値を読み出す度にその値が 1 ずつ増えていくゲッターを持つクラスを作りなさい(初回呼び出しは0を返す)。
// また一方で、このようなクラス構造は一般的に良くないとされている。
// このクラスの問題点を説明しなさい。

export class C {
  constructor() {
    this._x = 0;
  }

  get x() {
    const value = this._x;
    this._x += 1;
    return value;
  }
}
