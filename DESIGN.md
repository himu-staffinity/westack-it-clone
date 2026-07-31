# WeStack — Design System: "Warm Editorial Premium"

> Source of truth for the 2026 redesign of westack-it.eu.
> This document describes *what* the site should look and feel like and *why*.
> The single implementation lives in `src/styles/global.css` (`@theme` tokens +
> `@layer components`), with Tailwind utility classes used throughout markup.

---

## 1. Concept statement

WeStack is a German managed-infrastructure provider: **sovereign, careful,
European, done properly**. The old design dressed that in "enterprise tech"
language — near-black surfaces, cyan glow, glassmorphism, aurora blobs.

The redesign speaks the same truth in a different register: **warm editorial
premium**. Think the paper-stock pages of a quality print journal — Kinfolk,
Monocle, a well-set German *Wirtschaftsmagazin* — rather than a SaaS dashboard.
Cream and ivory grounds, espresso ink, one confident muted gold. Serif display
type with real character, mono labels that feel set by hand, hairline rules
instead of glows, photographs printed into the page like plates.

The message: *we are infrastructure you can trust, run by people you can
read.* Calm, legible, quietly expensive. Not dark. Not cyan. Not glass.

### Mood & inspiration

- Cream/ivory paper stocks, warm sand sections, espresso ink text
- Fraunces serif (soft, "wonky", characterful) — magazine-grade headlines
- Muted bronze-gold used sparingly: eyebrows, hairlines, the CTA, italic accents
- Hairline borders (`1px`) and soft warm shadows — never colored glows
- Photographs treated as **printed plates**: faint, warm, multiply-blended
- Film-grain paper texture at ~5% for a non-flat, tactile finish

---

## 2. Color palette (`@theme` tokens)

All contrast ratios are computed on the page ground `--color-paper` (`#faf6ec`)
unless noted. Target: WCAG AA (≥ 4.5:1 for normal text, ≥ 3:1 for large text).

| Token | Hex | Use | Contrast on paper |
|---|---|---|---|
| `--color-paper` | `#faf6ec` | Page background (warm ivory) | — |
| `--color-base` | `#f2ebdd` | Alternating section ground (warm sand) | — |
| `--color-surface` | `#fffdf6` | Cards, plates, form wells (near-white) | — |
| `--color-raised` | `#ece2cd` | Inset icon wells, tinted panels | — |
| `--color-ink` | `#1f1810` | Deepest espresso: buttons, active pill, logo | ~15:1 (vs cream) |
| `--color-fg` | `#241d13` | Primary text | **12.0:1** |
| `--color-muted` | `#5f5340` | Secondary text | **6.6:1** |
| `--color-faint` | `#7a6c52` | Tertiary text (labels, meta) | **4.6:1** |
| `--color-accent` | `#8a6327` | Bronze-gold: eyebrows, links, borders, CTA fill | **5.0:1** |
| `--color-accent-soft` | `#c9a05c` | Light gold: tints, decorative washes (not text) | 2.4:1 |
| `--color-violet` | `#b06a3f` | Terracotta: secondary warm accent (gradient end) | 3.8:1 |
| `--color-cream` | `#f5eedd` | Text on dark fills (buttons, active pill) | 4.6:1 on gold |

### Rationale

- **Gold is the accent, not the ground.** `#8a6327` is a *deep* bronze-gold —
  dark enough to pass AA for small uppercase mono eyebrows, warm enough to feel
  like a printed foil. `--color-accent-soft` stays for tinted washes only.
- **Espresso ink (`#1f1810`) does the heavy lifting** — buttons, the active
  language pill, the logo wordmark. Cream text on it reads at ~15:1.
- **Tiered neutrals do hierarchy**: `fg → muted → faint` all pass AA, so the
  light theme never sacrifices legibility for atmosphere.
- **Terracotta (`--color-violet`, repurposed)** is the only second accent, used
  as the warm end of the hero-headline gradient and nowhere informational.

### Hardcoded old-theme colors — removed

All `#05070d`-family darks, cyan `#3fe0ff`/`#29b8ff`, violet `#8b7cff`, glass
whites (`rgba(255,255,255,…)` borders) and the stale `#2583bf`/`#cf388a` logo
fills are gone. The logo is re-inked: `#f2f4f6 → #1f1810`,
`#2583bf → #8a6327`, `#cf388a → #b06a3f`.

---

## 3. Typography system

