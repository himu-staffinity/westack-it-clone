# WeStack — Design System: "Sovereign Signal"

> Source of truth for the 2026 awwwards-grade redesign of westack-it.eu.
> This document describes *what* the site should look and feel like and *why*.
> The single implementation lives in `src/styles/global.css` (`@theme` tokens +
> `@layer components`) with Tailwind utilities throughout markup, plus a
> client-side motion layer (`src/scripts/`) built on **GSAP + ScrollTrigger**,
> **Lenis** smooth scroll and a **Three.js** WebGL scene.

---

## 1. Concept statement

WeStack is a German managed-infrastructure provider: **sovereign, careful,
European, done properly**. The previous iteration dressed that in "warm
editorial" language — ivory paper, espresso ink, bronze gold. Calm, but static:
the product — living infrastructure — was nowhere to be seen.

The redesign flips the register: **show the machine.** Dark, cinematic,
precision-engineered. Standing inside the stack at night. Where the editorial
design whispered "trust us", this one *demonstrates* the product in motion —
a living 3D tower of compute layers, data streaming across the page, every
scroll a camera move. German engineering as a film set.

The message: *we run the stack so you don't have to — and we're proud enough to
put it on stage.* Obsidian grounds, one confident phosphor-cyan signal, silver
engineering type, hairline grids, and a WebGL stack that breathes with the
pointer.

### Mood & inspiration

- Awwwards Site-of-the-Day calibre: dark, immersive, scroll-storytelling
- **Obsidian/charcoal** grounds (warm-tinted, never pure blue), fog for depth
- **Phosphor cyan** as the single "signal" accent — data in the dark; warm
  **amber** + electric **violet** reserved for gradients and secondary moments
- **Archivo** variable display type (up to expanded widths) for poster-grade
  headlines; **JetBrains Mono** for technical labels — like a control room
- Hairline grids, dashed data-lines, scanlines, film grain — atmosphere, not noise
- **Motion is the material**: Lenis smooth scroll, GSAP ScrollTrigger
  storytelling, split-text reveals, pinned horizontal product scroll, magnetic
  buttons, custom cursor, WebGL hero

---

## 2. Color palette (`@theme` tokens)

All contrast ratios computed on `--color-paper` (`#07090e`, the page ground).
Target: WCAG AA (≥4.5:1 normal, ≥3:1 large). Dark-only by design — no
`dark:` variants, no `.dark` selector.

| Token | Hex | Use | Contrast on paper |
|---|---|---|---|
| `--color-paper` | `#07090e` | Page ground — warm obsidian night | — |
| `--color-base` | `#0b0f18` | Alternating section ground (lifted) | — |
| `--color-surface` | `#111624` | Cards, plates, wells (glass) | — |
| `--color-raised` | `#1a2233` | Elevated surfaces, icon wells | — |
| `--color-ink` | `#04060b` | Deepest night: preloader, solid header | — |
| `--color-fg` | `#eef2f8` | Primary text — cold silver-white | ~16:1 |
| `--color-muted` | `#9aa7be` | Secondary text | ~7.4:1 |
| `--color-faint` | `#6b7a96` | Tertiary text / labels | ~4.4:1 |
| `--color-accent` | `#48e5ff` | Phosphor cyan: links, borders, CTAs | ~13:1 |
| `--color-accent-soft` | `#a3f3ff` | Light cyan: tints, gradients (decorative) | ~16:1 |
| `--color-violet` | `#8b7cff` | Electric violet: gradient partner | ~6.5:1 |
| `--color-amber` | `#ffb46b` | Warm human accent: small highlights | ~10:1 |
| `--color-cream` | `#f4f7fc` | Text on dark/cyan fills | — |

### Rationale

- **Cyan is the signal, not the theme.** `#48e5ff` is phosphor — the one thing
  in the room that glows. It belongs to eyebrows, active states, focus rings
  and the WebGL accent. Everything else is graded light so the signal reads.
- **Warm-tinted obsidian** (`#07090e`, not `#000`) keeps the dark from feeling
  cheap or flat; fog + vignettes give the scene depth.
- **Tiered neutrals carry the hierarchy** — `fg → muted → faint` all pass AA,
  so dark never sacrifices legibility for atmosphere.
- **Amber is the human register** — founder names, "EU hosted" chips, small
  warm highlights — a hint of copper in a cold machine.
- Contrast targets are hit by construction; `accent-soft` and `violet` are
  used decoratively at sizes ≥ large-text where 3:1 applies.

### Hardcoded old-theme colors — removed

