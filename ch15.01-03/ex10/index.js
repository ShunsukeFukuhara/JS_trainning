// div要素の初期のバックグラウンドが透明になっているので、白色に設定する
document.getElementById("editor-front").style.backgroundColor = "white";

// div 要素をクリックすると input 要素が focus される
document.getElementById("editor-front").addEventListener("click", () => {
  document.getElementById("editor-back").focus();
});

// div 要素は通常白色で input 要素に focus されると灰色 (silver)になる
document.getElementById("editor-back").addEventListener("focus", () => {
  document.getElementById("editor-front").style.backgroundColor = "silver";
});

// input 要素から focus が外れると白色に戻る
document.getElementById("editor-back").addEventListener("blur", () => {
  document.getElementById("editor-front").style.backgroundColor = "white";
});

// input 要素に入力された text は div 要素にも表示される
document.getElementById("editor-back").addEventListener("input", (e) => {
  document.getElementById("editor-front").textContent = e.target.value;
});