| Role | Family | Google Fonts axis | Notes |
|---|---|---|---|
| Display | **Fraunces** | `ital,opsz,wght@0,9..144,300..700;1,9..144,300..700` | Variable serif, latin-ext. Optical sizing keeps small headings crisp. Italic is used for accent lines. |
| Body | **Hanken Grotesk** | `wght@300;400;500;600;700` | Warm humanist grotesk, latin-ext. Sets comfortably at 16–20px. |
| Mono / labels | **Space Mono** | `wght@400;700` | Latin-ext. Eyebrows, chips, price meta, marquee labels. |

All three families ship a **latin-ext subset** (umlauts ä ö ü ß render
cleanly; German is the default locale).

Google Fonts link (replace the Space Grotesk / IBM Plex block in
`Head.astro`):

```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Hanken+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap
```

### Type scale

| Element | Spec |
|---|---|
| Hero h1 | Fraunces 500, `clamp` 3rem→4.5rem, leading 1.02, tight tracking; last line italic + gold→terracotta gradient |
| Section h2 | Fraunces 500, 2.25–3rem, leading 1.08 |
| Card titles | Fraunces 500, 1.25rem |
| Eyebrows | Space Mono 400, 11px, uppercase, tracking 0.28em, gold |
| Body | Hanken Grotesk 400, 16–20px, line-height 1.7 |
| Mono meta | Space Mono, 10–12px, tracking-wider, muted/faint |

**Tone**: headings never use bold 700 — weight 500 with Fraunces' quirky
counters reads more expensive than weight 700.

---

## 4. Spacing / radii / shadows / borders

- **Spacing**: Tailwind default scale; sections breathe at `py-28`; internal
  gaps 5–7. Editorial whitespace is a feature, not a bug.
- **Radii** (deliberately restrained — no glass, no glow):

| Token | Value | Applied to |
|---|---|---|
| `--radius-card` | `1rem` | Cards, form wells, plates |
| `--radius-well` | `0.75rem` | Icon wells, tags |
| (default) | `9999px` | Buttons, pills, language switcher |

- **Shadows** (warm, ink-based — never colored):

| Token | Value | Applied to |
|---|---|---|
| `--shadow-card` | `0 1px 2px rgba(31,24,16,.05), 0 10px 28px -18px rgba(31,24,16,.25)` | Resting cards |
| `--shadow-lift` | `0 24px 55px -28px rgba(31,24,16,.4)` | Card hover, aside, form |
| `--shadow-plate` | `0 30px 60px -30px rgba(31,24,16,.45)` | Hero/interest photo plate |

- **Borders**: hairline `1px`, ink at 8–15% (`border-ink/10`, `border-ink/15`);
  gold replaces it on hover/active (`border-accent/50`). Section rhythm uses
  `border-t/border-y border-ink/10` rules.

---

## 5. Component language

- **Header**: translucent ivory (`bg-paper/85` + `backdrop-blur-md`), hairline
  bottom rule. On scroll → solid paper + soft warm shadow (JS `.scrolled`).
  Wordmark: Fraunces 500. Nav links: muted → espresso with a gold underline
  that slides in (`.nav-link::after`). Mobile menu: full-screen ivory, links in
  Fraunces 1.75rem — like opening a journal's contents page.
- **Buttons**: pill shapes kept (they're the brand's), glow removed.
  - `.btn-primary` — **bronze-gold fill**, cream text, hairline espresso ring;
    hover deepens and lifts, focus ring flips to espresso so it's visible on gold.
  - `.btn-ghost` — transparent, hairline espresso border; hover fills 8% gold
    tint, border + text go gold.
- **Cards** (product grid, desire features): solid `bg-surface` paper, hairline
  `border-ink/10`, `shadow-card`; hover lifts with `shadow-lift` and the
  hairline warms to `border-accent/50`. No blur, no glow, no backdrop-filter.
- **Hero**: typographic, not photographic — the photo sits *under* the ink at
  low opacity with `mix-blend-multiply` (printed-into-paper effect), a soft
  ivory gradient, and a faint ruled grid. Gold live-badge dot (static — no ping).
- **Marquee**: solid sand band between hairline rules; product names in
  Fraunces italic, icons muted, gold diamond separators. Same 70s drift,
  pauses on hover.
- **FAQ**: paper rows with hairlines; the open row's border warms to gold and
  the icon ring rotates 45° (unchanged behavior, new skin).
