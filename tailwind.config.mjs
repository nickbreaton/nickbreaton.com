/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // https://www.tints.dev/purple/D3BB8B
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
      },
    },
  },
  plugins: [],
};
