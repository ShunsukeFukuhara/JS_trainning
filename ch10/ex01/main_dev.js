/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = {
    /***/ "./ch10/ex01/index.cjs":
      /*!*****************************!*\
  !*** ./ch10/ex01/index.cjs ***!
  \*****************************/
      /***/ (
        __unused_webpack_module,
        __unused_webpack_exports,
        __webpack_require__
      ) => {
        eval(
          '{// 必要なモジュールへの参照を取得する。\r\nconst stats = __webpack_require__(/*! ./stats.cjs */ "./ch10/ex01/stats.cjs");\r\nconst BitSet = (__webpack_require__(/*! ./sets.cjs */ "./ch10/ex01/sets.cjs").BitSet);\r\n// モジュールを使ってコードを記述する。\r\nlet s = new BitSet(100);\r\ns.insert(10);\r\ns.insert(20);\r\ns.insert(30);\r\n// eslint-disable-next-line no-unused-vars\r\nlet average = stats.mean([...s]); // average は20。\r\n\n\n//# sourceURL=webpack://preset-js/./ch10/ex01/index.cjs?\n}'
        );

        /***/
      },

    /***/ "./ch10/ex01/sets.cjs":
      /*!****************************!*\
  !*** ./ch10/ex01/sets.cjs ***!
  \****************************/
      /***/ (module) => {
        eval(
          '{/**\r\n * AbstractSet クラスでは、has() 抽象メソッドのみを定義する。\r\n */\r\nclass AbstractSet {\r\n  // このメソッドではエラーをスローする。このようにすることで、\r\n  // サブクラスでこのメソッドを定義しなければならないようにする。\r\n  // eslint-disable-next-line no-unused-vars\r\n  has(x) {\r\n    throw new Error("Abstract method");\r\n  }\r\n}\r\n/**\r\n * NotSet は、AbstractSet の具象サブクラス。\r\n * このセットは、あるほかのセットのメンバーではない値すべてがメンバーとなる。\r\n * このセットは、ほかのセットの状態によって定義されるセットなので、書き込む\r\n * ことはできない。また、メンバーは無限に存在するので、列挙もできない。\r\n * このセットを使ってできることは、メンバーに含まれるかどうかを調べることと、\r\n * 数学的な表記方法を使って文字列に変換することだけ。\r\n */\r\n// eslint-disable-next-line no-unused-vars\r\nclass NotSet extends AbstractSet {\r\n  constructor(set) {\r\n    super();\r\n    this.set = set;\r\n  }\r\n  // 継承した抽象メソッドに対する実装。\r\n  has(x) {\r\n    return !this.set.has(x);\r\n  }\r\n  // また、Object のtoString() メソッドもオーバーライドする。\r\n  toString() {\r\n    return `{ x| x ∉ ${this.set.toString()} }`;\r\n  }\r\n}\r\n/**\r\n * RangeSet は、AbstractSet の具象サブクラス。このセットは、\r\n * from からto まで（from とto も含む）のすべての値がメンバーとなる。\r\n * メンバーは浮動小数点値になりうるので、列挙できない。\r\n * また、意味のある大きさも持たない。\r\n */\r\n// eslint-disable-next-line no-unused-vars\r\nclass RangeSet extends AbstractSet {\r\n  constructor(from, to) {\r\n    super();\r\n    this.from = from;\r\n    this.to = to;\r\n  }\r\n  has(x) {\r\n    return x >= this.from && x <= this.to;\r\n  }\r\n  toString() {\r\n    return `{ x| ${this.from} ≤ x ≤ ${this.to} }`;\r\n  }\r\n}\r\n/*\r\n * AbstractEnumerableSet は、AbstractSet の抽象サブクラス。\r\n * セットの大きさを返す抽象ゲッターメソッドと、抽象イテレータを定義する。\r\n * また、この2 つの抽象メソッドを使って、isEmpty()、toString()、\r\n * equals() メソッドを実装する。サブクラスでは、イテレータと\r\n * 大きさを返すゲッターメソッド、has() メソッドを実装するだけで、\r\n * この3 つのメソッドも使えるようになる。\r\n */\r\n\r\nclass AbstractEnumerableSet extends AbstractSet {\r\n  get size() {\r\n    throw new Error("Abstract method");\r\n  }\r\n  [Symbol.iterator]() {\r\n    throw new Error("Abstract method");\r\n  }\r\n  isEmpty() {\r\n    return this.size === 0;\r\n  }\r\n  toString() {\r\n    return `{${Array.from(this).join(", ")}}`;\r\n  }\r\n  equals(set) {\r\n    // 比較対象のセットがAbstractEnumerableSet でなければ、等しくない。\r\n    if (!(set instanceof AbstractEnumerableSet)) return false;\r\n    // 大きさが同じでなければ、等しくない。\r\n    if (this.size !== set.size) return false;\r\n    // このセットの要素を巡回する。\r\n    for (let element of this) {\r\n      // 要素が比較対象のセットのメンバーでなければ、等しくない。\r\n      if (!set.has(element)) return false;\r\n    }\r\n    // 要素が一致したので、2 つのセットは等しい。\r\n    return true;\r\n  }\r\n}\r\n/*\r\n * SingletonSet は、AbstractEnumerableSet の具象サブクラス。\r\n * シングルトンセットは、メンバーが1 つしかない読み出し専用のセット。\r\n */\r\n// eslint-disable-next-line no-unused-vars\r\nclass SingletonSet extends AbstractEnumerableSet {\r\n  constructor(member) {\r\n    super();\r\n    this.member = member;\r\n  }\r\n  // このサブクラスでは以下の3 つのメソッドを実装する。この3 つのメソッドを使って\r\n  // 動作するisEmpty()、equals()、toString() メソッドの実装は継承する。\r\n  has(x) {\r\n    return x === this.member;\r\n  }\r\n  get size() {\r\n    return 1;\r\n  }\r\n  *[Symbol.iterator]() {\r\n    yield this.member;\r\n  }\r\n}\r\n/*\r\n* AbstractWritableSet は、AbstractEnumerableSet の抽象サブクラス。\r\n* セットから個々のメンバーを挿入したり削除したりするために、\r\n* それぞれinsert() とremove() 抽象メソッドを定義する。\r\n* また、この2 つのメソッドを使って、add()、subtract()、intersect()\r\n* 具象メソッドを実装する。このAPI 群は、JavaScript 標準のSet クラスと\r\n* 異なっているので注意。\r\n\r\n*/\r\nclass AbstractWritableSet extends AbstractEnumerableSet {\r\n  // eslint-disable-next-line no-unused-vars\r\n  insert(x) {\r\n    throw new Error("Abstract method");\r\n  }\r\n  // eslint-disable-next-line no-unused-vars\r\n  remove(x) {\r\n    throw new Error("Abstract method");\r\n  }\r\n  add(set) {\r\n    for (let element of set) {\r\n      this.insert(element);\r\n    }\r\n  }\r\n  subtract(set) {\r\n    for (let element of set) {\r\n      this.remove(element);\r\n    }\r\n  }\r\n  intersect(set) {\r\n    for (let element of this) {\r\n      if (!set.has(element)) {\r\n        this.remove(element);\r\n      }\r\n    }\r\n  }\r\n}\r\n/**\r\n * BitSet はAbstractWritableSet の具象サブクラス。ある最大値よりも\r\n * 小さい非負の整数がメンバーとなるセットに対して、非常に効率的な\r\n * 固定サイズのセットを実装する。\r\n */\r\nclass BitSet extends AbstractWritableSet {\r\n  constructor(max) {\r\n    super();\r\n    this.max = max; // 保存可能な最大整数。\r\n    this.n = 0; // セット中に含まれる整数の数。\r\n    this.numBytes = Math.floor(max / 8) + 1; // 必要となるバイト数。\r\n    this.data = new Uint8Array(this.numBytes); // バイトの配列。\r\n  }\r\n  // このセットに保存可能な値かどうかを確認する内部メソッド。\r\n  _valid(x) {\r\n    return Number.isInteger(x) && x >= 0 && x <= this.max;\r\n  }\r\n  // data 配列のあるバイトのあるビットが立っているかどうかを調べる。\r\n  // true またはfalse を返す。\r\n  _has(byte, bit) {\r\n    return (this.data[byte] & BitSet.bits[bit]) !== 0;\r\n  }\r\n  // 値x がBitSet に含まれるかどうか。\r\n\r\n  has(x) {\r\n    if (this._valid(x)) {\r\n      let byte = Math.floor(x / 8);\r\n      let bit = x % 8;\r\n      return this._has(byte, bit);\r\n    } else {\r\n      return false;\r\n    }\r\n  }\r\n  // 値x をBitSet に挿入する。\r\n  insert(x) {\r\n    if (this._valid(x)) {\r\n      // 値が正当な場合、\r\n      let byte = Math.floor(x / 8); // バイトとビットに変換する。\r\n      let bit = x % 8;\r\n      if (!this._has(byte, bit)) {\r\n        // そのビットがまだ立っていない場合、\r\n        this.data[byte] |= BitSet.bits[bit]; // ビットを立てる。\r\n        this.n++; // セットの大きさをインクリメントする。\r\n      }\r\n    } else {\r\n      throw new TypeError("Invalid set element: " + x);\r\n    }\r\n  }\r\n  remove(x) {\r\n    if (this._valid(x)) {\r\n      // 値が正当な場合、\r\n      let byte = Math.floor(x / 8); // バイトとビットを計算する。\r\n      let bit = x % 8;\r\n      if (this._has(byte, bit)) {\r\n        // そのビットが立っていた場合、\r\n        this.data[byte] &= BitSet.masks[bit]; // ビットを落とす。\r\n        this.n--; // セットの大きさをデクリメントする。\r\n      }\r\n    } else {\r\n      throw new TypeError("Invalid set element: " + x);\r\n    }\r\n  }\r\n  // セットの大きさを返すゲッターメソッド。\r\n  get size() {\r\n    return this.n;\r\n  }\r\n  // 単にビットが立っているかどうかをチェックすることで巡回する。\r\n  // （このコードはあまり賢くなく、大幅に最適化できる。）\r\n  *[Symbol.iterator]() {\r\n    for (let i = 0; i <= this.max; i++) {\r\n      if (this.has(i)) {\r\n        yield i;\r\n      }\r\n    }\r\n  }\r\n}\r\n// has()、insert()、remove() メソッドで使うために事前に計算しておく。\r\nBitSet.bits = new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128]);\r\nBitSet.masks = new Uint8Array([~1, ~2, ~4, ~8, ~16, ~32, ~64, ~128]);\r\n\r\nmodule.exports = { BitSet };\r\n\n\n//# sourceURL=webpack://preset-js/./ch10/ex01/sets.cjs?\n}'
        );

        /***/
      },

    /***/ "./ch10/ex01/stats.cjs":
      /*!*****************************!*\
  !*** ./ch10/ex01/stats.cjs ***!
  \*****************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          "{const sum = (x, y) => x + y;\r\nconst square = (x) => x * x;\r\nexports.mean = (data) => data.reduce(sum) / data.length;\r\nexports.stddev = function (d) {\r\n  let m = exports.mean(d);\r\n  return Math.sqrt(\r\n    d\r\n      .map((x) => x - m)\r\n      .map(square)\r\n      .reduce(sum) /\r\n      (d.length - 1)\r\n  );\r\n};\r\n\n\n//# sourceURL=webpack://preset-js/./ch10/ex01/stats.cjs?\n}"
        );

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module can't be inlined because the eval devtool is used.
  /******/ var __webpack_exports__ = __webpack_require__(
    "./ch10/ex01/index.cjs"
  );
  /******/
  /******/
})();
