// 「同時に実行される数を制限」する仕組みを作ることにする。以下の PromisePool を完成させなさい。

export class PromisePool {
  // キューサイズ
  #queueSize;
  // 同時実行数
  #maxRunningPromises;
  // 実行中のプロミス数
  #runningCount = 0;
  // プロミスが開始されているか
  #started = false;
  // キュー
  #queue = [];

  // すべての処理開始済みプロミス
  #allPromises = [];

  /**
   * Constructs PromisePool.
   *
   * @param queueSize the max size of queue
   * @param maxRunningPromises the maximum number of running promises at the same time.
   *
   * @throws Error if either queueSize or maxRunningPromises is less than 1
   */
  constructor(queueSize, maxRunningPromises) {
    if (queueSize < 1) {
      throw new Error("キューサイズは1以上");
    }

    if (maxRunningPromises < 1) {
      throw new Error("同時実行数は1以上");
    }

    this.#queueSize = queueSize;
    this.#maxRunningPromises = maxRunningPromises;
  }

  /**
   * Starts PromisePool.
   *
   * @returns Promise, which will be rejected if this pool is already started
   */
  async start() {
    if (this.#started) {
      throw new Error("プロミスは既に開始されています");
    }

    this.#started = true;
  }

  /**
   * Wait all promises for their terminations.
   * All requests dispatched before this method is invoked must complete
   * and this method also will wait for their completion.
   *
   * @returns Promise, which will be rejected if this pool has not been started.
   */
  async stop() {
    if (!this.#started) {
      throw new Error("プロミスは開始されていません");
    }

    // プロミスの受付を終了
    this.#started = false;

    // すべての処理開始済みプロミスを待つ
    await Promise.all(this.#allPromises);
  }

  /**
   * Executes the specified promise from the given factory using this pool.
   * If the queue is full, then the returned Promise will not be fulfilled until the queue is not full.
   *
   * @param promiseFactory the function that retuns Promsie
   *
   * @returns Promise, which will be rejected if this pool has not been started.
   */
  async dispatch(promiseFactory) {
    if (!this.#started) {
      throw new Error("プロミスは開始されていません");
    }

    // キューが満杯なら待つ
    if (this.#queue.length >= this.#queueSize) {
      await new Promise((resolve) => this.#queue.push(resolve));
    }

    // 実行可能になるまで待つ
    await this.#waitForSlot();

    const p = (async () => {
      try {
        this.#runningCount++;
        await promiseFactory();
      } finally {
        this.#runningCount--;
        this.#processQueue();
      }
    })();

    this.#allPromises.push(p);
    return p;
  }

  async #waitForSlot() {
    if (this.#runningCount < this.#maxRunningPromises) {
      return;
    }
    await new Promise((resolve) => this.#queue.push(resolve));
  }

  #processQueue() {
    const next = this.#queue.shift();
    if (next) next();
  }
}
