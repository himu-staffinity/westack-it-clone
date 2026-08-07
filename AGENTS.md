# AGENTS.md — WeStack-IT Clone (westack-it.eu)

Guide for humans and AI agents working in this repo. Read this first, then use
the file map + design system sections to locate what you need.

## What this project is

A static marketing website for **WeStack Information Technologies GmbH**
(managed open-source infrastructure / cloud hosting provider), cloned from
westack-it.eu. Built with **Astro 5** + **Tailwind CSS v4** + **@astrojs/sitemap**.
Dark-only, German-first with English i18n. Deployed to **Gcore FastEdge** (edge
WASM runtime) and/or Gcore S3 object storage.

- **Source of truth for site identity:** `src/config.ts` (`SITE_URL`,
  `COMPANY_NAME`).
- **Content is static markdown** (Astro content collections) — 23 products × 2
  languages, plus privacy policy pages.
- **No frontend framework** (no React/Vue/Svelte) — pure Astro components with
  inline `<script>` for interactivity.

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview `dist/` locally |
| `npm run astro check` | Type/astro diagnostics (uses `tsconfig.json`) |
| `npm run aws-deploy` | `aws s3 cp dist/` → Gcore S3 bucket `westack-it-eu` |
| `npm run fe:build` | Build FastEdge WASM bundle (`.fastedge/fastedge.wasm`) |
| `npm run fe:run` | Local FastEdge preview on `:8080` incl. edge functions |
| `node scripts/convert.js` | Convert `src/assets/images/backgrounds/*.png` → webp |

Verification: run `npm run build` (succeeds = types/schema/asset refs OK) or
`npm run astro check`. For edge-function changes, `npm run fe:run` and POST
against `http://localhost:8080/request-demo`.

## Repo map

```
/
├── astro.config.ts           # Astro config: i18n (de default, en /en/), trailingSlash:"always", sitemap, Tailwind v4 vite plugin
├── tsconfig.json             # extends astro/tsconfigs/strict; unused @assets/* alias
├── package.json              # scripts: dev/build/preview/aws-deploy/fe:build/fe:run
├── wrangler.jsonc            # Cloudflare-style static hosting config (assets: ./dist) — NOT actively deployed
├── .env                      # gitignored: FASTEDGE_*, GCORE_API_KEY (see Deployment)
├── .fastedge/                # FastEdge edge runtime
│   ├── server.js             #   edge entry: static serving + POST /request-demo + GET /api/auth + /api/callback
│   ├── build-config.js       #   build config (static, publicDir ./dist)
│   └── fastedge.wasm         #   generated build artifact (gitignored)
├── scripts/
│   └── convert.js            # sharp PNG→webp converter (dormant; output path is stale)
├── prompt_templates/         # LLM prompts for the "add a product" content workflow (01–05)
├── public/                   # served as-is → dist/
│   ├── admin/                #   DecapCMS configs (config.yml, config.dev.yml)
│   ├── assets/               #   favicon/PWA PNGs, unused fonts + background images
│   ├── manifest.json         #   PWA manifest (STALE colors, see Gotchas)
│   └── humans.txt            #   stale boilerplate
└── src/
    ├── config.ts             # SITE_URL + COMPANY_NAME constants
    ├── styles/global.css     # ⭐ THE design system (Tailwind v4 @theme + @layer base/components)
    ├── layouts/Layout.astro  # HTML shell: Head, Header, Footer, scroll-reveal JS
    ├── components/           # Astro components (see inventory below)
    │   └── i18n/MultiLineText.astro
    ├── content/
    │   ├── config.ts         # content collection schemas (products, pages)
    │   ├── products/{de,en}/ # 23 markdown products per lang (000-… to 022-…)
    │   └── pages/{de,en}/    # privacy-policy.md
    ├── data/authors.js       # team member list (Footer)
    ├── i18n/
    │   ├── utils.ts          # getLangFromUrl, useTranslations, getLocalizedPath
    │   └── locales/{de,en}.json  # UI string translations (parallel structure)
    ├── assets/images/        # local images processed by astro:assets (sharp)
    │   ├── products/         #   23 products × icon.svg + iconPNG.png + plus.*
    │   ├── authors/          #   team photos (1 orphaned)
    │   ├── backgrounds/      #   ALL UNUSED (site uses remote Unsplash URLs)
    │   └── logo.svg          #   WeStack logo
    └── pages/
        ├── index.astro               # DE homepage (AIDA sections)
        ├── en/index.astro            # EN homepage
        ├── products/[slug].astro     # DE product detail
        ├── en/products/[slug].astro  # EN product detail
        ├── privacy-policy.astro      # DE
        ├── [lang]/privacy-policy.astro  # EN only (getStaticPaths returns {lang:'en'})
        ├── admin.astro               # DecapCMS shell
        └── robots.txt.ts             # GET() → robots.txt
```

