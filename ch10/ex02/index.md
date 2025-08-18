### 問題

CommonJS と ES Module 以外の JavaScript のモジュール方式名を調べて記述しなさい

### 回答

- AMD (Asynchronous Module Definition)

  - 非同期でモジュールを定義するための方式で、主にブラウザ環境で使用される。

  ```javascript
  // モジュールを定義する
  define("myModule", ["dependency"], function (dependency) {
    return {
      method: function () {
        dependency.doSomething();
      },
    };
  });

  // モジュールを読み込む
  require(["myModule"], function (myModule) {
    myModule.method();
  });
  ```

- UMD (Universal Module Definition)

  - AMD と CommonJS の両方の方式をサポートするための方式で、ブラウザと Node.js の両方で使用される。
  - UMD は、モジュールがどの環境で実行されても正しく動作するように設計されている。

  ```javascript
  // UMD モジュールの定義
  (function (root, factory) {
    if (typeof define === "function" && define.amd) {
      // AMD 環境
      define(["dependency"], factory);
    } else if (typeof exports === "object") {
      // CommonJS 環境
      module.exports = factory(require("dependency"));
    } else {
      // グローバル環境
      root.myModule = factory(root.dependency);
    }
  })(this, function (dependency) {
    return {
      method: function () {
        dependency.doSomething();
      },
    };
  });
  ```
