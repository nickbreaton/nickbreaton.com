import { defineConfig } from "@playwright/test";

const port = 4329;

export default defineConfig({
	testDir: "tests",
	use: {
		baseURL: `http://localhost:${port}`,
	},
	webServer: {
		command: `npm run build && wrangler dev --port ${port}`,
		url: `http://localhost:${port}`,
	},
});
