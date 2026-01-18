// 以下のコードが Web サービスの一部で使われており、引数の input には Web サービスの利用者が入力した文字列が渡されるものとする。

export function f(input) {
  const f = new Function(`return "Hello, " + ${input}`);
  console.log(f());
}

// このコードには重大な問題が含まれている。何が問題と考えられるか記述しなさい。
// また問題を実証できるコードも記載しなさい。

f(`Array.from({ length: 100 }, (_, i) => i).forEach(i => console.log(i))`);
