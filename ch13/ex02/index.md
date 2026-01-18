## 問題

以下の各関数 f3 から f12 までを実行すると何が出力されるか予想し実際に確認しなさい。
またその理由を 2、3 行のテキスト、図のいずれかまたは両方で説明しなさい。テキスト・図は f1 の解答例を参考にしなさい

## 回答

```javascript
function f3() {
  // NOTE: then のコールバック内の例外は try/catch でキャッチできるだろうか
  // 回答: C->A->ErrorX。この順番で即時に出力される。
  // 説明: 同期処理ではwaitの予約->Cと実行され、その後thenチェーンでA-ErrorXと実行される。
  try {
    wait(0).then(logA).then(errX);
  } catch (e) {
    logB();
  } finally {
    logC();
  }
}

function f4() {
  // NOTE: f5 との比較用
  // 回答: (2s待ち)- A -(1s待ち)- B - 100
  // 説明: wait2で2秒待ち、その後Aを出力しthenチェーンで40を返す。
  // 次のチェーンではvalueが40であるが使われず、wait(1000)で1秒待ってから100を返す。
  // その後のthenでv=100が出力される。
  wait2()
    .then(() => {
      logA();
      return 40;
    })
    .then((value) =>
      wait(1000).then(() => {
        logB();
        return 100;
      })
    )
    .then((v) => log(v));
}

function f5() {
  // NOTE: 2つ目の then の引数が関数でなく Promise になっている (典型的なミス)
  // 回答: (1s待ち)- B -(1s待ち)- A - 40
  // 説明: 2個目のthenではPromiseを返す関数ではなく、Promise自体が入ってしまっている。そのためPromiseによって即時にwait1が予約される。
  // そのため1秒後にBが出力され、次のthenでAが出力され、3つ目のthenでは40が返される。
  wait2()
    .then(() => {
      logA();
      return 40;
    })
    .then(
      wait1().then(() => {
        logB();
        return 100;
      })
    )
    .then((v) => log(v));
}

function f6() {
  // NOTE: 1つの Promise に対し then を2回呼び出すとどうなるか
  // 回答: A - (1s待ち)- B -(1s待ち)- C
  // 説明: wait1().then(logA)を実行した時点で、thenによって1秒後のlogB、2秒後のlogCが予約され、それぞれのタイミングで実行される。
  const p = wait1().then(logA);
  p.then(() => wait1()).then(logB);
  p.then(() => wait2()).then(logC);
}

function f7() {
  // NOTE: 2つ目の wait の引数が実行される差には p は解決済み
  // (= 解決済みの Promise の then を呼び出すとどうなるか)
  // 回答: (1s待ち)- A -(1s待ち)- B - C
  // 説明: wait2で2秒待っている間にpが解決済みの状態になっている。その後1秒待ってもpはすぐに解決されてlogBが実行される。
  const p = wait1().then(logA);
  wait2()
    .then(() => {
      return p.then(logB);
    })
    .then(logC);
}

function f8() {
  // NOTE: f9, f10 との比較用
  // 回答: (1s待ち)- X - A
  // 説明: errXで例外が発生し、catchでキャッチされてXが出力される。
  // その後finallyでAが出力される。
  wait1()
    .then(errX)
    .then(errY)
    .catch((e) => log(e.message))
    .finally(logA);
}

function f9() {
  // NOTE: f10 との比較用
  // 回答: (1s待ち)- Y - A
  // 説明: 1個目のthenで42が返され、2個目のthenでerrYが実行されて例外が発生し、catchでキャッチされてYが出力され、finallyでAが出力される。
  // その後finallyでAが出力される。
  wait1()
    .then(() => 42)
    .then(errY)
    .catch((e) => log(e.message))
    .finally(logA);
}

function f10() {
  // NOTE: then(r, c) と then(r).catch(c) は等しいか？
  // 回答: (1s待ち)- A - 例外発生
  // 説明: 1個目のthenで42が返される(解決)。
  // 2個目のthenでは1個目のthenが解決されたため、第一引数のerrYが実行されて例外が発生する。
  // 第二引数のcatchは実行されず、finallyでAが出力される。
  // その後promiseチェーンが終了し、例外はキャッチされない。
  wait1()
    .then(() => 42)
    .then(errY, (e) => log(e.message))
    .finally(logA);
}

function f11() {
  // f12 との比較用: new Promise 内の throw は .catch でキャッチできるか？
  // 回答: X
  // 説明: new Promiseのコールバック関数内でthrowされた例外は、失敗のPromiseとして扱われ、その後の.catchでキャッチされる。
  new Promise((resolve, reject) => {
    errX();
  }).catch((e) => log(e.message));
}

function f12() {
  // new Promise 内だがコールバック関数で throw した場合は？
  // 回答: 例外発生
  // 説明: setTimeout()はそれ自体がPromiseなので、errX()を実行予約したままコードが通過し、new Promise内ではvoidの解決済みPromiseが返される。
  // そのため.catchでキャッチされず、その後予約したerrX()が実行されて例外が発生する。
  new Promise((resolve, reject) => {
    setTimeout(() => errX(), 0);
  }).catch((e) => log(e.message));
}
```
