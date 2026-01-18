## 問題

以下のコードに示す関数 counterIter() 及び counterGen() を利用して、イテレータ及びジェネレータに対して「調査対象の操作」に示す操作をしたときに、どの部分が実行されるのかを調査するコードを作成し、実行結果と動作の説明を記述しなさい

```javascript
function counterIter(max) {
  console.log("counterIter");
  let c = 1;
  return {
    [Symbol.iterator]() {
      console.log("counterIter: Symbol.iterator");
      return this;
    },
    next() {
      console.log("counterIter: next");
      if (c >= max + 1) {
        return { value: undefined, done: true };
      }
      const value = c;
      c++;
      return { value, done: false };
    },
    return(value) {
      console.log("counterIter: return:", value);
      return { value, done: true };
    },
    throw(e) {
      console.log("counterIter: throw:", e);
      throw e;
    },
  };
}

function* counterGen(max) {
  console.log("counterGen");
  try {
    for (let c = 1; c <= max; c++) {
      console.log("counterGen: next");
      yield c;
    }
  } catch (e) {
    console.log("counterGen: catch:", e);
    throw e;
  } finally {
    console.log("counterGen: finally");
  }
}
```

## 回答

### 明示的にイテレータプロトコルの next() を呼び出す

```javascript
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

textNext();

/* 実行結果
textIter
counterIter
counterIter: next
{ value: 1, done: false }
counterIter: next
{ value: 2, done: false }
counterIter: next
{ value: undefined, done: true }
testGen
counterGen
counterGen: next
{ value: 1, done: false }
counterGen: next
{ value: 2, done: false }
counterGen: finally
{ value: undefined, done: true }
*/
```

counterIter() はイテレータオブジェクトを返し、next() メソッドが呼び出されるたびに「counterIter: next」が表示され、値が返される。3回目の next() 呼び出しで done が true になる。
なお、[Symbol.iterator]() メソッド、 return() メソッド、throw() メソッドは呼び出されない。

counterGen() はジェネレータオブジェクトを返し、next() メソッドが呼び出されるたびに「counterGen: next」が表示され、値が返される。3回目の next() 呼び出しで done が true になる。
最後に、ジェネレータ関数の終了に伴い finally ブロックが実行され、「counterGen: finally」が表示される。

### 明示的にイテレータプロトコルの return() を呼び出す

```javascript
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

testReturn();

/* 実行結果
testIter
counterIter
counterIter: next
{ value: 1, done: false }
counterIter: next
{ value: 2, done: false }
counterIter: return: 終了
{ value: '終了', done: true }
counterIter: next
{ value: 3, done: false }
testGen
counterGen
counterGen: next
{ value: 1, done: false }
counterGen: next
{ value: 2, done: false }
counterGen: finally
{ value: '終了', done: true }
{ value: undefined, done: true }
*/
```

iter.return("終了") の呼び出しにより、イテレータオブジェクトの return() メソッドが呼び出され、「counterIter: return: 終了」が表示される。返り値は { value: '終了', done: true } となる。
なお、return() メソッドの呼び出し後に next() メソッドを呼び出すと、イテレータオブジェクトの状態は変わらず、次の値が返される。

gen.return("終了") の呼び出しにより、ジェネレータオブジェクトの return() メソッドが呼び出され、ジェネレータ関数内の finally ブロックが実行され、「counterGen: finally」が表示される。返り値は { value: '終了', done: true } となる。
なお、return() メソッドの呼び出し後に next() メソッドを呼び出すと、ジェネレータオブジェクトの状態は完了状態となり、{ value: undefined, done: true } が返される。

### 明示的にイテレータプロトコルの throw() を呼び出す

```javascript
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

testThrow();
/* 実行結果
testIter
counterIter
counterIter: next
{ value: 1, done: false }
counterIter: next
{ value: 2, done: false }
counterIter: throw: Error: エラー発生
catch: エラー発生
counterIter: next
{ value: 3, done: false }
testGen
counterGen
counterGen: next
{ value: 1, done: false }
counterGen: next
{ value: 2, done: false }
counterGen: catch: Error: エラー発生
counterGen: finally
catch: エラー発生
{ value: undefined, done: true }
 */
```

iter.throw(new Error("エラー発生")) の呼び出しにより、イテレータオブジェクトの throw() メソッドが呼び出され、「counterIter: throw: Error: エラー発生」が表示される。throw() メソッド内で例外がスローされるため、catch ブロックで捕捉され、「catch: エラー発生」が表示される。
なお、throw() メソッドの呼び出し後に next() メソッドを呼び出すと、イテレータオブジェクトの状態は変わらず、次の値が返される。

gen.throw(new Error("エラー発生")) の呼び出しにより、ジェネレータオブジェクトの throw() メソッドが呼び出され、ジェネレータ関数内の catch ブロックが実行され、「counterGen: catch: Error: エラー発生」が表示される。その後、finally ブロックが実行され、「counterGen: finally」が表示される。catch ブロックで捕捉された例外は再スローされるため、外側の catch ブロックで捕捉され、「catch: エラー発生」が表示される。
なお、throw() メソッドの呼び出し後に next() メソッドを呼び出すと、ジェネレータオブジェクトの状態は完了状態となり、{ value: undefined, done: true } が返される。

### for-of ループを実行

```javascript
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

testForOf();
/* 実行結果
testIter
counterIter
counterIter: Symbol.iterator
counterIter: next
1
counterIter: next
2
counterIter: return: undefined
testGen
counterGen
counterGen: next
1
counterGen: next
2
counterGen: finally
*/
```

for-of ループはイテレータプロトコルを利用して反復処理を行う。counterIter(2) によりイテレータオブジェクトが生成され、[Symbol.iterator]() メソッドが呼び出される。「counterIter: Symbol.iterator」が表示される。
次に、next() メソッドが呼び出され、値が返される。2回目の next() 呼び出しで最後の値が返されると、ループが終了し、イテレータオブジェクトの return() メソッドが呼び出され、「counterIter: return: undefined」が表示される。

counterGen(2) によりジェネレータオブジェクトが生成され、next() メソッドが呼び出され、値が返される。2回目の next() 呼び出しで最後の値が返されると、ループが終了し、ジェネレータ関数の finally ブロックが実行され、「counterGen: finally」が表示される。

### for-of ループを実行途中で break

```javascript
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

testForOfBreak();
/* 実行結果
testIter
counterIter
counterIter: Symbol.iterator
counterIter: next
1
counterIter: next
2
counterIter: return: undefined
testGen
counterGen
counterGen: next
1
counterGen: next
2
counterGen: finally
*/
```

for-of ループ内で break 文が実行されると、イテレータオブジェクトの return() メソッドが呼び出され、「counterIter: return: undefined」が表示される。
ジェネレータオブジェクトの場合も同様に、finally ブロックが実行され、「counterGen: finally」が表示される。

### for-of ループを実行中に例外発生

```javascript
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

/* 実行結果
testIter
counterIter
counterIter: Symbol.iterator
counterIter: next
1
counterIter: next
2
counterIter: return: undefined
catched outer: エラー発生
testGen
counterGen
counterGen: next
1
counterGen: next
2
counterGen: finally
catched outer: エラー発生
*/
```

for-of ループ内で例外が発生すると、イテレータオブジェクトの return() メソッドが呼び出され、「counterIter: return: undefined」が表示される。外側の catch ブロックで例外が捕捉され、「catched outer: エラー発生」が表示される。
ジェネレータオブジェクトの場合も同様に、finally ブロックが実行され、「counterGen: finally」が表示される。外側の catch ブロックで例外が捕捉され、「catched outer: エラー発生」が表示される。
