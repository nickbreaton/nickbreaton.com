import { fileURLToPath } from "node:url";
import { dev } from "astro";
import { chromium } from "playwright";
import sharp from "sharp";

const root = fileURLToPath(new URL("../..", import.meta.url));
const route = "/__favicon";
const size = 64;

const icons = [
	{ file: "favicon-light.png", scheme: "light" },
	{ file: "favicon-dark.png", scheme: "dark" },
];

const server = await dev({
	root,
	logLevel: "error",
	server: { port: 4399 },
	integrations: [
		{
			name: "favicon-route",
			hooks: {
				"astro:config:setup": ({ injectRoute }) => {
					injectRoute({ pattern: route, entrypoint: "./scripts/favicon/favicon.astro" });
				},
			},
		},
	],
});

const browser = await chromium.launch().catch(async (error) => {
	await server.stop();
	throw error;
});

try {
	for (const { file, scheme } of icons) {
		const page = await browser.newPage({
			viewport: { width: size, height: size },
			colorScheme: scheme,
			deviceScaleFactor: 8,
		});
		await page.goto(`http://localhost:${server.address.port}${route}`, {
			waitUntil: "networkidle",
		});
		await page.evaluate((size) => {
			const icon = document.getElementById("icon");
			icon.style.setProperty("--size", `${size}px`);
			icon.style.setProperty("--radius", `${size * 0.35}px`);
			icon.style.setProperty("--icon-size", `${size * 0.6}px`);
		}, size);
		await page.waitForFunction(
			(size) => document.getElementById("icon").getBoundingClientRect().height === size,
			size,
		);
		const screenshot = await page.locator("#icon").screenshot({ omitBackground: true });
		await sharp(screenshot)
			.resize(size, size, { kernel: "linear" })
			.png()
			.toFile(`${root}public/${file}`);
		await page.close();
		console.log(`Generated public/${file}`);
	}
} finally {
	await browser.close();
	await server.stop();
}
