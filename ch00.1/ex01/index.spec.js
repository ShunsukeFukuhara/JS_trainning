import { expect, test } from "@playwright/test";

test.describe("test page", () => {
  test("get rendered element", async ({ page }) => {
    await page.goto("/ch00.1/ex01/index.html");
    await expect(page.getByText("a")).toBeVisible();
  });
});
