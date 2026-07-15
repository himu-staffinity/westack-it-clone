import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { SITE_URL } from "./src/config";
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  trailingSlash: "always",
  site: SITE_URL,
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en"],
    routing: {
      prefixDefaultLocale: false, // Keep German URLs clean
      redirectToDefaultLocale: false
    }
  },
  integrations: [
    sitemap({
      customPages: [`${SITE_URL}/google-news.xml`],
    }),
  ],
  output: 'server', // OR 'hybrid'
  adapter: cloudflare(), // Ensure you have an adapter installed
});
