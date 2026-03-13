// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://yalinpala.dev",

  build: {
    inlineStylesheets: "always",
  },

  integrations: [
    mdx({
      optimize: true,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});