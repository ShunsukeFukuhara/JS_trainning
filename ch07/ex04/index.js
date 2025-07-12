// 以下のデータを使い、下記の各値を求めなさい。
// ただし、配列イテレータメソッドを利用し、ループ文(for, while)を使わないこと。

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

console.log(
  "mathの全員の合計点:",
  data.reduce((sum, student) => sum + student.math, 0)
); // 530

console.log(
  "クラスAのchemistryの平均点:",
  data
    .filter((student) => student.class === "A")
    .reduce((sum, student) => sum + student.chemistry, 0) /
    data.filter((student) => student.class === "A").length
); // 45

console.log(
  "クラスCの3科目合計点の平均点:",
  data
    .filter((student) => student.class === "C")
    .reduce(
      (sum, student) =>
        sum + (student.math + student.chemistry + student.geography),
      0
    ) / data.filter((student) => student.class === "C").length
); // 176.66

console.log(
  "3科目合計点が最も高い人のname:",
  data.reduce(
    (highest, student) => {
      const total = student.math + student.chemistry + student.geography;
      return total > highest.total ? { name: student.name, total } : highest;
    },
    { name: "", total: 0 }
  ).name
); // Frank

console.log(
  "全体のgeographyの標準偏差:",
  (() => {
    const mean =
      data.reduce((sum, student) => sum + student.geography, 0) / data.length;
    const variance =
      data.reduce(
        (sum, student) => sum + Math.pow(student.geography - mean, 2),
        0
      ) / data.length;
    return Math.sqrt(variance);
  })()
); // 22.33

// const highestMath = () => {
//   let maxScore = 0;
//   const maxScoreStudentNames = [];
//   for (const student of data) {
//     if (student.math > maxScore) {
//       maxScore = student.math;
//       maxScoreStudentNames.length = 0;
//       maxScoreStudentNames.push(student.name);
//     } else if (student.math === maxScore) {
//       maxScoreStudentNames.push(student.name);
//     }
//   }
//   return maxScoreStudentNames;
// };

// const highestMathFunc = () => {
//   const maxScore = data.reduce(
//     (max, student) => Math.max(max, student.math),
//     0
//   );

//   const maxScoreStudentNames = data
//     .filter((student) => student.math === maxScore)
//     .map((student) => student.name);

//   return maxScoreStudentNames;
// };
