test("以下のコードの // ここに１行のコードを書く の部分に１行だけコードを書いて、最後のマッチャーに成功するようなテストを作成しなさい。", () => {
  const mock = jest.fn();

  const obj = {
    x: 0,
    y: 0,
    sum() {
      mock();
      return this.x + this.y;
    },
  };

  // ここに１行のコードを書く
  Object.defineProperty(obj, "sum", { get: obj.sum, enumerable: true });

  obj.x = 1;
  obj.y = 2;
  expect(JSON.stringify(obj)).toBe(`{"x":1,"y":2,"sum":3}`);
  expect(mock).toHaveBeenCalled();
});