All warm-ivory/paper family (`#faf6ec`, `#f2ebdd`, `#fffdf6`, `#ece2cd`),
espresso `#1f1810`-family, bronze `#8a6327`/`#c9a05c` and terracotta `#b06a3f`
are gone. Logo re-inked: `#1f1810 → #eef2f8`, `#8a6327 → #48e5ff`,
`#b06a3f → #8b7cff`.

---

## 3. Typography system

| Role | Family | Google Fonts axis | Notes |
|---|---|---|---|
| Display / Headlines | **Archivo** | `ital,wdth,wght@0,62..125,100..900` | Variable grotesque with a *width* axis — posters at 110–120 width, tight at 62. latin-ext (umlauts). |
| Body | **Archivo** | (same family, 400/500/600) | One family, two registers. Clean geometric grotesk. |
| Mono / labels | **JetBrains Mono** | `wght@100..800` | Technical eyebrows, chips, prices, ticker. latin-ext. |

Google Fonts link (replaces the Fraunces/Hanken/Space Mono block in
`Head.astro`):

```
https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=JetBrains+Mono:wght@400;500;600;700&display=swap
```

### Type scale

| Element | Spec |
|---|---|
| Hero h1 | Archivo 600, `clamp(2.75rem, 8vw, 6.5rem)`, `font-stretch` up to 115, leading 0.96, tight tracking; final line italic with cyan→violet gradient |
| Section h2 | Archivo 600, `clamp(2rem, 5vw, 4rem)`, leading 1.02, expanded |
| Statement (interest) | Archivo 500, `clamp(1.75rem, 4vw, 3.25rem)`, leading 1.15 — scroll-revealed word-by-word |
| Card titles | Archivo 600, 1.15–1.35rem |
| Eyebrows | JetBrains Mono 500, 11px, uppercase, tracking 0.28em, cyan |
| Body | Archivo 400, 16–18px, line-height 1.7 |
| Mono meta | JetBrains Mono, 10–12px, tracking-wider, muted/faint |

**Tone**: weight 600 for statements, weight 400 everywhere else; expansion
(`font-stretch`) replaces loud weight for display drama. Mono labels feel set
by a machine.

---

## 4. Spacing / radii / shadows / borders

- **Spacing**: Tailwind default scale; sections breathe at `py-28`+; hero is
  full `min-h-svh`. Whitespace is the staging area for motion.
- **Radii** — squared-sharp cards, pill controls:

| Token | Value | Applied to |
|---|---|---|
| `--radius-card` | `0.75rem` | Cards, plates, form wells |
| `--radius-well` | `0.5rem` | Icon wells, tags |
| (default) | `9999px` | Buttons, pills, cursor |

- **Shadows** — deep night shadows for lift + a *single* cyan glow reserved for
  the signal:

| Token | Value | Applied to |
|---|---|---|
| `--shadow-card` | `0 1px 0 rgba(255,255,255,.03) inset, 0 20px 50px -25px rgba(0,0,0,.65)` | Resting cards |
| `--shadow-lift` | `0 40px 80px -30px rgba(0,0,0,.75)` | Hover lift, aside, form |
| `--shadow-glow` | `0 0 0 1px rgba(72,229,255,.35), 0 20px 60px -20px rgba(72,229,255,.35)` | Signal hover: primary buttons, active cards |

- **Borders**: hairline `1px`, light at 8–15% (`border-fg/10`, `border-fg/15`);
  cyan replaces on active/hover (`border-accent/40`). Section rhythm via
  `border-t border-fg/10`.

---

## 5. Component language

- **Preloader** (`Layout`): full-screen `bg-ink`. Mono ticker on the left
  (`DE · MANAGED OPEN-SOURCE INFRASTRUCTURE`), a counting percentage
  (`00 → 100`), a thin progress hairline, then a clip-path wipe up that reveals
  the hero. ≤1.8s, skips instantly on reduced motion / after first paint.
- **Header**: fixed; transparent over the hero, gains `bg-ink/70 +
  backdrop-blur-xl` + hairline once scrolled (`.scrolled`). Logo (re-inked) +
  "WeStack" in Archivo 600. Nav links: JetBrains Mono 11px uppercase, muted →
  white, cyan underline slides in. Desktop shows a mono `[DE / EN]` pill.
  Mobile: full-screen ink menu with staggered oversized links + a faint product
  ticker behind; hamburger morphs to ×.
- **Custom cursor**: `dot + ring`, `mix-blend-difference`; ring scales & turns
  cyan over links/buttons; disabled on coarse pointers + reduced motion.
