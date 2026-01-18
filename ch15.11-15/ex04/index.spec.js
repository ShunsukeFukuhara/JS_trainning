import { test, expect } from "@playwright/test";

const PAGE_URL = "http://127.0.0.1:5500/ch15.11-15/ex04/index.html";

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE_URL);

  // localStorage 初期化
  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.reload();
});

test("タスクを追加できる", async ({ page }) => {
  const input = page.locator("#new-todo");
  const list = page.locator("#todo-list");

  await input.fill("買い物");
  await input.press("Enter");

  const item = list.locator("li");
  await expect(item).toHaveCount(1);
  await expect(item.locator("label")).toHaveText("買い物");
});

test("チェックで完了状態にできる", async ({ page }) => {
  const input = page.locator("#new-todo");
  const list = page.locator("#todo-list");

  await input.fill("洗濯");
  await input.press("Enter");

  const checkbox = list.locator("input[type=checkbox]");
  const label = list.locator("label");

  await checkbox.check();
  await expect(label).toHaveCSS("text-decoration-line", "line-through");
});

test("タスクを削除できる", async ({ page }) => {
  const input = page.locator("#new-todo");
  const list = page.locator("#todo-list");

  await input.fill("削除テスト");
  await input.press("Enter");

  const button = list.locator("button");
  await button.click();

  await expect(list.locator("li")).toHaveCount(0);
});

test("リロードしてもlocalStorageから復元される", async ({ page }) => {
  const input = page.locator("#new-todo");
  const list = page.locator("#todo-list");

  await input.fill("永続化テスト");
  await input.press("Enter");

  await page.reload();

  const item = list.locator("li");
  await expect(item).toHaveCount(1);
  await expect(item.locator("label")).toHaveText("永続化テスト");
});

test("複数のタスクを追加して画面を更新しても、その順序が保たれる", async ({
  page,
}) => {
  const input = page.locator("#new-todo");
  const list = page.locator("#todo-list");
  const tasks = ["タスク1", "タスク2", "タスク3"];
  for (const task of tasks) {
    await input.fill(task);
    await input.press("Enter");
  }

  await page.reload();
  const items = list.locator("li");
  const count = await items.count();
  expect(count).toBe(tasks.length);
  for (let i = 0; i < count; i++) {
    const label = items.nth(i).locator("label");
    await expect(label).toHaveText(tasks[i]);
  }
});

test("複数タブでstorageの追加が同期される", async ({ browser }) => {
  const context = await browser.newContext();
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto(PAGE_URL);
  await page2.goto(PAGE_URL);

  await page1.evaluate(() => localStorage.clear());
  await page1.reload();
  await page2.reload();

  await page1.locator("#new-todo").fill("共有タスク");
  await page1.locator("#new-todo").press("Enter");

  await page2.waitForFunction(() => {
    return document.querySelectorAll("#todo-list li").length === 1;
  });

  const item = page2.locator("#todo-list li");
  await expect(item).toHaveCount(1);
  await expect(item.locator("label")).toHaveText("共有タスク");
});

test("複数タブでstorageの削除が同期される", async ({ browser }) => {
  const context = await browser.newContext();
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto(PAGE_URL);
  await page2.goto(PAGE_URL);

  await page1.evaluate(() => localStorage.clear());
  await page1.reload();
  await page2.reload();

  await page1.locator("#new-todo").fill("共有タスク");
  await page1.locator("#new-todo").press("Enter");

  await page2.waitForFunction(() => {
    return document.querySelectorAll("#todo-list li").length === 1;
  });

  const deleteButton = page2.locator("#todo-list li button");
  await deleteButton.click();
  await page1.waitForFunction(() => {
    return document.querySelectorAll("#todo-list li").length === 0;
  });

  const item = page1.locator("#todo-list li");
  await expect(item).toHaveCount(0);
});

test("複数タブでstorageの更新が同期される", async ({ browser }) => {
  const context = await browser.newContext();
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto(PAGE_URL);
  await page2.goto(PAGE_URL);

  await page1.evaluate(() => localStorage.clear());
  await page1.reload();
  await page2.reload();

  await page1.locator("#new-todo").fill("共有タスク1");
  await page1.locator("#new-todo").press("Enter");

  await page1.locator("#new-todo").fill("共有タスク2");
  await page1.locator("#new-todo").press("Enter");

  await page2.waitForFunction(() => {
    return document.querySelectorAll("#todo-list li").length === 2;
  });

  const checkbox = page2
    .locator("#todo-list li")
    .first()
    .locator("input[type=checkbox]");
  await checkbox.check();

  await page1.waitForFunction(() => {
    const firstItem = document.querySelectorAll("#todo-list li")[0];
    const checkbox = firstItem.querySelector("input[type=checkbox]");
    return checkbox.checked === true;
  });

  const firstItem = page1.locator("#todo-list li").first();
  const label = firstItem.locator("label");
  await expect(label).toHaveCSS("text-decoration-line", "line-through");

  const secondItem = page1.locator("#todo-list li").nth(1);
  const secondLabel = secondItem.locator("label");
  await expect(secondLabel).toHaveCSS("text-decoration-line", "none");
});

test("localStorage例外時でもgetTasksはクラッシュしない", async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(PAGE_URL);
  await page.evaluate(() => {
    // localStorage.getItemを例外を投げるようにモック化
    localStorage.getItem = () => {
      throw new DOMException("QuotaExceededError");
    };
  });

  // ページをリロードしてもクラッシュしないこと
  await page.reload();
  const list = page.locator("#todo-list li");
  await expect(list).toHaveCount(0);
});

test("localStorage例外時でもタスク追加はクラッシュしない", async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(PAGE_URL);
  await page.evaluate(() => {
    // localStorage.setItemを例外を投げるようにモック化
    localStorage.setItem = () => {
      throw new DOMException("QuotaExceededError");
    };
  });
  const input = page.locator("#new-todo");

  // タスク追加してもクラッシュしないこと
  await input.fill("タスク");
  await input.press("Enter");
  const list = page.locator("#todo-list li");
  await expect(list).toHaveCount(1);
});
