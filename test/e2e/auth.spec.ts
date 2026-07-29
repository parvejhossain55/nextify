import { test, expect } from "@playwright/test";

test("should display home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Nextify");
});

test("should navigate to login page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page).toHaveURL("/login");
  await expect(page.getByText("Login", { exact: true })).toBeVisible();
});
