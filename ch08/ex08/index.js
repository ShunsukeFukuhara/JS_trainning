// 文中の counter をグループ化したクロージャを持つ関数 counterGroup を実装しなさい。
// 具体的には counterGroup は以下のメソッドを持つオブジェクトを返却しなさい。

// counterGroup#newCounter(): 文中の count と reset 同等の機能を持つ counter オブジェクトを返却する
// counterGroup#total(): これまで返却された counter が保持しているカウントの合計を返却する
// counterGroup#average(): これまで返却された counter が保持しているカウントの平均を返却する。counterGroup に属する counter が 1 つ以上存在していない場合 TypeError をスローする
// counterGroup#variance(): これまで返却された counter が保持しているカウントの分散を返却する。counterGroup に属する counter が 2 つ以上存在していない場合 TypeError をスローする

function counter() {
  let n = 0;
  return {
    count: function () {
      return n++;
    },
    reset: function () {
      n = 0;
    },
  };
}

export const counterGroup = () => {
  const counters = [];

  return {
    newCounter: () => {
      const c = counter();
      let currentCount = 0;

      // 内部でカウントを追跡し、getCount メソッドで取得できるようにするラッパーオブジェクト
      const wrapped = {
        count: () => {
          currentCount++;
          return c.count();
        },
        reset: () => {
          currentCount = 0;
          c.reset();
        },
        getCount: () => currentCount,
      };

      counters.push(wrapped);
      return wrapped;
    },

    total: () => counters.reduce((sum, c) => sum + c.getCount(), 0),

    average: function () {
      if (counters.length === 0) {
        throw new TypeError("少なくとも1つのカウンターが必要");
      }
      return this.total() / counters.length;
    },

    variance: function () {
      if (counters.length < 2) {
        throw new TypeError("少なくとも2つのカウンターが必要");
      }
      const avg = this.average();
      const sumOfSquares = counters.reduce(
        (sum, c) => sum + Math.pow(c.getCount() - avg, 2),
        0
      );
      return sumOfSquares / counters.length;
    },
  };
};
