// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://nickbreaton.com",

  integrations: [mdx()],

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Lexend",
      cssVariable: "--font-lexend",
      weights: ["100 900"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "block",
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
