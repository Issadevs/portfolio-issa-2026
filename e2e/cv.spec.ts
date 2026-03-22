import { expect, test } from "@playwright/test";

test("la page /cv permet de revenir vers le mode dev", async ({ page }) => {
  await page.goto("/cv");

  await expect(
    page.getByRole("button", { name: /Print \/ PDF|Imprimer \/ PDF/i })
  ).toBeVisible();

  await page
    .locator("header")
    .getByRole("button", { name: /Dev Mode/i })
    .click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText("issa.kane — portfolio.ts")).toBeVisible();
});