- **Buttons** — pills, magnetic (JS pull toward pointer).
  - `.btn-primary` — **cyan** fill, ink text; hover: `shadow-glow` + lift;
    focus ring white (visible on cyan).
  - `.btn-ghost` — transparent, hairline `border-fg/20`, mono text; hover:
    cyan border + soft cyan tint.
- **Cards** (products, features): `bg-surface/60 backdrop-blur-xl` glass,
  hairline `border-fg/10`, `shadow-card`; hover lifts, border warms to cyan,
  a pointer-follow spotlight sheen crosses the surface.
- **Hero** (`AidaAttention`): a full-viewport **Three.js canvas** of a living
  "stack" — thin translucent layers plus an orbiting particle field. Typography
  sits on top: mono badge, split-line mask-revealed headline (4 lines, last
  line italic cyan→violet gradient), magnetic CTAs, "SCROLL" indicator.
  Product marquee band pinned to the bottom between hairlines.
- **About** (`AidaInterest`): big statement revealed **word-by-word as you
  scroll** (scrubbed). Stack chips (Kubernetes, PostgreSQL…) stagger in. A
  dark "plate" image with parallax + a live signal card (23 products · 100% DE ·
  3 founders) that counts up on enter.
- **Products** (`ProductSection`): **pinned horizontal scroll** — the track
  drifts left with scroll (desktop). Glass cards: icon tile (floats on hover),
  title, desc, tags, price row, mono "Learn more". A scroll-progress hairline
  tracks the section. Mobile (≥1023px breakpoint flips): normal vertical grid.
- **Desire** (`AidaDesire`): three 3D-tilt feature cards with a cursor-follow
  spotlight; heading with cyan→violet gradient; `<DemoRequest>` in a glass
  panel. Background: faint aurora drift + ruled grid.
- **FAQ**: glass rows, hairline rules; open row's border warms to cyan, icon
  rotates 45°, answer expands (max-height transition — behavior unchanged).
- **Demo form**: glass card, `shadow-lift`, floating mono input with cyan focus
  ring; errors `text-red-400`; thank-you note in a cyan tint.
- **Footer**: `bg-base`, giant **outlined "WeStack"** wordmark (fades in on
  scroll) over a ruled grid; three editorial columns (brand, contact, team);
  mono labels; bottom legal bar. No photo, no aurora — type does the work.
- **Prose** (product detail, privacy): dark-markdown — muted body, Archivo
  headings, cyan links with 3px underline offset, cyan bullets, hairline rules.

---

## 6. Motion system

Motion is the product. Stack: **Lenis** (smooth scroll) → **GSAP +
ScrollTrigger** (storytelling) → **Three.js** (hero scene).

- **Smooth scroll**: Lenis lerp ~0.1, `gsap.ticker`-driven, fed to
  ScrollTrigger. Anchor links use `lenis.scrollTo`. Disabled when
  `prefers-reduced-motion` or coarse pointer on touch.
- **Preloader**: counter + wipe → dispatch `ws:ready`, hero plays its entrance.
- **Hero entrance**: after preloader, headline lines rise from masks with a
  stagger; badge/sub/CTAs fade in; WebGL stack eases to its settle pose.
- **Scroll reveal**: `.reveal` elements fade + rise + blur-in via
  ScrollTrigger (`y: 36, filter: blur(6px)` → none, stagger via
  `--reveal-delay`).
- **Word reveal**: the interest statement splits into masked words; ScrollTrigger
  scrub pulls them up word-by-word (the classic awwwards reading moment).
- **Pinned horizontal scroll**: products section pins ~200vh and scrubs the
  track horizontally; progress hairline syncs.
- **Interactions**: magnetic buttons (pull + spring), tilt cards (perspective
  transform, pointer-driven), spotlight sheen, marquee (existing 70s drift +
  hover pause), parallax on plate images (y scrub).
- **Grain + vignette**: film grain at ~4% over everything (pointer-events none);
  radial vignette darkens the edges — cinema depth.
- **Reduced motion**: everything above degrades to static content. No pinning,
  no Lenis, no cursor, no WebGL (or a static poster frame), `.reveal` forced
  visible. Noscript fallback forces all reveals visible + shows the hero
  without the canvas.

---

## 7. Three.js / WebGL direction (`src/scripts/hero-webgl.js`)

Hero-only, lazy-friendly, canvas mounted inside `AidaAttention`:

- **The Stack**: 6–8 thin `BoxGeometry` layers, slightly varied sizes, stacked
  vertically with gaps — a direct reading of the WeStack mark. Materials are
  near-transparent (MeshPhysicalMaterial, low opacity, `transmission: 0.1`) with
  bright cyan **edges** (LineSegments / EdgesGeometry) so the silhouette reads.
