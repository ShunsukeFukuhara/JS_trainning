// tests/inline-circle.spec.js
import { test, expect } from "@playwright/test";

test.describe("<inline-circle> custom element", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:5500/ch15.04-10/ex05/index.html");
  });

  test("<inline-circle> が定義されている", async ({ page }) => {
    const isDefined = await page.evaluate(() => {
      return customElements.get("inline-circle") !== undefined;
    });
    expect(isDefined).toBe(true);
  });

  test("connectedCallback: 初期スタイルが適用される", async ({ page }) => {
    const styles = await page.evaluate(() => {
      const el = document.querySelector("inline-circle");
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        display: cs.display,
        borderRadius: cs.borderRadius,
        borderColor: cs.borderColor,
        borderStyle: cs.borderStyle,
        borderWidth: cs.borderWidth,
        transform: cs.transform,
      };
    });

    expect(styles).not.toBeNull();
    expect(styles.display).toBe("inline-block");
    expect(styles.borderRadius).toBe("50%");
    expect(styles.borderColor).toBe("rgb(0, 128, 0)"); // greenではなくrgb表記
    expect(styles.borderStyle).toBe("dashed");
    expect(styles.borderWidth).toBe("2px");
    expect(styles.transform).not.toBe("none");
  });

  test("diameter 属性でサイズが変わる", async ({ page }) => {
    await page.evaluate(() => {
      const el = document.querySelector("inline-circle");
      if (el) el.setAttribute("diameter", "40px");
    });

    const size = await page.evaluate(() => {
      const el = document.querySelector("inline-circle");
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { width: cs.width, height: cs.height };
    });

    expect(size).not.toBeNull();
    expect(size.width).toBe("40px");
    expect(size.height).toBe("40px");
  });

  test("color属性で背景色が変わる", async ({ page }) => {
    await page.evaluate(() => {
      const el = document.querySelector("inline-circle");
      if (el) el.setAttribute("color", "red");
    });

    const bg = await page.evaluate(() => {
      const el = document.querySelector("inline-circle");
      if (!el) return null;
      return getComputedStyle(el).backgroundColor;
    });

    expect(bg).toBe("rgb(255, 0, 0)");
  });

  test("JSプロパティからセットしても反映される", async ({ page }) => {
    await page.evaluate(() => {
      const el = document.querySelector("inline-circle");
      if (el) {
        el.diameter = "50px";
        el.color = "blue";
      }
    });

    const style = await page.evaluate(() => {
      const el = document.querySelector("inline-circle");
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { width: cs.width, background: cs.backgroundColor };
    });

    expect(style).not.toBeNull();
    expect(style.width).toBe("50px");
    expect(style.background).toBe("rgb(0, 0, 255)");
  });
});
