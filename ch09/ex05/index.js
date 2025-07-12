// instanceofと等価な関数 instanceOf(object, constructor)を作成しなさい。
// 関数内部での instanceof の利用は不可。

export const instanceOf = (object, constructor) => {
  if (object === null || typeof object !== "object") {
    return false;
  }

  let proto = Object.getPrototypeOf(object);
  const constructorPrototype = constructor.prototype;

  // プロトタイプがなくなるまで深堀りする
  while (proto !== null) {
    if (proto === constructorPrototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return false;
};