- **Particles**: ~1,200 points in a slow orbital shell, additive-blended,
  cyan/violet/amber weighted toward cyan; they drift and recycle.
- **Camera**: perspective, fog for depth. Pointer → stack parallax rotation
  (lerped); scroll velocity → subtle dolly.
- **Perf**: `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`,
  `powerPreference: "high-performance"`, animation paused when the section is
  off-screen (IntersectionObserver) and on `visibilitychange`/`pagehide`
  (`document.hidden`); full dispose on `astro:page-load` teardown.
- **Fallback**: no WebGL / reduced motion → static poster (CSS gradient grid),
  no JS errors.

---

## 8. Imagery direction

Dark, moody Unsplash plates — treated as **low-opacity smoked glass**: printed
into the scene with `mix-blend-screen` at 15–30%, under a gradient, so they
never fight the type or the WebGL.

| Location | Photo (ID) | Treatment |
|---|---|---|
| Hero (`AidaAttention`) | — (WebGL stack is the visual; no photo) | — |
| About (`AidaInterest`) | `photo-1558494949-ef010cbdcc31` — dark server corridor, cyan LEDs | `opacity-30 mix-blend-screen`, parallax, glass frame |
| Trust (`AidaDesire`) | `photo-1518709268805-4e9042af9f23` — dark abstract light | `opacity-12 mix-blend-screen` under aurora |
| Product detail (`ProductPage`) | `photo-1544197150-b99a580bb7a8` — dark rack | `opacity-15 mix-blend-screen` |
| Footer | — | No photo. Giant type + grid |

---

## 9. Accessibility notes (dark theme)

- All neutrals + cyan pass AA for their roles (see palette). `accent-soft` /
  `violet` are large-text or decorative.
- `color-scheme: dark` on `:root`; `<meta name="theme-color">` = `#07090e`.
- Focus: 2px cyan outline + 3px offset; primary (cyan-filled) button flips its
  ring to white so it stays visible.
- Grain + vignette are `pointer-events: none` and visually negligible
  (`opacity .04` / soft).
- `display=swap`, `antialiased`, `optimizeLegibility`; mono & display both ship
  latin-ext for umlauts.
- **Reduced motion** kills Lenis/GSAP/cursor/WebGL and pins nothing.
- Hairline borders never carry meaning alone — state changes always pair them
  with a color/glow/transform change.

---

## 10. Performance budget (awwwards sites must still be fast)

- One Google Fonts family (Archivo) + JetBrains Mono — two files.
- Three.js loads only in the hero module and only when WebGL + no reduced
  motion; bundle is deferred, canvas pauses off-screen.
- GSAP/Lenis share one global bundle (`src/scripts/site.js`) imported once in
  `Layout`; components reuse it (no per-component gsap copies).
- Remote Unsplash images are `loading="lazy"` except the hero plate; all
  `decoding="async"`.
- Target: < 2s to interactive on 4G, no layout shift (aspect-ratio on plates).

---

## 11. Implementation map

- Tokens + component classes: `src/styles/global.css` (single source of truth)
- Fonts + meta: `src/components/Head.astro` (font link; `theme-color #07090e`,
  `color-scheme: dark`; fix `512.512.png → 512x512.png` favicon typo; drop
  dead `/rss.xml` link)
- Global motion engine: `src/scripts/site.js` (Lenis + ScrollTrigger + cursor +
  magnetic + reveal + preloader coordination; guarded single init)
- WebGL hero: `src/scripts/hero-webgl.js` (Three.js scene, exported factory)
- Shell: `src/layouts/Layout.astro` (preloader markup, engine import,
  noscript)
- Components (structure untouched, skin + layout rebuilt): `Header`,
  `Footer`, `LanguageSwitcher`, `AidaAttention`, `AidaInterest`, `AidaDesire`,
  `ProductSection`, `ProductPage`, `FAQ`, `DemoRequest`, `i18n/MultiLineText`
- `public/manifest.json`: `theme_color`/`background_color` → `#07090e`
- Logo: `src/assets/images/logo.svg` re-inked to silver/cyan/violet
- i18n: add `preloader.*`, `hero.*` hint strings, `cursor` labels to
  `src/i18n/locales/{de,en}.json`

**Untouched by design**: routing, page files, AIDA anchors, content
collections, JSON-LD, the `/request-demo` POST endpoint, edge functions, FAQ
accordion behavior, noscript + reduced-motion guarantees.