## Design system (READ BEFORE ANY REDESIGN)

**One stylesheet:** `src/styles/global.css` (442 lines), imported once in
`src/layouts/Layout.astro`. Tailwind v4 is configured via the Vite plugin in
`astro.config.ts` — no `tailwind.config.*` file exists. **The site is dark-only
by design** — no `dark:` variants, no `.dark` selector, no `prefers-color-scheme`.

### Design tokens (`@theme` block, verbatim)

```css
@theme {
  --color-ink: #05070d;       /* page background */
  --color-base: #0a0e17;      /* section background */
  --color-surface: #0e1420;   /* cards / glass */
  --color-raised: #171e2e;    /* elevated surfaces */
  --color-fg: #e8edf6;        /* primary text */
  --color-muted: #94a1b8;     /* secondary text */
  --color-faint: #5c6a84;     /* tertiary text */
  --color-accent: #3fe0ff;    /* the one confident cyan accent */
  --color-accent-soft: #8ff2ff;
  --color-violet: #8b7cff;    /* secondary accent (aurora blobs, gradient) */

  --font-display: "Space Grotesk", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", "Menlo", monospace;

  --animate-marquee: marquee 55s linear infinite;
  --animate-aurora: aurora 16s ease-in-out infinite alternate;
  --animate-aurora-slow: aurora 28s ease-in-out infinite alternate-reverse;
}
```

These generate utilities used everywhere: `bg-ink`, `bg-base`, `bg-surface`,
`bg-raised`, `text-fg`, `text-muted`, `text-faint`, `text-accent`,
`text-accent-soft`, `bg-accent/20`, `bg-violet/15`, `font-display/sans/mono`,
`animate-aurora`, `animate-aurora-slow`. No custom breakpoints (Tailwind
defaults only; header/menu switches at 1023px).

### Fonts

Loaded via Google Fonts `<link>` in `src/components/Head.astro:37-42`
(preconnect + css2 URL): **Space Grotesk** (display/headings), **IBM Plex Sans**
(body), **IBM Plex Mono** (eyebrows/labels). `public/assets/fonts/*.woff2`
(Source Sans 3) are unused leftovers.

### Component classes (`@layer components`, `global.css:103-421`)

