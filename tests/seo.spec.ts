import { expect, test, type Page } from "@playwright/test";

const site = "https://nickbreaton.com";
const postPath = "/posts/passkey-auth-with-just-an-environment-variable";

function meta(page: Page, key: string) {
	return page.locator(`meta[property="${key}"], meta[name="${key}"]`);
}

async function jsonLd(page: Page) {
	const scripts = await page
		.locator('script[type="application/ld+json"]')
		.allTextContents();
	return scripts.map((script) => JSON.parse(script));
}

test("homepage", async ({ page }) => {
	await page.goto("/");

	const title = await page.title();
	const description = await meta(page, "description").getAttribute("content");

	await expect(meta(page, "og:type")).toHaveAttribute("content", "website");
	await expect(meta(page, "og:site_name")).toHaveAttribute(
		"content",
		"Nick Breaton",
	);
	await expect(meta(page, "og:url")).toHaveAttribute("content", `${site}/`);
	await expect(meta(page, "og:title")).toHaveAttribute("content", title);
	await expect(meta(page, "og:description")).toHaveAttribute(
		"content",
		description!,
	);
	await expect(meta(page, "og:image")).toHaveAttribute(
		"content",
		new RegExp(`^${site}/`),
	);

	expect(await jsonLd(page)).toEqual([
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "Nick Breaton",
			url: `${site}/`,
		},
	]);
});

test("blog post", async ({ page }) => {
	await page.goto(postPath);

	const title = await page.getByRole("heading", { level: 1 }).textContent();
	const date = await page.locator("time").getAttribute("datetime");

	await expect(page).toHaveTitle(title!);
	await expect(meta(page, "og:type")).toHaveAttribute("content", "article");
	await expect(meta(page, "og:site_name")).toHaveAttribute(
		"content",
		"Nick Breaton",
	);
	await expect(meta(page, "og:url")).toHaveAttribute(
		"content",
		`${site}${postPath}`,
	);
	await expect(meta(page, "og:title")).toHaveAttribute("content", title!);
	await expect(meta(page, "article:published_time")).toHaveAttribute(
		"content",
		new RegExp(`^${date}`),
	);

	const [schema] = await jsonLd(page);
	expect(schema).toMatchObject({
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: title,
		author: { "@type": "Person", name: "Nick Breaton", url: `${site}/` },
	});
	expect(schema.datePublished.slice(0, 10)).toBe(date);
});
