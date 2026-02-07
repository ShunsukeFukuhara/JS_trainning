/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ch17/ex05/constants.js"
/*!********************************!*\
  !*** ./ch17/ex05/constants.js ***!
  \********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COLS: () => (/* binding */ COLS),
/* harmony export */   RESOLUTION: () => (/* binding */ RESOLUTION),
/* harmony export */   ROWS: () => (/* binding */ ROWS)
/* harmony export */ });
// 50 x 50 の盤面とする
const ROWS = 50;
const COLS = 50;
// 1セルのサイズ
const RESOLUTION = 10;


/***/ },

/***/ "./ch17/ex05/renderGrid.js"
/*!*********************************!*\
  !*** ./ch17/ex05/renderGrid.js ***!
  \*********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderGrid: () => (/* binding */ renderGrid)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./ch17/ex05/constants.js");


// grid を canvas に描画する
function renderGrid(canvas, grid) {
  const ctx = canvas.getContext('2d');
  for (let row = 0; row < _constants_js__WEBPACK_IMPORTED_MODULE_0__.ROWS; row++) {
    for (let col = 0; col < _constants_js__WEBPACK_IMPORTED_MODULE_0__.COLS; col++) {
      const cell = grid[row][col];
      ctx.beginPath();
      ctx.rect(col * _constants_js__WEBPACK_IMPORTED_MODULE_0__.RESOLUTION, row * _constants_js__WEBPACK_IMPORTED_MODULE_0__.RESOLUTION, _constants_js__WEBPACK_IMPORTED_MODULE_0__.RESOLUTION, _constants_js__WEBPACK_IMPORTED_MODULE_0__.RESOLUTION);
      ctx.fillStyle = cell ? 'black' : 'white';
      ctx.fill();
      ctx.stroke();
    }
  }
}


/***/ },

/***/ "./ch17/ex05/updateGrid.js"
/*!*********************************!*\
  !*** ./ch17/ex05/updateGrid.js ***!
  \*********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateGrid: () => (/* binding */ updateGrid)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./ch17/ex05/constants.js");


// Life Game のルールに従ってセルを更新する
function updateGrid(grid) {
  // 新しいグリッドを作成
  const nextGrid = grid.map((arr) => [...arr]);

  for (let row = 0; row < _constants_js__WEBPACK_IMPORTED_MODULE_0__.ROWS; row++) {
    for (let col = 0; col < _constants_js__WEBPACK_IMPORTED_MODULE_0__.COLS; col++) {
      // 周囲のセルの生存数を数えて nextGrid[row][col] に true or false を設定する
      let liveCellsNeighbor = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // 自分自身は除外
          if (i === 0 && j === 0) continue;

          // 盤面の範囲外は無視
          const newRow = row + i;
          const newCol = col + j;
          if (newRow < 0 || newRow >= _constants_js__WEBPACK_IMPORTED_MODULE_0__.ROWS || newCol < 0 || newCol >= _constants_js__WEBPACK_IMPORTED_MODULE_0__.COLS) {
            continue;
          }

          if (grid[newRow][newCol]) {
            liveCellsNeighbor++;
          }
        }
      }
      // ライフゲームのルール
      // 生きているセルに対して
      if (grid[row][col]) {
        // 周囲に生きているセルが2つか3つある場合には生存する。それ以外は過疎または過密で死亡する
        nextGrid[row][col] = liveCellsNeighbor === 2 || liveCellsNeighbor === 3;
      } else {
        // 死んでいるセルに対して
        // 周囲に生きているセルが3つある場合には復活する
        nextGrid[row][col] = liveCellsNeighbor === 3;
      }
    }
  }
  return nextGrid;
}


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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./ch17/ex05/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _renderGrid_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderGrid.js */ "./ch17/ex05/renderGrid.js");
/* harmony import */ var _updateGrid_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./updateGrid.js */ "./ch17/ex05/updateGrid.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.js */ "./ch17/ex05/constants.js");




const canvas = document.querySelector('#screen');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');

canvas.width = _constants_js__WEBPACK_IMPORTED_MODULE_2__.ROWS * _constants_js__WEBPACK_IMPORTED_MODULE_2__.RESOLUTION;
canvas.height = _constants_js__WEBPACK_IMPORTED_MODULE_2__.COLS * _constants_js__WEBPACK_IMPORTED_MODULE_2__.RESOLUTION;

