// 値が必要になるまで実際の計算を行わない評価戦略を遅延評価と呼ぶ。ジェネレータ関数はnext()が呼ばれるまで評価が遅延される関数と考えることができる。
// 遅延評価を行うことで、例えば素数のような無限に続く値を扱うことができる。
// 呼び出しごとに素数を順番に返す無限ジェネレータ primes() を実装しなさい。

const integers = function* () {
  let n = 2;
  while (true) {
    yield n++;
  }
};

// P.363 の filter() 関数
function filter(iterable, predicate) {
  const iterator = iterable[Symbol.iterator]();
  return {
    // このオブジェクトはイテレータであり、反復可能でもある。
    [Symbol.iterator]() {
      return this;
    },
    next() {
      for (;;) {
        const v = iterator.next();
        if (v.done || predicate(v.value)) {
          return v;
        }
      }
    },
  };
}

export function* primes() {
  // エラトステネスの篩 (Sieve of Eratosthenes)
  function* sieve(iterable) {
    const it = iterable[Symbol.iterator]();
    // 最初の要素を取り出して返す
    const { value: prime } = it.next();
    yield prime;
    // filter は固定。再帰呼び出しでネストを1段階に抑える
    yield* sieve(filter(it, (n) => n % prime !== 0));
  }

  // integers()を引数にし、ふるいにかける
  yield* sieve(integers());
}
