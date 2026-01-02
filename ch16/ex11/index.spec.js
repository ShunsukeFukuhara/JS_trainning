import { test, expect } from "@playwright/test";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverProcess;

test.beforeAll(async () => {
  serverProcess = spawn("node", ["ex11/index.js"], {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit",
  });

  // サーバー起動待ち
  await new Promise((r) => setTimeout(r, 500));
});

test.afterAll(() => {
  serverProcess.kill();
});

test("GET / returns index.html", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await expect(page.locator("form")).toBeVisible();
});

test("POST /greeting shows greeting result", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await page.fill("input[id=name]", "Taro");
  await page.fill("input[id=greeting]", "Good morning");
  await page.click("button[type=submit]");

  await expect(page.locator("text=Good morning, Taro!")).toBeVisible();
});
