## 問題

以下の各関数を実行すると何が出力されるか予想し実際に確認しなさい。
またその理由を 2、3 行のテキスト、図のいずれかまたは両方で説明しなさい。

## 解答

```javascript
async function h1() {
  // 回答: (3秒待ち)- A -(2秒待ち)- B -(1秒待ち)- C
  // 説明: await は Promise が解決されるまで待機するため、順番に処理が実行される
  // エラーが発生しないので、catchは実行されない
  try {
    await wait3();
    logA();
    await wait2();
    logB();
    await wait1();
    logC();
  } catch (e) {
    log(e.message);
  }
}

function h2() {
  // NOTE: h3 との比較用
  // 回答: X (即時)
  // 説明: errX() の例外は Promise内で発生する。catch で捕捉され、log出力される
  new Promise(() => {
    errX();
  }).catch((e) => log(e.message));
}

function h3() {
  // NOTE: new Promise の引数が async function の場合、例外はどう扱われるだろう
  // 回答: エラー発生
  // 説明: Promiseの第一引数がaync functionになっているので、この関数の返り値はPromiseに拾われない。
  // そのため、内部で発生したエラーがPromiseでcatchされずに、グローバルの未処理例外として扱われる
  new Promise(async () => {
    errX();
  }).catch((e) => log(e.message));
}

async function h4() {
  // NOTE: 2つの例外は両方 catch できるか？
  // 回答: Yのエラー発生
  // 説明: await p1を待っている間に、非同期でp2のerrY()が実行される。この時p2のエラーはcatchされずにグローバルの未処理例外として扱われる
  try {
    const p1 = wait2().then(() => {
      errX();
    });
    const p2 = wait1().then(() => {
      errY();
    });
    await p1;
    await p2;
  } catch (e) {
    log(e.message);
  }
}
```
