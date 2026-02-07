/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ch17/ex05/constants.js"
/*!********************************!*\
  !*** ./ch17/ex05/constants.js ***!
  \********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   COLS: () => (/* binding */ COLS),\n/* harmony export */   RESOLUTION: () => (/* binding */ RESOLUTION),\n/* harmony export */   ROWS: () => (/* binding */ ROWS)\n/* harmony export */ });\n// 50 x 50 の盤面とする\nconst ROWS = 50;\nconst COLS = 50;\n// 1セルのサイズ\nconst RESOLUTION = 10;\n\n\n//# sourceURL=webpack://preset-js/./ch17/ex05/constants.js?\n}");

/***/ },

/***/ "./ch17/ex05/index.js"
/*!****************************!*\
  !*** ./ch17/ex05/index.js ***!
  \****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _renderGrid_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderGrid.js */ \"./ch17/ex05/renderGrid.js\");\n/* harmony import */ var _updateGrid_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./updateGrid.js */ \"./ch17/ex05/updateGrid.js\");\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.js */ \"./ch17/ex05/constants.js\");\n\n\n\n\nconst canvas = document.querySelector('#screen');\nconst startButton = document.querySelector('#start');\nconst pauseButton = document.querySelector('#pause');\n\ncanvas.width = _constants_js__WEBPACK_IMPORTED_MODULE_2__.ROWS * _constants_js__WEBPACK_IMPORTED_MODULE_2__.RESOLUTION;\ncanvas.height = _constants_js__WEBPACK_IMPORTED_MODULE_2__.COLS * _constants_js__WEBPACK_IMPORTED_MODULE_2__.RESOLUTION;\n\n// https://developer.mozilla.org/ja/docs/Web/API/Window/requestAnimationFrame が返す ID\nlet animationId = null;\n\n// NOTE: download from https://soundeffect-lab.info/sound/button/mp3/decision1.mp3\nconst sound = new Audio('/ch17/ex05/decision1.mp3');\n\n// ライフゲームのセル (true or false) をランダムに初期化する\nlet grid = new Array(_constants_js__WEBPACK_IMPORTED_MODULE_2__.ROWS)\n  .fill(null)\n  .map(() =>\n    new Array(_constants_js__WEBPACK_IMPORTED_MODULE_2__.COLS).fill(null).map(() => !!Math.floor(Math.random() * 2)),\n  );\n\n// canvas がクリックされたときの処理 (セルの値を反転する)\ncanvas.addEventListener('click', function (evt) {\n  const rect = canvas.getBoundingClientRect();\n  const pos = { x: evt.clientX - rect.left, y: evt.clientY - rect.top };\n\n  const row = Math.floor(pos.y / _constants_js__WEBPACK_IMPORTED_MODULE_2__.RESOLUTION);\n  const col = Math.floor(pos.x / _constants_js__WEBPACK_IMPORTED_MODULE_2__.RESOLUTION);\n  grid[row][col] = !grid[row][col];\n  sound.cloneNode().play();\n  (0,_renderGrid_js__WEBPACK_IMPORTED_MODULE_0__.renderGrid)(canvas, grid);\n});\n\n// requestAnimationFrame によって一定間隔で更新・描画を行う\n// TODO: リフレッシュレートの高い画面では速く実行されてしまうため、以下を参考に更新頻度が常に一定となるようにしなさい\n// https://developer.mozilla.org/ja/docs/Web/API/Window/requestAnimationFrame\n\nlet lastTime = 0; // 前回の更新時刻\nconst interval = 10; // 1ターンの間隔\n\nfunction update(timestamp) {\n  // 初回呼び出しなら lastTime を初期化\n  if (!lastTime) lastTime = timestamp;\n\n  const difference = timestamp - lastTime;\n\n  // 一定時間経過したら更新処理を行う\n  if (difference >= interval) {\n    grid = (0,_updateGrid_js__WEBPACK_IMPORTED_MODULE_1__.updateGrid)(grid);\n    (0,_renderGrid_js__WEBPACK_IMPORTED_MODULE_0__.renderGrid)(canvas, grid);\n    lastTime = timestamp;\n  }\n\n  animationId = requestAnimationFrame(update);\n}\n\nstartButton.addEventListener('click', () => {\n  // 既にアニメーションが動いている場合は何もしない\n  if (animationId) {\n    return;\n  }\n  update();\n});\n\npauseButton.addEventListener('click', () => {\n  // アニメーションが停止している場合は何もしない\n  if (!animationId) {\n    return;\n  }\n  cancelAnimationFrame(animationId);\n  animationId = null;\n});\n\n(0,_renderGrid_js__WEBPACK_IMPORTED_MODULE_0__.renderGrid)(canvas, grid);\n\n// おまけ\n// クリックしたら盤面をグライダー銃にする\nconst gliderGunButton = document.querySelector('#gliderGun');\ngliderGunButton.addEventListener('click', () => {\n  const gunPattern = [\n    [1, 5],\n    [1, 6],\n    [2, 5],\n    [2, 6],\n    [11, 5],\n    [11, 6],\n    [11, 7],\n    [12, 4],\n    [12, 8],\n    [13, 3],\n    [14, 3],\n    [15, 6],\n    [16, 4],\n    [17, 5],\n    [17, 6],\n    [17, 7],\n    [18, 6],\n    [16, 8],\n    [13, 9],\n    [14, 9],\n    [21, 3],\n    [22, 3],\n    [21, 4],\n    [22, 4],\n    [21, 5],\n    [22, 5],\n    [23, 2],\n    [23, 6],\n    [25, 1],\n    [25, 2],\n    [25, 6],\n    [25, 7],\n    [35, 3],\n    [36, 3],\n    [35, 4],\n    [36, 4],\n  ];\n\n  // グリッドを全て白紙にする\n  const newGrid = new Array(_constants_js__WEBPACK_IMPORTED_MODULE_2__.ROWS)\n    .fill(null)\n    .map(() => new Array(_constants_js__WEBPACK_IMPORTED_MODULE_2__.COLS).fill(false));\n\n  // グライダー銃のパターンをセットする\n  gunPattern.forEach(([col, row]) => {\n    newGrid[col][row] = true; // 軸取り間違えた\n  });\n\n  grid = newGrid;\n  (0,_renderGrid_js__WEBPACK_IMPORTED_MODULE_0__.renderGrid)(canvas, grid);\n});\n\n\n//# sourceURL=webpack://preset-js/./ch17/ex05/index.js?\n}");

