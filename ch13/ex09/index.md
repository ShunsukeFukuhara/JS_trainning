## 問題

以下の各関数を実行すると何が出力されるか予想し実際に確認しなさい。
またその理由を 2、3 行のテキスト、図のいずれかまたは両方で説明しなさい。テキスト・図は問題 13.2 を参考にしなさい。
i4 に関しては、コードを修正して v の最終結果が 10 となるコードを実装しなさい。

## 解答

```javascript
async function i1() {
  // NOTE: any で1つ Promise が解決された時に他の Promise はどうなるだろうか
  // 回答: (1s待ち)- 42 -(2s待ち)- 100
  // 説明: Promise.any は最初に解決した Promise の値を返す。1秒後に最初の Promise が解決されるため、42 が v に代入される。
  // その後、wait2()を待っている間に、2番目の Promise が解決され、v に 100 が代入され、2番目の log(v) では 100 が出力される。
  let v = 0;

  v = await Promise.any([
    wait1().then(() => 42),
    wait2()
      .then(() => (v = 100))
      .then(() => 0),
  ]);

  log(v);
  await wait2();
  log(v);
}

async function i2() {
  // 回答: (1s待ち)- C -(1s待ち)- B -(1s待ち)- A - [ 'A', 'B', 'C' ]
  // 説明: Promise.allですべてのPromiseが実行され、それぞれの非同期処理が完了した順に logA, logB, logC が呼ばれる。
  // Promise.allが解決したら各 Promise の結果が配列として返され、引数の配列の順で['A', 'B', 'C'] が出力される。
  const v = await Promise.all([
    wait3().then(() => {
      logA();
      return "A";
    }),
    wait2().then(() => {
      logB();
      return "B";
    }),
    wait1().then(() => {
      logC();
      return "C";
    }),
  ]);
  log(v);
}

async function i3() {
  // NOTE: all で引数の1つが失敗すると他の Promise はどうなるだろうか
  // (1s待ち)- Y - 42 -(1s待ち)- B -(2s待ち)- 0
  // 説明: Promise.all は引数のいずれかの Promise が拒否されると即座に拒否される。1秒後にwait1()内でerrY()でエラーが発生し、catch ブロックに制御が移る。
  // catch ブロック内ではvはまだ42のままであり、Y -> 42が順次出力される。
  // その後、wait3()を待っている間に、wait2()内でlogB()が呼ばれ、Bが出力され、更にwait3()が解決しvの値が0に更新され、最後のlog()で0が出力される。
  let v = 42;
  try {
    await Promise.all([
      wait3().then(() => {
        v = 0;
        errX();
      }),
      wait2().then(() => {
        logB();
        return "B";
      }),
      wait1().then(() => {
        errY();
      }),
    ]);
  } catch (e) {
    log(e.message);
    log(v);
    await wait3();
    log(v);
  }
}

async function i4() {
  // NOTE: 複数の非同期処理が1つの変数に対し書き込みを行う場合、読み込みと書き込みの間に await が入るとどうなるだろうか
  // 回答: (11s待ち)- 5
  // 説明: 待ち時間はp1の最初のwait1()+ループ内の5回のwait2()の合計で11秒となる。
  // その間、p1とp2は1sずれで動作するが、ループ内では次のnextの値を予約してからawaitで待機しているため、もう一方の関数の更新によって次のvの値が多重に更新されることはないため、最後のvは5となる。
  let v = 0;

  const p1 = async () => {
    await wait1();
    for (let i = 0; i < 5; i++) {
      const next = v + 1;
      await wait2();
      v = next;
    }
  };

  const p2 = async () => {
    for (let i = 0; i < 5; i++) {
      const next = v + 1;
      await wait2();
      v = next;
    }
  };

  await Promise.all([p1(), p2()]);
  log(v);
}
```

i4()の修正コード
nextによる値の予約をせずその場で更新する

```javascript
async function i4() {
  let v = 0;

  const p1 = async () => {
    await wait1();
    for (let i = 0; i < 5; i++) {
      await wait2();
      v++;
    }
  };

  const p2 = async () => {
    for (let i = 0; i < 5; i++) {
      await wait2();
      v++;
    }
  };

  await Promise.all([p1(), p2()]);
  log(v);
}
```
