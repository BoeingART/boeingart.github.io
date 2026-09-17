const { test, expect } = require("@playwright/test");
const { preparePage, stabilizeVisuals } = require("./helpers");

test("mobile navbar can expand/collapse", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only navigation behavior");

  await preparePage(page, "light");
  await page.goto("/al-folio/", { waitUntil: "networkidle" });

  const toggle = page.locator(".navbar-toggler").first();
  await expect(toggle).toBeVisible();

  const nav = page.locator(".navbar-collapse").first();
  await toggle.click();
  await expect(nav).toHaveClass(/show/);

  await toggle.click();
  await expect(nav).not.toHaveClass(/show/);
});

test("navbar menu stays right-aligned on desktop pages", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop-only alignment contract");

  await preparePage(page, "light");
  await page.goto("/al-folio/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  const alignment = await page.evaluate(() => {
    const container = document.querySelector("#navbar .container");
    const menu = document.querySelector("#navbarNav .navbar-menu-list");
    if (!container || !menu) {
      return null;
    }
    const containerBox = container.getBoundingClientRect();
    const menuBox = menu.getBoundingClientRect();
    return {
      containerRight: containerBox.right,
      menuRight: menuBox.right,
    };
  });

  expect(alignment).not.toBeNull();
  expect(Math.abs(alignment.menuRight - alignment.containerRight)).toBeLessThanOrEqual(24);
});

test("navbar search button opens modal and toggle buttons use pointer cursor", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "navbar search/theme controls are collapsed under mobile menu");

  await preparePage(page, "light");
  await page.goto("/al-folio/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);

  await page.evaluate(() => {
    const ninjaKeys = document.querySelector("ninja-keys");
    if (!ninjaKeys || typeof ninjaKeys.open !== "function") {
      return;
    }
    ninjaKeys.__openCalled = false;
    const originalOpen = ninjaKeys.open.bind(ninjaKeys);
    ninjaKeys.open = () => {
      ninjaKeys.__openCalled = true;
      return originalOpen();
    };
  });

  await page.click("#search-toggle");
  const modalOpened = await page.evaluate(() => Boolean(document.querySelector("ninja-keys")?.__openCalled));
  expect(modalOpened).toBeTruthy();

  const searchCursor = await page.locator("#search-toggle").evaluate((el) => window.getComputedStyle(el).cursor);
  const themeCursor = await page.locator("#light-toggle").evaluate((el) => window.getComputedStyle(el).cursor);
  expect(searchCursor).toBe("pointer");
  expect(themeCursor).toBe("pointer");
});

test("core pages no longer emit jQuery-style runtime errors", async ({ page }) => {
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      failures.push(message.text());
    }
  });

  await preparePage(page, "light");
  const pages = ["/al-folio/", "/al-folio/cn/", "/al-folio/publications/", "/al-folio/cv/"];

  for (const target of pages) {
    await page.goto(target, { waitUntil: "networkidle" });
    await stabilizeVisuals(page);
  }

  const jqueryFailures = failures.filter((message) => /\$\s*is not defined|lightbox/i.test(message));
  expect(jqueryFailures).toEqual([]);
});