/***/ },

/***/ "./ch17/ex05/renderGrid.js"
/*!*********************************!*\
  !*** ./ch17/ex05/renderGrid.js ***!
  \*********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   renderGrid: () => (/* binding */ renderGrid)\n/* harmony export */ });\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ \"./ch17/ex05/constants.js\");\n\n\n// grid を canvas に描画する\nfunction renderGrid(canvas, grid) {\n  const ctx = canvas.getContext('2d');\n  for (let row = 0; row < _constants_js__WEBPACK_IMPORTED_MODULE_0__.ROWS; row++) {\n    for (let col = 0; col < _constants_js__WEBPACK_IMPORTED_MODULE_0__.COLS; col++) {\n      const cell = grid[row][col];\n      ctx.beginPath();\n      ctx.rect(col * _constants_js__WEBPACK_IMPORTED_MODULE_0__.RESOLUTION, row * _constants_js__WEBPACK_IMPORTED_MODULE_0__.RESOLUTION, _constants_js__WEBPACK_IMPORTED_MODULE_0__.RESOLUTION, _constants_js__WEBPACK_IMPORTED_MODULE_0__.RESOLUTION);\n      ctx.fillStyle = cell ? 'black' : 'white';\n      ctx.fill();\n      ctx.stroke();\n    }\n  }\n}\n\n\n//# sourceURL=webpack://preset-js/./ch17/ex05/renderGrid.js?\n}");

/***/ },

/***/ "./ch17/ex05/updateGrid.js"
/*!*********************************!*\
  !*** ./ch17/ex05/updateGrid.js ***!
  \*********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   updateGrid: () => (/* binding */ updateGrid)\n/* harmony export */ });\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ \"./ch17/ex05/constants.js\");\n\n\n// Life Game のルールに従ってセルを更新する\nfunction updateGrid(grid) {\n  // 新しいグリッドを作成\n  const nextGrid = grid.map((arr) => [...arr]);\n\n  for (let row = 0; row < _constants_js__WEBPACK_IMPORTED_MODULE_0__.ROWS; row++) {\n    for (let col = 0; col < _constants_js__WEBPACK_IMPORTED_MODULE_0__.COLS; col++) {\n      // 周囲のセルの生存数を数えて nextGrid[row][col] に true or false を設定する\n      let liveCellsNeighbor = 0;\n      for (let i = -1; i <= 1; i++) {\n        for (let j = -1; j <= 1; j++) {\n          // 自分自身は除外\n          if (i === 0 && j === 0) continue;\n\n          // 盤面の範囲外は無視\n          const newRow = row + i;\n          const newCol = col + j;\n          if (newRow < 0 || newRow >= _constants_js__WEBPACK_IMPORTED_MODULE_0__.ROWS || newCol < 0 || newCol >= _constants_js__WEBPACK_IMPORTED_MODULE_0__.COLS) {\n            continue;\n          }\n\n          if (grid[newRow][newCol]) {\n            liveCellsNeighbor++;\n          }\n        }\n      }\n      // ライフゲームのルール\n      // 生きているセルに対して\n      if (grid[row][col]) {\n        // 周囲に生きているセルが2つか3つある場合には生存する。それ以外は過疎または過密で死亡する\n        nextGrid[row][col] = liveCellsNeighbor === 2 || liveCellsNeighbor === 3;\n      } else {\n        // 死んでいるセルに対して\n        // 周囲に生きているセルが3つある場合には復活する\n        nextGrid[row][col] = liveCellsNeighbor === 3;\n      }\n    }\n  }\n  return nextGrid;\n}\n\n\n//# sourceURL=webpack://preset-js/./ch17/ex05/updateGrid.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./ch17/ex05/index.js");
/******/ 	
/******/ })()
;