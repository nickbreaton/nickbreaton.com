// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [],

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