// https://developer.mozilla.org/ja/docs/Web/API/Window/requestAnimationFrame が返す ID
let animationId = null;

// NOTE: download from https://soundeffect-lab.info/sound/button/mp3/decision1.mp3
const sound = new Audio('/ch17/ex05/decision1.mp3');

// ライフゲームのセル (true or false) をランダムに初期化する
let grid = new Array(_constants_js__WEBPACK_IMPORTED_MODULE_2__.ROWS)
  .fill(null)
  .map(() =>
    new Array(_constants_js__WEBPACK_IMPORTED_MODULE_2__.COLS).fill(null).map(() => !!Math.floor(Math.random() * 2)),
  );

// canvas がクリックされたときの処理 (セルの値を反転する)
canvas.addEventListener('click', function (evt) {
  const rect = canvas.getBoundingClientRect();
  const pos = { x: evt.clientX - rect.left, y: evt.clientY - rect.top };

  const row = Math.floor(pos.y / _constants_js__WEBPACK_IMPORTED_MODULE_2__.RESOLUTION);
  const col = Math.floor(pos.x / _constants_js__WEBPACK_IMPORTED_MODULE_2__.RESOLUTION);
  grid[row][col] = !grid[row][col];
  sound.cloneNode().play();
  (0,_renderGrid_js__WEBPACK_IMPORTED_MODULE_0__.renderGrid)(canvas, grid);
});

// requestAnimationFrame によって一定間隔で更新・描画を行う
// TODO: リフレッシュレートの高い画面では速く実行されてしまうため、以下を参考に更新頻度が常に一定となるようにしなさい
// https://developer.mozilla.org/ja/docs/Web/API/Window/requestAnimationFrame

let lastTime = 0; // 前回の更新時刻
const interval = 10; // 1ターンの間隔

function update(timestamp) {
  // 初回呼び出しなら lastTime を初期化
  if (!lastTime) lastTime = timestamp;

  const difference = timestamp - lastTime;

  // 一定時間経過したら更新処理を行う
  if (difference >= interval) {
    grid = (0,_updateGrid_js__WEBPACK_IMPORTED_MODULE_1__.updateGrid)(grid);
    (0,_renderGrid_js__WEBPACK_IMPORTED_MODULE_0__.renderGrid)(canvas, grid);
    lastTime = timestamp;
  }

  animationId = requestAnimationFrame(update);
}

startButton.addEventListener('click', () => {
  // 既にアニメーションが動いている場合は何もしない
  if (animationId) {
    return;
  }
  update();
});

pauseButton.addEventListener('click', () => {
  // アニメーションが停止している場合は何もしない
  if (!animationId) {
    return;
  }
  cancelAnimationFrame(animationId);
  animationId = null;
});

(0,_renderGrid_js__WEBPACK_IMPORTED_MODULE_0__.renderGrid)(canvas, grid);

// おまけ
// クリックしたら盤面をグライダー銃にする
const gliderGunButton = document.querySelector('#gliderGun');
gliderGunButton.addEventListener('click', () => {
  const gunPattern = [
    [1, 5],
    [1, 6],
    [2, 5],
    [2, 6],
    [11, 5],
    [11, 6],
    [11, 7],
    [12, 4],
    [12, 8],
    [13, 3],
    [14, 3],
    [15, 6],
    [16, 4],
    [17, 5],
    [17, 6],
    [17, 7],
    [18, 6],
    [16, 8],
    [13, 9],
    [14, 9],
    [21, 3],
    [22, 3],
    [21, 4],
    [22, 4],
    [21, 5],
    [22, 5],
    [23, 2],
    [23, 6],
    [25, 1],
    [25, 2],
    [25, 6],
    [25, 7],
    [35, 3],
    [36, 3],
    [35, 4],
    [36, 4],
  ];

  // グリッドを全て白紙にする
  const newGrid = new Array(_constants_js__WEBPACK_IMPORTED_MODULE_2__.ROWS)
    .fill(null)
    .map(() => new Array(_constants_js__WEBPACK_IMPORTED_MODULE_2__.COLS).fill(false));

  // グライダー銃のパターンをセットする
  gunPattern.forEach(([col, row]) => {
    newGrid[col][row] = true; // 軸取り間違えた
  });

  grid = newGrid;
  (0,_renderGrid_js__WEBPACK_IMPORTED_MODULE_0__.renderGrid)(canvas, grid);
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map