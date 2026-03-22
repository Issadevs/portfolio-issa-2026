import { expect, test } from "@playwright/test";

test("la page admin reste accessible même sans configuration Supabase", async ({
  page,
}) => {
  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { name: "Portfolio Admin" })
  ).toBeVisible();
  await expect(page.getByText(/debug — env vars/i)).toBeVisible();
});
