import { makeProxyAndLogs } from "./index.js";

describe("makeProxyAndLogs", () => {
  test("メソッド呼び出しがログに記録されること", () => {
    const obj = {
      value: 10,
      add(x) {
        this.value += x;
        return this.value;
      },
      multiply(x) {
        this.value *= x;
        return this.value;
      },
    };

    const [proxy, logs] = makeProxyAndLogs(obj);
    expect(logs).toEqual([]);

    // メソッド呼び出し
    expect(proxy.add(5)).toBe(15);
    expect(proxy.multiply(2)).toBe(30);
    expect(proxy.value).toBe(30); // プロパティアクセスはログに記録されない

    // ログの検証
    expect(logs.length).toBe(2);
    expect(logs[0].name).toBe("add");
    expect(logs[0].args).toEqual([5]);
    expect(logs[0].timestamp).toBeInstanceOf(Date);
    expect(logs[1].name).toBe("multiply");
    expect(logs[1].args).toEqual([2]);
    expect(logs[1].timestamp).toBeInstanceOf(Date);
  });

  test("非関数プロパティのアクセスがログに記録されないこと", () => {
    const obj = {
      value: 42,
      getValue() {
        return this.value;
      },
    };
    const [proxy, logs] = makeProxyAndLogs(obj);
    expect(logs).toEqual([]);
    expect(proxy.value).toBe(42);
    expect(logs).toEqual([]);
    expect(proxy.getValue()).toBe(42);
    expect(logs.length).toBe(1);
    expect(logs[0].name).toBe("getValue");
    expect(logs[0].args).toEqual([]);
    expect(logs[0].timestamp).toBeInstanceOf(Date);
  });

  test("複数のメソッド呼び出しが正しくログに記録されること", () => {
    const obj = {
      count: 0,
      increment() {
        this.count++;
        return this.count;
      },
      decrement() {
        this.count--;
        return this.count;
      },
    };

    const [proxy, logs] = makeProxyAndLogs(obj);
    expect(logs).toEqual([]);
    expect(proxy.increment()).toBe(1);
    expect(proxy.increment()).toBe(2);
    expect(proxy.decrement()).toBe(1);
    expect(proxy.count).toBe(1); // プロパティアクセスはログに記録されない
    expect(logs.length).toBe(3);
    expect(logs[0].name).toBe("increment");
    expect(logs[0].args).toEqual([]);
    expect(logs[1].name).toBe("increment");
    expect(logs[1].args).toEqual([]);
    expect(logs[2].name).toBe("decrement");
    expect(logs[2].args).toEqual([]);
  });

  test("メソッドが this を正しく参照できること", () => {
    const obj = {
      base: 5,
      addToBase(x) {
        return this.base + x;
      },
    };
    const [proxy, logs] = makeProxyAndLogs(obj);
    expect(proxy.addToBase(10)).toBe(15);
    expect(logs.length).toBe(1);
    expect(logs[0].name).toBe("addToBase");
    expect(logs[0].args).toEqual([10]);
    expect(logs[0].timestamp).toBeInstanceOf(Date);
  });
});