- **Demo form**: paper card, hairline border, `shadow-lift`; espresso input
  with gold focus ring; errors in `text-red-700`; thank-you note in a gold tint.
- **Language switcher**: hairline pill; active = **espresso fill + cream text**
  (unmissable on ivory), inactive = muted, hover espresso.
- **Footer**: warm sand ground, hairline top rule, three editorial columns,
  small print in faint. No photo, no aurora.
- **Prose** (`product detail`, privacy): muted body, Fraunces headings, gold
  links with 3px underline offset, gold list bullets, hairline rules.

---

## 6. Motion

The old aurora blobs are gone. Motion is now quiet and editorial:

- **Page load / scroll reveal**: keep the IntersectionObserver `.reveal` —
  elements rise 20px with a 0.7–0.8s ease-out; `--reveal-delay` staggers rows.
- **Hero image**: very slow 26s alternate pan (`animate-hero-pan`) — a
  photographer's pull-back, not a tech parallax.
- **Marquee**: unchanged behavior (70s linear drift, hover pause).
- **Interactions**: hover lifts (cards, buttons) at 0.3s spring-ish ease;
  gold hairlines/underlines cross-fade.
- Everything is killed by the existing `prefers-reduced-motion` block, and the
  noscript `.reveal` fallback stays.

---

## 7. Imagery direction

Remote Unsplash URLs, treated as **printed plates**: low opacity +
`mix-blend-multiply` so dark/warm photos tint the ivory page instead of
competing with it.

| Location | Photo (ID) | Treatment |
|---|---|---|
| Hero (`AidaAttention`) | `photo-1497366216548-37526070297c` — bright warm office light (replaces dark server corridor) | `opacity-30 mix-blend-multiply`, eager + fetchpriority, slow pan, ivory gradient overlay |
| About (`AidaInterest`) | `photo-1531482615713-2afd69097998` — people collaborating (kept) | Full-color editorial plate: paper frame, hairline, `shadow-plate`, caption chip |
| Trust (`AidaDesire`) | `photo-1486406146926-c627a92ad1ab` — glass architecture in golden light (replaces blue earth) | `opacity-15 mix-blend-multiply` under sand ground |
| Product detail (`ProductPage`) | `photo-1497366216548-37526070297c` (hero family, consistency) | `opacity-20 mix-blend-multiply` |
| Footer | — | **No photo.** Sand ground, hairline rules |

---

## 8. Accessibility notes (light theme)

- All neutrals + the bronze gold meet WCAG AA for their text roles
  (see palette table). `accent-soft` is decorative-only (2.4:1).
- `color-scheme: light` is set on `:root` so form controls, scrollbars and
  UA widgets render light; `<meta name="theme-color">` matches `paper`.
- Focus: 2px gold outline + 3px offset globally; the gold-filled primary
  button flips its focus ring to espresso.
- Grain overlay stays `pointer-events: none` at ~5% — tactile, not noisy.
- Fonts load with `display=swap`; no FOIT. `-webkit-font-smoothing:
  antialiased` + `text-rendering: optimizeLegibility` for clean serif edges.
- `prefers-reduced-motion: reduce` disables pan/marquee/reveal animations and
  sets `scroll-behavior: auto`.
- Hairline borders never carry meaning alone — state changes always pair them
  with a color/shadow/transform change.

---

## 9. Implementation map

- Tokens + component classes: `src/styles/global.css` (single source of truth)
- Fonts + meta: `src/components/Head.astro` (replace font link; theme-color
  `#faf6ec`, `color-scheme: light`; fix `512.512.png → 512x512.png` favicon typo)
- Shell: `src/layouts/Layout.astro` (body ground `bg-paper`, cream-on-espresso
  skip link)
- Components: `Header`, `Footer`, `LanguageSwitcher`, `AidaAttention`,
  `AidaInterest`, `AidaDesire`, `ProductSection`, `ProductPage`, `FAQ`,
  `DemoRequest`, `i18n/MultiLineText` (structure untouched)
- `public/manifest.json`: `theme_color`/`background_color` → `#faf6ec`
- Logo: `src/assets/images/logo.svg` re-inked to ink/gold/terracotta

**Untouched by design**: routing, page files, AIDA anchors, content
collections, i18n string structure, JSON-LD, the `/request-demo` POST
endpoint, accordion/marquee/reveal behavior, reduced-motion + noscript
fallbacks.
