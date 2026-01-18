class DefaultMap extends Map {
  constructor(defaultValue) {
    super(); // 親クラスのコンストラクタを呼び出す。
    this.defaultValue = defaultValue; // デフォルト値を記憶する。
  }
  get(key) {
    if (this.has(key)) {
      // マップ中にキーが存在すれば、
      return super.get(key); // 親クラス中の値を返す。
    } else {
      return this.defaultValue; // 存在しなければ、デフォルト値を返す。
    }
  }
}

class Histogram {
  constructor() {
    this.wordCounts = new DefaultMap(0);
    this.totalWords = 0;
  }

  add(text) {
    const matches = text.toLowerCase().matchAll(/\w+|\$[\d.]+|\S+/g);
    const words = [...matches].map((r) => r[0]);

    for (const word of words) {
      const count = this.wordCounts.get(word);
      this.wordCounts.set(word, count + 1);
      this.totalWords++;
    }
  }

  toString() {
    let entries = [...this.wordCounts];
    entries.sort((a, b) => {
      if (a[1] === b[1]) {
        return a[0] < b[0] ? -1 : 1;
      } else {
        return b[1] - a[1];
      }
    });

    for (const entry of entries) {
      entry[1] = (entry[1] / this.totalWords) * 100;
    }

    // 出現頻度 0.5% 以上を取得
    entries = entries.filter((entry) => entry[1] >= 0.5);
    // padStart で表示幅を揃える / # の数を n ではなく 10 * n に変更
    const lines = entries.map(
      ([l, n]) =>
        `${l.padStart(10)}: ${"#".repeat(Math.round(10 * n))} ${n.toFixed(2)}%`
    );

    return lines.join("\n");
  }
}

// このasync 関数（Promise を返す関数）は、Histogram オブジェクトを生成する。
// 標準入力からテキストを非同期に読み出し、読み出したテキストをヒストグラムに
// 追加する。テキストを最後まで読み出したら、ヒストグラムを返す。
async function histogramFromStdin() {
  process.stdin.setEncoding("utf-8"); // バイト列ではなく、Unicode 文字列を読む。
  const histogram = new Histogram();
  for await (const chunk of process.stdin) {
    histogram.add(chunk);
  }
  return histogram;
}
// この最後の一行がこのプログラムのメイン部分。
// 標準入力からHistogram オブジェクトを生成し、ヒストグラムを表示する。
histogramFromStdin().then((histogram) => {
  console.log(histogram.toString());
});
