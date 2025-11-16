(function updateClock() {
  // SVG 時計の画像を更新して現在時刻を表示する。
  const now = new Date(); // 現在時刻。
  const sec = now.getSeconds(); // 秒。
  const min = now.getMinutes() + sec / 60; // 小数部を持つ分。
  const hour = (now.getHours() % 12) + min / 60; // 小数部を持つ時。
  const minangle = min * 6; // 1 分あたり6 度。
  const hourangle = hour * 30; // 1 時間あたり30 度。
  // 時計の針のSVG 要素を取得する。
  const minhand = document.querySelector("#clock .minutehand");
  const hourhand = document.querySelector("#clock .hourhand");
  // SVG 属性を設定して、時計盤の中で回転する。
  minhand.setAttribute("transform", `rotate(${minangle},50,50)`);
  hourhand.setAttribute("transform", `rotate(${hourangle},50,50)`);
  // 10 秒後にこの関数を再度実行する。
  setTimeout(updateClock, 10000);
})(); // ここで関数を即座に実行していることに注意。

// 秒針を追加
(function addSecondHand() {
  const sechand = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  sechand.setAttribute("x1", "50");
  sechand.setAttribute("y1", "50");
  sechand.setAttribute("x2", "50");
  sechand.setAttribute("y2", "20");
  sechand.setAttribute("class", "secondhand");
  document.querySelector("#clock").appendChild(sechand);
})();

// 秒針を更新する。
(function updateSecondHand() {
  // 1秒毎の更新だと、関数の実行タイミングと実際の秒の変化がずれる。
  // そこで、0.1秒ごとに関数を実行し、実行時の時刻をチェックして、秒が変わったら更新する。
  let lastSec = null;
  const update = () => {
    const now = new Date();
    const sec = now.getSeconds();
    if (sec !== lastSec) {
      const secangle = sec * 6; // 1 秒あたり6 度。
      const sechand = document.querySelector("#clock .secondhand");
      sechand.setAttribute("transform", `rotate(${secangle},50,50)`);
      lastSec = sec;
    }
    setTimeout(update, 100);
  };
  update();
})();

// 比較用にDateの値を時計の下に表示する。
(function displayDate() {
  const dateDisplay = document.createElement("div");
  document.body.appendChild(dateDisplay);
  setInterval(() => {
    const now = new Date();
    dateDisplay.textContent = now.toLocaleTimeString();
  }, 10);
})();
