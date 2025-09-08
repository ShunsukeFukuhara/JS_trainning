import {
  wait,
  wait1,
  wait2,
  wait3,
  log,
  logA,
  logB,
  logC,
  errX,
  errY,
} from "../wait.js";

// eslint-disable-next-line no-unused-vars
function f1() {
  wait3()
    .then(logA)
    .then(() => wait2().then(logB))
    .then(() => wait1().then(logC));
}

// eslint-disable-next-line no-unused-vars
function f2() {
  wait3()
    .then(logA)
    .then(() => {
      wait2().then(logB);
    })
    .then(() => wait1().then(logC));
}

// eslint-disable-next-line no-unused-vars
function f3() {
  // NOTE: then のコールバック内の例外は try/catch でキャッチできるだろうか
  try {
    wait(0).then(logA).then(errX);
  } catch (e) {
    logB();
  } finally {
    logC();
  }
}

// f3();

// eslint-disable-next-line no-unused-vars
function f4() {
  // NOTE: f5 との比較用
  wait2()
    .then(() => {
      logA();
      return 40;
    })
    // eslint-disable-next-line no-unused-vars
    .then((value) =>
      wait(1000).then(() => {
        logB();
        return 100;
      })
    )
    .then((v) => log(v));
}

// f4();

// eslint-disable-next-line no-unused-vars
function f5() {
  // NOTE: 2つ目の then の引数が関数でなく Promise になっている (典型的なミス)
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

// f5();

// eslint-disable-next-line no-unused-vars
function f6() {
  // NOTE: 1つの Promise に対し then を2回呼び出すとどうなるか

  const p = wait1().then(logA);
  p.then(() => wait1()).then(logB);
  p.then(() => wait2()).then(logC);
}

// f6();

// eslint-disable-next-line no-unused-vars
function f7() {
  // NOTE: 2つ目の wait の引数が実行される差には p は解決済み
  // (= 解決済みの Promise の then を呼び出すとどうなるか)
  const p = wait1().then(logA);
  wait2()
    .then(() => {
      return p.then(logB);
    })
    .then(logC);
}

// f7();

// eslint-disable-next-line no-unused-vars
function f8() {
  // NOTE: f9, f10 との比較用
  wait1()
    .then(errX)
    .then(errY)
    .catch((e) => log(e.message))
    .finally(logA);
}

// f8();

// eslint-disable-next-line no-unused-vars
function f9() {
  // NOTE: f10 との比較用
  wait1()
    .then(() => 42)
    .then(errY)
    .catch((e) => log(e.message))
    .finally(logA);
}

// f9();

// eslint-disable-next-line no-unused-vars
function f10() {
  // NOTE: then(r, c) と then(r).catch(c) は等しいか？
  wait1()
    .then(() => 42)
    .then(errY, (e) => log(e.message))
    .finally(logA);
}

// f10();

// eslint-disable-next-line no-unused-vars
function f11() {
  // f12 との比較用: new Promise 内の throw は .catch でキャッチできるか？
  // eslint-disable-next-line no-unused-vars
  new Promise((resolve, reject) => {
    errX();
  }).catch((e) => log(e.message));
}

// f11();

// eslint-disable-next-line no-unused-vars
function f12() {
  // new Promise 内だがコールバック関数で throw した場合は？
  // eslint-disable-next-line no-unused-vars
  new Promise((resolve, reject) => {
    setTimeout(() => errX(), 0);
  }).catch((e) => log(e.message));
}

f12();
