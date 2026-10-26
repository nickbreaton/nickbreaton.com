import { expect, test } from "@playwright/test";

test("unknown pages return a 404 with the not found page", async ({ page }) => {
	const response = await page.goto("/this-page-does-not-exist");

	expect(response?.status()).toBe(404);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Hmm, this page doesn’t seem to exist.",
	);
});

test("public files are served", async ({ request }) => {
	const response = await request.get("/.ssh/id_rsa");

	expect(response.status()).toBe(200);
	expect(await response.text()).toContain("4");
});
