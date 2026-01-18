import { test, expect } from "@playwright/test";

test.describe("Simple ToDo App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:5500/ch15.04-10/ex11/index.html#/");
  });

  // -------------
  // 1.基本操作
  // 1.1.単一のTODOの追加、完了、削除
  test("新規TODOを追加できる", async ({ page }) => {
    await page.fill("#new-todo", "買い物に行く");
    await page.click("button");

    const listItems = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(listItems).toContain("買い物に行く");
  });

  test("TODOを完了状態にできる", async ({ page }) => {
    await page.fill("#new-todo", "宿題する");
    await page.click("button");

    const checkbox = page.locator("#todo-list li:first-child .toggle");
    await checkbox.check();

    // class="completed" が付くか確認
    await expect(page.locator("#todo-list li:first-child")).toHaveClass(
      /completed/
    );
  });

  test("TODOを削除できる", async ({ page }) => {
    await page.fill("#new-todo", "消すタスク");
    await page.click("button");

    await page.click("#todo-list li:first-child .destroy");

    // リストが空になる
    await expect(page.locator("#todo-list li")).toHaveCount(0);
  });

  // 1.2.複数のTODOの追加、完了、削除を繰り返す
  test("複数のTODOを追加、完了、削除できる", async ({ page }) => {
    const todos = ["タスクA", "タスクB", "タスクC"];

    // 複数追加
    for (const todo of todos) {
      await page.fill("#new-todo", todo);
      await page.click("button");
    }
    let listItems = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(listItems).toEqual(todos);
    // 複数完了
    await page.locator("#todo-list li:nth-child(1) .toggle").check();
    await page.locator("#todo-list li:nth-child(3) .toggle").check();
    // class="completed" が付くか確認
    await expect(page.locator("#todo-list li:nth-child(1)")).toHaveClass(
      /completed/
    );
    await expect(page.locator("#todo-list li:nth-child(3)")).toHaveClass(
      /completed/
    );
    // 複数削除
    await page.click("#todo-list li:nth-child(2) .destroy");
    listItems = await page.locator("#todo-list li div label").allTextContents();
    expect(listItems).toEqual(["タスクA", "タスクC"]);

    // 残りを削除
    await page.click("#todo-list li:nth-child(1) .destroy");
    await page.click("#todo-list li:nth-child(1) .destroy");
    await expect(page.locator("#todo-list li")).toHaveCount(0);

    // 再度追加できることも確認
    await page.fill("#new-todo", "新しいタスク");
    await page.click("button");
    const finalItems = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(finalItems).toEqual(["新しいタスク"]);
  });

  // -------------
  // 2./active時の表示
  // 2.1.Activeボタンをクリックしたときの動作確認
  test("Activeボタンをクリックしたとき、URLハッシュが変化する", async ({
    page,
  }) => {
    await page.click('a[href="#/active"]');

    expect(page.url()).toMatch(/#\/active$/);
  });

  // 2.2 Activeフィルタの動作確認
  test("ハッシュ #/active のとき、未完了のみ表示する", async ({ page }) => {
    await page.fill("#new-todo", "A");
    await page.click("button");
    await page.fill("#new-todo", "B");
    await page.click("button");
    await page.locator("#todo-list li:nth-child(2) .toggle").check();
    await page.click('a[href="#/active"]');

    const listTexts = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(listTexts).toEqual(["A"]);
  });

  test("ハッシュ #/active のとき、完了済みは表示しない", async ({ page }) => {
    await page.fill("#new-todo", "A");
    await page.click("button");
    await page.fill("#new-todo", "B");
    await page.click("button");
    await page.locator("#todo-list li:nth-child(2) .toggle").check();
    await page.goto("#/active");

    const listTexts = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(listTexts).not.toContain("B");
  });

  test("未完了TODOを完了にしたとき、表示から消える", async ({ page }) => {
    await page.fill("#new-todo", "A");
    await page.click("button");
    await page.fill("#new-todo", "B");
    await page.click("button");
    await page.click('a[href="#/active"]');

    // label から check 対象 input を見つける
    const aToggle = page.locator('label:has-text("A")').locator("../input");
    // check() は DOMが消えるUIではタイムアウトするため click() を使用
    await aToggle.click({ force: true });
    // A が消えるのを待つ
    await expect(page.locator('label:has-text("A")')).toHaveCount(0);
  });

  test("active状態で新規にTODOを追加したとき、それが表示される", async ({
    page,
  }) => {
    await page.click('a[href="#/active"]');
    await page.fill("#new-todo", "A");
    await page.click("button");
    const listTexts = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(listTexts).toEqual(["A"]);
  });

  // -------------
  // 3./completed時の表示
  // 3.1.Completedボタンをクリックしたときの動作確認
  test("Completedボタンをクリックしたとき、URLハッシュが変化する", async ({
    page,
  }) => {
    await page.click('a[href="#/completed"]');

    expect(page.url()).toMatch(/#\/completed$/);
  });

  // 3.2 Completedフィルタの動作確認
  test("ハッシュ #/completed のとき、完了済みのみ表示する", async ({
    page,
  }) => {
    await page.fill("#new-todo", "A");
    await page.click("button");
    await page.fill("#new-todo", "B");
    await page.click("button");
    await page.locator("#todo-list li:nth-child(2) .toggle").check();
    await page.click('a[href="#/completed"]');
    const listTexts = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(listTexts).toEqual(["B"]);
  });

  test("ハッシュ #/completed のとき、未完了は表示しない", async ({ page }) => {
    await page.fill("#new-todo", "A");
    await page.click("button");
    await page.fill("#new-todo", "B");
    await page.click("button");
    await page.locator("#todo-list li:nth-child(2) .toggle").check();
    await page.goto("#/completed");
    const listTexts = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(listTexts).not.toContain("A");
  });

  test("完了済みTODOを未完了にしたとき、表示から消える", async ({ page }) => {
    await page.fill("#new-todo", "A");
    await page.click("button");
    await page.fill("#new-todo", "B");
    await page.click("button");
    await page.locator("#todo-list li:nth-child(2) .toggle").check();
    await page.click('a[href="#/completed"]');
    // label から check 対象 input を見つける
    const bToggle = page.locator('label:has-text("B")').locator("../input");
    // uncheck() は DOMが消えるUIではタイムアウトするため click() を使用
    await bToggle.click({ force: true });
    // B が消えるのを待つ
    await expect(page.locator('label:has-text("B")')).toHaveCount(0);
  });

  test("completed状態で新規にTODOを追加したとき、alertが表示され、TODOは表示されないが、リストには追加されているので完了解除すると表示される", async ({
    page,
  }) => {
    await page.click('a[href="#/completed"]');
    await page.fill("#new-todo", "A");
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toBe(
        '新しいTODO("A")が追加されましたが、現在のフィルタ設定のため表示されていません。'
      );
      await dialog.dismiss();
    });
    await page.click("button");
    const listTexts = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(listTexts).toEqual([]);
    // 未完了にして表示されることを確認
    await page.click('a[href="#/"]');
    const finalListTexts = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(finalListTexts).toEqual(["A"]);
  });

  // -------------
  // 4.Allに戻る操作
  // 4.1.Allボタンをクリックしたときの動作確認
  test("active状態でAllボタンをクリックしたとき、URLハッシュが変化する", async ({
    page,
  }) => {
    await page.click('a[href="#/active"]');
    await page.click('a[href="#/"]');
    expect(page.url()).toMatch(/#\/$/);
  });

  test("completed状態でAllボタンをクリックしたとき、URLハッシュが変化する", async ({
    page,
  }) => {
    await page.click('a[href="#/completed"]');
    await page.click('a[href="#/"]');
    expect(page.url()).toMatch(/#\/$/);
  });

  test("完了TODOがあるリストで、active状態からAllに戻ると、全TODOが表示される", async ({
    page,
  }) => {
    await page.fill("#new-todo", "A");
    await page.click("button");
    await page.fill("#new-todo", "B");
    await page.click("button");
    // B を完了にする
    await page.locator("#todo-list li:nth-child(2) .toggle").check();
    await page.click('a[href="#/active"]');
    await page.click('a[href="#/"]');
    const listTexts = await page
      .locator("#todo-list li div label")
      .allTextContents();
    expect(listTexts).toEqual(["A", "B"]);
  });
});
