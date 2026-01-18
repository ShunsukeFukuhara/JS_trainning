import { test, expect } from "@playwright/test";

test.describe("Product filter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ch15.01-03/ex14/index.html");
  });

  test("すべてを選ぶと全て表示される", async ({ page }) => {
    await page.selectOption('[data-testid="select"]', "all");
    await expect(page.getByTestId("food1")).toBeVisible();
    await expect(page.getByTestId("stationery1")).toBeVisible();
    await expect(page.getByTestId("stationery2")).toBeVisible();
  });

  test("食品を選ぶと食品だけ表示される", async ({ page }) => {
    await page.selectOption('[data-testid="select"]', "food");
    await expect(page.getByTestId("food1")).toBeVisible();
    await expect(page.getByTestId("stationery1")).toBeHidden();
    await expect(page.getByTestId("stationery2")).toBeHidden();
  });

  test("文房具を選ぶと文房具だけ表示される", async ({ page }) => {
    await page.selectOption('[data-testid="select"]', "stationery");
    await expect(page.getByTestId("food1")).toBeHidden();
    await expect(page.getByTestId("stationery1")).toBeVisible();
    await expect(page.getByTestId("stationery2")).toBeVisible();
  });
});
