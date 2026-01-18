// 文ブロックを使って同じ関数内に同じ変数名の const を複数宣言する関数を書きなさい。

const multipleConst = () => {
  {
    const x = 1;
    console.log(x);
  }
  {
    const x = 2;
    console.log(x);
  }
  {
    const x = 3;
    console.log(x);
  }
};

multipleConst();
