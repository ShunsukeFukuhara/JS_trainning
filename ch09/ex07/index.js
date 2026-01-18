// 以下のコードはSimpleListを継承して要素のpush回数を記録するInstrumentedSimpleListを実装した例である。
// しかし、このコードは想定した通りに動作しない。テストコードで正しく動作していないことを確認しなさい。
// この問題を回避するために、継承のかわりに合成(composition)を用いてInstrumentedSimpleListを修正し、テストが通るようにしなさい。

export class LinkedList {
  #head = null;
  #tail = null;

  constructor() {
    this.#head = null;
    this.#tail = null;
  }

  push(value) {
    const newNode = { value, next: null };
    if (!this.#head) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      this.#tail.next = newNode;
      this.#tail = newNode;
    }
  }

  pushAll(...items) {
    items.forEach((item) => this.push(item));
  }

  toString() {
    let current = this.#head;
    const values = [];
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    return "[" + values.join(", ") + "]";
  }
}

/**
 * 要素のpush回数を記録するLinkedList
 */
export class InstrumentedLinkedList extends LinkedList {
  #pushCount = 0;

  /**
   * 要素のpush操作が行われた回数
   */
  get pushCount() {
    return this.#pushCount;
  }

  push(item) {
    super.push(item);
    this.#pushCount++;
  }

  pushAll(...items) {
    super.pushAll(...items);
    this.#pushCount += items.length;
  }
}

export class InstrumentedLinkedListModefied {
  #list = new LinkedList();
  #pushCount = 0;

  get pushCount() {
    return this.#pushCount;
  }

  push(item) {
    this.#list.push(item);
    this.#pushCount++;
  }

  pushAll(...items) {
    this.#list.pushAll(...items);
    this.#pushCount += items.length;
  }

  toString() {
    return this.#list.toString();
  }
}