| Class | Purpose |
|---|---|
| `.aurora` | blurred colour blob (border-radius 9999px, blur 80px, pointer-events none) |
| `.bg-grid` | faint 56px technical grid overlay |
| `.btn-primary` | pill CTA: cyan gradient (accent-soft→accent→#29b8ff), glow, hover lift + brightness |
| `.btn-ghost` | pill glassy outline button, accent on hover |
| `.nav-link` | muted nav link with animated accent underline (slides in on hover) |
| `header.scrolled` | JS-toggled solid header (blur backdrop → solid `rgba(5,7,13,.9)`) |
| `.nav-links` (max-width:1023px) | full-screen glass mobile menu; `.nav-links.show` reveals it |
| `.menu-bars` / `.menu-btn.open` | hamburger→X animation (two spans, rotate ±45°) |
| `.marquee-track` | `width:max-content` + marquee animation, pauses on hover |
| `.reveal` / `.reveal.is-visible` | scroll-reveal (translateY 24px→0, 0.8s, `--reveal-delay` stagger var) |
| `.multi-line` | renders translated multi-line strings as block spans |
| `.hero-title .multi-line:last-child` | **brand gradient text** (accent-soft→accent→violet, background-clip:text) |
| `.faq-answer` / `.faq-icon` / `.faq-item.open` | accordion (max-height transition; icon rotates 45°) |
| `.demo-error` / `.demo-error.show` | form validation message toggling |
| `.prose-dark` | markdown body styling (product bodies + privacy pages): muted body, display-font headings, accent bullets/links |

### Motion & effects

- `@keyframes marquee` (55s), `aurora` (16s/28s alternate blobs) — defined in
  `@theme`.
- Film-grain overlay: `body::after` — fixed feTurbulence SVG data-URI, z-80,
  `opacity: 0.028` (premium non-flat finish; intentional).
- Scroll-reveal: IntersectionObserver in `Layout.astro` (threshold 0.12, honors
  reduced motion, noscript fallback forces `.reveal` visible).
- `prefers-reduced-motion: reduce` block at end of `global.css` kills all
  animations/transitions.
- Section anchors use `scroll-margin-top: 4.5rem` (fixed h-16 header).

### Visual conventions

- Buttons are pills (`border-radius:9999px`); section eyebrows are
  `font-mono text-[11px] uppercase tracking-[0.28em] text-accent`.
- Product cards: glass `bg-surface/70 backdrop-blur` with hover cyan glow.
- Page sections follow an **AIDA funnel** with fixed anchors:
  `#attention` (hero) → `#interest` (about) → `#product` (grid) → `#desire`
  (demo CTA) → `#footer`.
- Naming: semantic Tailwind utilities + a small set of global classes (not
  strict BEM). Components are PascalCase; icons are raw SVGs.
- **Redesign tips:** changing the palette = edit `@theme` in `global.css` only.
  Changing imagery = swap the remote Unsplash URLs in the four components that
  use `<img src="https://images.unsplash.com/...">` (AidaAttention,
  AidaInterest, AidaDesire, Footer, ProductPage). Changing typography = update
  the Google Fonts link in `Head.astro` + `--font-*` tokens.

## Assets

### Local images (`src/assets/images/` — processed via astro:assets/sharp)

| Path | Used by | Notes |
|---|---|---|
| `logo.svg` | Header, Footer | via `<Image>` |
| `products/{name}.svg` | Product cards + detail (`icon` frontmatter) | 28–80px, `object-contain`; stoat.svg is 128K (largest) |
| `products/{name}.png` | JSON-LD structured data (`iconPNG` frontmatter) | |
| `products/plus.svg/.png` | ProductSection "more coming soon" card | only dynamic import: `import("../assets/images/products/plus.svg")` |
| `authors/{bradley-wessels,jan-balke,jan-beelte}.jpg` | Footer team list | `lukas-himsel.jpg` orphaned |
| `backgrounds/*` | — | **ALL UNUSED**; site uses remote Unsplash URLs |

### Public assets (`public/` — copied as-is)

- `assets/images/*.png`: favicon set (57–512px) + `favicon.png` — referenced by
  `Head.astro` and `manifest.json`. **Gotcha:** `Head.astro:49` links
  `512.512.png` (typo — actual file is `512x512.png`, so it 404s).
- `assets/images/backgrounds/` + `starburst.png`: unreferenced duplicates.
- `assets/fonts/*.woff2`: unused leftovers.
- `admin/config.yml` + `config.dev.yml`: DecapCMS.

### Image usage patterns (follow these when adding images)

1. Local imports → `<Image>` from `astro:assets` (sharp optimizes; Footer uses
   `widths=[64,128,180] format="webp"`).
2. Hero/background imagery → direct `<img>` with remote Unsplash URLs; hero
   uses `loading="eager" fetchpriority="high"`.
3. Inline SVG data-URI (film grain in `global.css`) and inline `<svg>` markup
   (AidaDesire feature icons via `set:html`).

## Content & i18n

### Collections (`src/content/config.ts`)

- **products** (`type: content` — markdown body is the long description):
  frontmatter = `id` (number, matches filename prefix), `title`, `description`
  (one-liner), `icon` (SVG path), `iconPNG` (PNG path), `tags` (SEO array, up
  to ~38), `price` (EUR/month), `priceComment` (default `''`), `lang`
  (`de`/`en`, default `de`), `faq` (array of `{name, acceptedAnswer}`).
- **pages** (`type: content`): `title`, `lang` only.

### i18n mechanics

- `src/i18n/utils.ts`: `getLangFromUrl(Astro.url)` (first path segment,
  defaults `'de'`), `useTranslations(lang)` → `t('dotted.key')` with
  de-fallback, `getLocalizedPath(path, locale)`.
- UI strings live in `src/i18n/locales/{de,en}.json` (parallel structure:
  `nav.*`, `hero.title[]` (array of 4 lines → `MultiLineText`),
  `interest.*`, `desire.*`, `demo.*`, `site.*`, `products.*`, `footer.*`).
- **Some strings are hardcoded with inline ternaries** instead of `t()` —
  search for `lang === "en"` / `lang === "de"` in components before assuming a
  string is translatable (Header aria-labels, AidaAttention badge, ProductSection
  "Mehr erfahren", FAQ header "FAQ", Layout skip-link).
- DE content lives in `src/content/products/de/`, EN in `en/`; they're kept in
  sync manually (see `prompt_templates/05_en_de.md`).

### Adding a product (workflow)

1. Choose next number, e.g. `023`; create `src/content/products/de/023-name.md`
   and `en/023-name.md` with **identical base filenames** (slug derives from
   `product.slug.split("/")[1]`, language folder stripped).
2. Add `icon` SVG + `iconPNG` PNG to `src/assets/images/products/` (kebab-case).
3. Fill content via `prompt_templates/` in order: `01_description_short` →
   `02_keywords` → `03_faq` → `04_challenge_solution` (→ markdown body) →
   `05_en_de` (DE translation; keep anglicisms, GDPR→DSGVO, SME→KMU).
4. Everything (grid, marquee, JSON-LD) picks the product up automatically via
   `getCollection("products", lang)` sorted by `data.id`.
5. Verify with `npm run build` (frontmatter must satisfy the z schema).

## Pages & routing

| Path | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | DE homepage: AidaAttention → AidaInterest → ProductSection → AidaDesire |
| `/en/` | `src/pages/en/index.astro` | EN homepage |
| `/products/[slug]/` | `src/pages/products/[slug].astro` | DE; filters `lang === "de"` |
| `/en/products/[slug]/` | `src/pages/en/products/[slug].astro` | EN |
| `/privacy-policy/` | `src/pages/privacy-policy.astro` | DE |
| `/en/privacy-policy/` | `src/pages/[lang]/privacy-policy.astro` | returns only `{lang:'en'}` |
| `/admin/` | `src/pages/admin.astro` | DecapCMS shell (unpkg), config by `import.meta.env.DEV` |
| `/robots.txt` | `src/pages/robots.txt.ts` | disallows all, points to sitemap-index.xml |

- i18n routing: `de` unprefixed, `en` under `/en/` — via explicit page files,
  NOT Astro's i18n rewrite. No auto-redirects.
- **`trailingSlash: "always"`** — every internal href must end in `/`
  (`/products/foo/`, `/en/`, `/#desire`).
- Sitemap via `@astrojs/sitemap` (includes `/admin/`, no filter).

## Components inventory (`src/components/`)

| Component | Purpose |
|---|---|
| `Head.astro` | `<head>`: fonts, meta/OG/Twitter, canonical, favicons, color-scheme dark |
| `Header.astro` | sticky glass nav, logo + wordmark, `.nav-links`, LanguageSwitcher, mobile hamburger |
| `Footer.astro` | 3-col footer, Unsplash bg, authors from `data/authors.js`, address via `MultiLineText` |
| `LanguageSwitcher.astro` | DE\|EN pill; active = `bg-accent text-ink`; uses `getLocalizedPath` |
| `i18n/MultiLineText.astro` | renders string arrays/objects as `.multi-line` spans |
| `AidaAttention.astro` | hero: Unsplash bg, aurora blobs, `.bg-grid`, badge, hero-title, CTA buttons, product marquee |
| `AidaInterest.astro` | about section + hardcoded stack chips + "hosted in Germany" card |
| `AidaDesire.astro` | 3 feature cards (hosted/infra/GDPR) + `<DemoRequest>` |
| `ProductSection.astro` | product grid (23 cards) + "more coming soon" card |
| `ProductPage.astro` | product detail template + JSON-LD (Product schema, Offers, MerchantReturnPolicy) |
| `FAQ.astro` | accordion + schema.org FAQPage microdata (first item open) |
| `DemoRequest.astro` | email capture → `POST /request-demo` (FastEdge) with validation states |
| `icons/*.svg` | 8 SVGs; **only `globe.svg` is used** — rest orphaned |

Patterns: PascalCase filenames; feature sections under AIDA names; i18n helpers
in `components/i18n/`; per-component inline `<script>` (no shared JS bundle);
no framework.

## Edge functions (API)

`.fastedge/server.js` — compiled to WASM, runs on FastEdge:
- `POST /request-demo` — sends Brevo (Sendinblue) transactional email from
  `noreply@westack-it.eu` → `leads@westack-it.eu`; requires `BREVO_API_KEY` env.
- `GET /api/auth` + `GET /api/callback` — GitHub OAuth for DecapCMS.
- `/*` — static serving, then 404.

Test locally with `npm run fe:run` (port 8080). Secrets come from `.env`.

## Deployment

1. `npm run build` → `dist/`.
2. Either `npm run aws-deploy` (Gcore S3 bucket `westack-it-eu`, needs AWS CLI +
   `GCORE_API_KEY`) or FastEdge (`npm run fe:build` → upload WASM via Gcore
   portal/API).
3. `.github/workflows/` is **empty** — CI/CD was removed; deploys are manual.
4. `wrangler.jsonc` exists (Cloudflare static hosting) but is not actively used
   (`.wrangler/` contains only tmp).

`.env` keys (gitignored): `FASTEDGE_VAR_ENV_GITHUB_CLIENT_ID`,
`FASTEDGE_VAR_SECRET_GITHUB_CLIENT_SECRET`,
`FASTEDGE_VAR_SECRET_RECAPTCHA_SECRET_KEY` (**unused/dead**),
`FASTEDGE_VAR_SECRET_BREVO_API_KEY`, `GCORE_API_KEY`, `FASTEDGE_APP_ID`.

## Known issues & gotchas

1. `Head.astro:49` — favicon link `512.512.png` is a **typo** (file is
   `512x512.png`) → 404.
2. `Head.astro:90` — `/rss.xml` link is **dead** (no rss.xml exists).
3. `src/content/pages/{de,en}/privacy-policy.md` — both mention
   `www.kadalian.com` (leftover from a template).
4. `public/admin/config.yml` uses `westack-it.de` while `SITE_URL` is
   `westack-it.eu` (inconsistent).
5. `public/manifest.json` — stale colors: `theme_color: "#2583bf"` (old blue)
   and white `background_color` (site is dark `#05070d`).
6. `scripts/convert.js` writes to `public/images` but real copies live in
   `public/assets/images` (dormant tool).
7. Phone number inconsistency: JSON-LD in `ProductPage.astro` says
   `+49 163 1944 738`; Footer says `+49 911 743 930 00`.
8. Product `faq` values must be YAML-quoted when containing `:` or special
   chars; some AI-generated answers contain typos.
9. Some strings hardcoded per-language (see i18n section) — check before
   translating.
10. Unused cruft you can ignore: `sass`/`astro-compress`/`vite-plugin-style-import`/
    `glob` in package.json (not wired up), `public/humans.txt`,
    `src/assets/images/backgrounds/`, `public/assets/fonts/`,
    `components/icons/*` except `globe.svg`, author photo
    `lukas-himsel.jpg`, `google notranslate` meta is intentional.
11. Stale README.md — describes the old Sass-era structure; this AGENTS.md is
    the accurate reference.
