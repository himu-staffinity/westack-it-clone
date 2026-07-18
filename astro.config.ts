import sitemap from "@astrojs/sitemap";
import { defineConfig, envField } from "astro/config";
import { SITE_URL } from "./src/config";

export default defineConfig({
  output: "static",
  trailingSlash: "ignore",
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
});
