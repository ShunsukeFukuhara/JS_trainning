import { counterIter, counterGen } from "./counters.js";

// 明示的にイテレータプロトコルの next() を呼び出す
// eslint-disable-next-line no-unused-vars
const textNext = () => {
  console.log("testIter");
  const iter = counterIter(2);
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());

  console.log("testGen");
  const gen = counterGen(2);
  console.log(gen.next());
  console.log(gen.next());
  console.log(gen.next());
};

// textNext();

// 明示的にイテレータプロトコルの return() を呼び出す
// eslint-disable-next-line no-unused-vars
const testReturn = () => {
  console.log("testIter");
  const iter = counterIter(5);
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.return("終了"));
  console.log(iter.next());

  console.log("testGen");
  const gen = counterGen(5);
  console.log(gen.next());
  console.log(gen.next());
  console.log(gen.return("終了"));
  console.log(gen.next());
};

// testReturn();

// 明示的にイテレータプロトコルの throw() を呼び出す
// eslint-disable-next-line no-unused-vars
const testThrow = () => {
  console.log("testIter");
  try {
    const iter = counterIter(5);
    console.log(iter.next());
    console.log(iter.next());
    try {
      console.log(iter.throw(new Error("エラー発生")));
    } catch (e) {
      console.log("catch:", e.message);
    }
    console.log(iter.next());
  } catch (e) {
    //
  }

  console.log("testGen");
  try {
    const gen = counterGen(5);
    console.log(gen.next());
    console.log(gen.next());
    try {
      console.log(gen.throw(new Error("エラー発生")));
    } catch (e) {
      console.log("catch:", e.message);
    }
    console.log(gen.next());
  } catch (e) {
    //
  }
};

// testThrow();

// for-of ループを実行
// eslint-disable-next-line no-unused-vars
const testForOf = () => {
  console.log("testIter");
  for (const v of counterIter(2)) {
    console.log(v);
  }

  console.log("testGen");
  for (const v of counterGen(2)) {
    console.log(v);
  }
};

// testForOf();

// for-of ループを実行途中で break
// eslint-disable-next-line no-unused-vars
const testForOfBreak = () => {
  console.log("testIter");
  for (const v of counterIter(5)) {
    console.log(v);
    if (v >= 2) break;
  }

  console.log("testGen");
  for (const v of counterGen(5)) {
    console.log(v);
    if (v >= 2) break;
  }
};

// testForOfBreak();

// for-of ループを実行中に例外発生
const testForOfThrow = () => {
  console.log("testIter");
  try {
    for (const v of counterIter(5)) {
      console.log(v);
      if (v >= 2) throw new Error("エラー発生");
    }
  } catch (e) {
    console.log("catched outer:", e.message);
  }

  console.log("testGen");
  try {
    for (const v of counterGen(5)) {
      console.log(v);
      if (v >= 2) throw new Error("エラー発生");
    }
  } catch (e) {
    console.log("catched outer:", e.message);
  }
};

testForOfThrow();
