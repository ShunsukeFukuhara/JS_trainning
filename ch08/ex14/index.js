// 以下の高階関数を実装しなさい

// 残余パラメータとして任意の数の関数を受け取り、いずれかの関数が true を返せば true を返す新たな関数を返すany 関数
export const any =
  (...functions) =>
  (...args) =>
    functions.some((fn) => fn(...args));
// Applyを使うと呼び出し元のthisを保持できる

// 引数として 2 つの関数を受け取り、1 つ目の関数で発生した例外を 2 つ目の関数の引数として処理し結果を返す新たな関数を返すcatching 関数

export const catching =
  (func, handler) =>
  (...args) => {
    try {
      return func(...args);
    } catch (error) {
      return handler(error);
    }
  };
