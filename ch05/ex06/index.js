// try-catch-finally の実行順序が確認できるコードを書きなさい。

console.log("--------------");
console.log("例外が発生しない場合");
// 実行結果
// try -> finally
(() => {
  try {
    console.log("try");
  } catch (error) {
    console.log("catch");
  } finally {
    console.log("finally");
  }
})();

console.log("--------------");
console.log("例外が発生せず、try文でreturn/break/continueが実行された場合");
// 実行結果
// try -> finally -> return
(() => {
  try {
    console.log("try");
    return;
  } catch (error) {
    console.log("catch");
  } finally {
    console.log("finally");
  }
})();

console.log("--------------");
console.log("例外が発生し、catch文で処理された場合");
// 実行結果
// try -> catch -> finally
(() => {
  try {
    console.log("try");
    throw new Error("error");
  } catch (error) {
    console.log("catch");
  } finally {
    console.log("finally");
  }
})();

console.log("--------------");
console.log("例外が発生し、catch文を省略した場合");
// 実行結果
// try -> finally -> 例外はそのままthrowされる
try {
  (() => {
    try {
      console.log("try");
      throw new Error("error");
    } finally {
      console.log("finally");
    }
  })();
} catch (error) {
  console.log("catch:", error);
}

console.log("--------------");
console.log("例外が発生し、finally文で別の例外がthrowされた場合");
// 実行結果
// try -> finally -> finallyの例外が代わりにthrowされる
try {
  (() => {
    try {
      console.log("try");
      throw new Error("error");
    } finally {
      console.log("finally");
      // eslint-disable-next-line no-unsafe-finally
      throw new Error("finally error");
    }
  })();
} catch (error) {
  console.log("catch:", error);
}

console.log("--------------");
console.log("例外が発生し、finally文でreturn/break/continueが実行された場合");
// 実行結果
// try -> finally -> 正常にreturnされる
(() => {
  try {
    console.log("try");
    throw new Error("error");
  } finally {
    console.log("finally");
    // eslint-disable-next-line no-unsafe-finally
    return;
  }
})();
