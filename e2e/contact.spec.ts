import { expect, test } from "@playwright/test";

test("le formulaire de contact affiche un succès quand l'API répond OK", async ({
  page,
}) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();

  await page.getByLabel("Votre nom").fill("Issa Kane");
  await page.getByLabel("Votre email").fill("issa@example.com");
  await page
    .getByLabel("Entreprise / Organisation (optionnel)")
    .fill("EFREI Paris");
  await page
    .getByLabel("Votre message")
    .fill("Bonjour, ceci est un test e2e du formulaire de contact.");

  await page.getByRole("button", { name: "Envoyer" }).click();

  await expect(
    page.getByRole("button", { name: /Message envoyé/i })
  ).toBeVisible();
});
