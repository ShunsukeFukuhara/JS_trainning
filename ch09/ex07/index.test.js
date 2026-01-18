import {
  InstrumentedLinkedList,
  InstrumentedLinkedListModefied,
} from "./index.js";

describe("InstrumentedLinkedList", () => {
  it("#push", () => {
    const list = new InstrumentedLinkedList();
    list.push("A");
    expect(list.pushCount).toBe(1);
  });
  it("#pushAll", () => {
    const list = new InstrumentedLinkedList();
    list.pushAll("A", "B"); // pushAll内のpushが既にオーバーライドされているため、意図しない動作をしている
    expect(list.pushCount).toBe(2);
  });
});

describe("InstrumentedLinkedListModefied", () => {
  it("#push", () => {
    const list = new InstrumentedLinkedListModefied();
    list.push("A");
    expect(list.pushCount).toBe(1);
  });
  it("#pushAll", () => {
    const list = new InstrumentedLinkedListModefied();
    list.pushAll("A", "B");
    expect(list.pushCount).toBe(2);
  });
});
