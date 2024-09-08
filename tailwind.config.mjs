import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				// https://www.tints.dev/
				// #D3BB8B at 400
				primary: {
					50: "oklch(97.38% 0.009 84.57 / <alpha-value>)",
					100: "oklch(95.03% 0.018 86.15 / <alpha-value>)",
					200: "oklch(89.86% 0.035 82.91 / <alpha-value>)",
					300: "oklch(84.76% 0.053 85.08 / <alpha-value>)",
					400: "oklch(80.09% 0.069 84.33 / <alpha-value>)",
					500: "oklch(72.76% 0.093 83.59 / <alpha-value>)",
					600: "oklch(64.23% 0.098 82.72 / <alpha-value>)",
					700: "oklch(51.78% 0.077 82.86 / <alpha-value>)",
					800: "oklch(39.37% 0.057 82.44 / <alpha-value>)",
					900: "oklch(24.93% 0.032 82.3 / <alpha-value>)",
					950: "oklch(18.38% 0.02 88.8 / <alpha-value>)",
				},
				// https://www.tints.dev/
				// #847B75 at 400
				dark: {
					50: "oklch(95.56% 0.002 67.8 / <alpha-value>)",
					100: "oklch(89.96% 0.004 39.48 / <alpha-value>)",
					200: "oklch(79.84% 0.007 53.42 / <alpha-value>)",
					300: "oklch(70.04% 0.011 58.15 / <alpha-value>)",
					400: "oklch(58.91% 0.014 56.1 / <alpha-value>)",
					500: "oklch(51.96% 0.013 54.32 / <alpha-value>)",
					600: "oklch(44.67% 0.01 56.12 / <alpha-value>)",
					700: "oklch(36.05% 0.008 43.21 / <alpha-value>)",
					800: "oklch(27.93% 0.006 56.15 / <alpha-value>)",
					900: "oklch(19.32% 0.004 48.52 / <alpha-value>)",
					950: "oklch(14.6% 0.002 17.35 / <alpha-value>)",
				},
			},
			fontFamily: {
				// TODO: install a working font
				serif: ["Platypi Variable", defaultTheme.fontFamily.serif],
			},
		},
	},
	plugins: [],
};
