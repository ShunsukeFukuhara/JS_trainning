const data = [
  { name: "Alice", class: "A", math: 10, chemistry: 30, geography: 20 },
  { name: "Bob", class: "A", math: 50, chemistry: 50, geography: 60 },
  { name: "Carol", class: "A", math: 70, chemistry: 55, geography: 30 },
  { name: "Dave", class: "B", math: 40, chemistry: 20, geography: 60 },
  { name: "Ellen", class: "B", math: 60, chemistry: 70, geography: 40 },
  { name: "Frank", class: "B", math: 90, chemistry: 70, geography: 80 },
  { name: "Isaac", class: "C", math: 70, chemistry: 40, geography: 50 },
  { name: "Justin", class: "C", math: 80, chemistry: 40, geography: 30 },
  { name: "Mallet", class: "C", math: 60, chemistry: 70, geography: 90 },
];

// 数学の最高点を取った生徒(複数人)を返す関数を作る
// ①for文を使った場合
const highestMathStudentsWithFor = () => {
  let maxScore = 0; // 最高点(初期値)
  const maxScoreStudentNames = []; // 最高点を取った生徒の名前を格納する配列
  // 以下繰り返し
  for (const student of data) {
    // 現在の生徒の数学の点数が最高点より高い場合は最高点を更新して、配列をリセットして自分の名前を追加
    if (student.math > maxScore) {
      maxScore = student.math;
      maxScoreStudentNames.length = 0;
      maxScoreStudentNames.push(student.name);
      // 現在の生徒の数学の点数が最高点と同じ場合は自分の名前を配列に追加
    } else if (student.math === maxScore) {
      maxScoreStudentNames.push(student.name);
    }
  }
  return maxScoreStudentNames;
};

// ②イテレーションメソッドを使った場合
const highestMathStudentsWithIteration = () => {
  // 数学の最高点
  const maxScore = data.reduce(
    (max, student) => Math.max(max, student.math),
    0
  );

  // 最高点を取った生徒の名前の配列
  const maxScoreStudentNames = data
    .filter((student) => student.math === maxScore)
    .map((student) => student.name);

  return maxScoreStudentNames;
};

// 上記の2つの関数は同じ結果を返すが、②の方がコードが読みやすいと感じたと思う
// "読みやすい"とはなにか？例えば
// - A：コードが短い
// - B：変数の数が少ない
// - C：変数が変化しない->その変数は名前の通りの意味を持っている
// - D：関数のふるまいを実現するのに必要なロジック'のみ'が書かれている
// - E：上から順に読めば理解できる
// など
// その観点で言えば
// 観点　　　 　　　　| ①　　　　　　　　　　　　　　　　　　　　 | ②
// ---　　　　　　　　|---　　　　　　　　　　　　　　　　　　　　|---
// A：コードの長さ　　| 長い　　　　　　　　　　　　　　　　　　　| 短い
// B：変数の数　　　　| 3個(for文のstudentを含む)　　　　　　　　| 2個
// C：変数の変化　　　| あり(処理を進めるごとに変数の中身が変わる)| なし(宣言された時点で値が決まる)
// D：処理とロジック　| 変数宣言、繰り返しはロジックと関係ない　　| 全て必要なロジックのみが記述
// E：コードの理解順序| for文でループする。変数の宣言を見に行く　 | 上から順に読める

// ②は関数型プログラミングの典型的なスタイルで、
// 変数の変化(副作用の一種)がなく、コードが短く、上から順に読めるので、
// 読みやすいと感じる人が多い

// また、イテレーションメソッドは関数型プログラミングを実装するための重要な要素であることもこの例からわかる

// [重要！！]
// ただしイテレーションメソッドを使わないと関数型プログラミングができないわけではない
// 例えば以下のようにfor文を使っても関数型プログラミングはできる

// 副作用のある処理をヘルパーメソッドに分けた関数
const highestMathStudents = () => {
  // 最高点を計算
  const maxScore = getMaxMathScore(data);
  // 最高点を取った生徒の名前の配列を取得
  const maxScoreStudentNames = getMaxMathScoreStudentNames(data, maxScore);

  return maxScoreStudentNames;
};

// ---
// ヘルパーメソッド
const getMaxMathScore = (students) => {
  let maxScore = 0;
  for (const student of students) {
    if (student.math > maxScore) {
      maxScore = student.math;
    }
  }
  return maxScore;
};

const getMaxMathScoreStudentNames = (students, maxScore) => {
  const maxScoreStudentNames = [];
  for (const student of students) {
    if (student.math === maxScore) {
      maxScoreStudentNames.push(student.name);
    }
  }
  return maxScoreStudentNames;
};
// ---

// この例では先ほどの"読みにくい"要素をヘルパーメソッドに分けることで、
// 元の関数では読みやすさの5つの観点を満たすことができている

// このように、イテレーションメソッドを使わない場合でも、
// 副作用の発生する部分を外に切り出すことで
// 読みやすい関数型プログラミングのスタイルを実現することは可能である。

// 実行結果
console.log(highestMathStudentsWithFor()); // [ 'Frank' ]
console.log(highestMathStudentsWithIteration()); // [ 'Frank' ]
console.log(highestMathStudents()); // [ 'Frank' ]
