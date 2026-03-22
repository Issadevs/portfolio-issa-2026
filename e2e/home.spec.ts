import { expect, test } from "@playwright/test";

test("la homepage charge en CV mode puis bascule en Dev mode", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Issa/i }).first()
  ).toBeVisible();
  await expect(
    page.locator("header").getByRole("button", { name: /Dev Mode/i })
  ).toBeVisible();

  await page
    .locator("header")
    .getByRole("button", { name: /Dev Mode/i })
    .click();

  await expect(
    page.locator("header").getByRole("button", { name: /HR Mode/i })
  ).toBeVisible();
  await expect(page.getByText("issa.kane — portfolio.ts")).toBeVisible();

  await page.reload();

  await expect(
    page.locator("header").getByRole("button", { name: /HR Mode/i })
  ).toBeVisible();
});
