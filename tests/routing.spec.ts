import { expect, test } from "@playwright/test";

const postPath = "/posts/passkey-auth-with-just-an-environment-variable";

test("URLs should not have a trailing slash", async ({ page }) => {
	await page.goto(`${postPath}/`);

	await expect(page).toHaveURL(postPath);
});

test("unknown pages return a 404 with the not found page", async ({ page }) => {
	const response = await page.goto("/this-page-does-not-exist");

	expect(response?.status()).toBe(404);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Hmm, this page doesn’t seem to exist.",
	);
	await expect(
		page.getByRole("link", { name: "nickbreaton.com" }),
	).toHaveAttribute("href", "/");
});
