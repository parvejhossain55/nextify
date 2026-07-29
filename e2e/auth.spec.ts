import { test, expect } from "@playwright/test";

test("should display home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Nextify");
});

test("should navigate to login page", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Sign In");
  await expect(page).toHaveURL("/login");
  await expect(page.locator("h1")).toContainText("Login");
});
