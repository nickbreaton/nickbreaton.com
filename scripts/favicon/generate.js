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
			icon.style.setProperty("--font-size", `${size * 0.9}px`);
			return document.fonts.ready;
		}, size);
		await page.waitForFunction(
			(size) => document.getElementById("icon").getBoundingClientRect().height === size,
			size,
		);
		await page.evaluate(() => {
			const text = document.querySelector("#icon h1");
			if (!text) return;
			const style = getComputedStyle(text);
			const context = document.createElement("canvas").getContext("2d");
			context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
			context.letterSpacing = style.letterSpacing;
			const ink = context.measureText(text.textContent);
			const inkLeft = -ink.actualBoundingBoxLeft;
			const inkTop = -ink.actualBoundingBoxAscent;
			const inkWidth = ink.actualBoundingBoxRight + ink.actualBoundingBoxLeft;
			const inkHeight = ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent;
			const box = text.getBoundingClientRect();
			const baseline = box.top + (box.height + ink.fontBoundingBoxAscent - ink.fontBoundingBoxDescent) / 2;
			const x = box.left + box.width / 2 - (box.left + inkLeft + inkWidth / 2);
			const y = box.top + box.height / 2 - (baseline + inkTop + inkHeight / 2);
			text.style.translate = `${x}px ${y}px`;
		});
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
