import {
  log,
  wait1,
  wait2,
  wait3,
  logA,
  logB,
  logC,
  errX,
  errY,
} from "../wait.js";

// eslint-disable-next-line no-unused-vars
async function h1() {
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

// h1();

// eslint-disable-next-line no-unused-vars
function h2() {
  // NOTE: h3 との比較用
  new Promise(() => {
    errX();
  }).catch((e) => log(e.message));
}

// h2();

// eslint-disable-next-line no-unused-vars
function h3() {
  // NOTE: new Promise の引数が async function の場合、例外はどう扱われるだろう
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async () => {
    errX();
  }).catch((e) => log(e.message));
}

// h3();

// eslint-disable-next-line no-unused-vars
async function h4() {
  // NOTE: 2つの例外は両方 catch できるか？
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

h4();
