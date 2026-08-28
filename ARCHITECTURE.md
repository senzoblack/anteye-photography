# Ant‑Eye Studio Website — Architecture

## 1. Overview

A single-page, static marketing site for Ant‑Eye Studio, a photography practice based in Durban working across South Africa. Built as one self-contained HTML file — no build step, no backend, no framework. Structure and visual language are modeled loosely on the "Photographer X" Webflow template, adapted to a custom dark/darkroom aesthetic.

| | |
|---|---|
| **Type** | Single-page application (SPA) via anchor-link navigation |
| **Stack** | HTML5, vanilla CSS, vanilla JavaScript |
| **Dependencies** | Google Fonts (CDN) only — no JS libraries, no CSS frameworks |
| **Backend** | None (contact form uses `mailto:`; Instagram feed is static placeholder) |
| **File count** | 1 (`index.html`) — all CSS and JS are inlined |

---

## 2. File Structure

```
anteye-photography/
├── index.html        # Clean semantic markup and section architecture
├── styles.css        # Modular design system, typography, components, and media queries
├── main.js           # Navigation, scroll reveals, contact mailto builder & Three.js particle hero
├── images/           # Studio photography portfolio assets
└── ARCHITECTURE.md   # System architecture and technical documentation
```

---

## 3. Page Structure (Section Map)

The page is one long scroll, stitched together with anchor links (`#work`, `#services`, etc.) in the fixed nav. Sections are numbered in the UI (`01 —`, `02 —`...) to reinforce a "contact sheet" feel.

```
<header>                  Fixed nav — logo + anchor links, blend-mode "difference"

<section class="hero">              Full-height intro: headline, sub-copy, CTA,
                                     photo collage, shutter-iris intro animation

<section id="work">        [01]     Portfolio gallery — masonry-style grid,
                                     hover reveals EXIF-style caption + location/date

<section id="services">    [02]     4-column services grid (Portraiture, Editorial,
                                     Brand, Events & Travel)

<section id="clients">     [03]     Infinite auto-scrolling logo marquee (client logos)

<section id="feed">        [04]     Instagram teaser grid + "Follow on Instagram" link

<section id="about">       [05]     Studio bio, portrait image, stats row

<section id="testimonials">[06]     3-column client quote cards

<div class="cta-band">              Full-width banner strip → links to #contact

<section id="contact">     [07]     Contact details + booking enquiry form

<footer>                            Copyright, social links, quick nav
```

---

## 4. Component Breakdown

### 4.1 Navigation (`<header>`)
- Fixed position, `mix-blend-mode: difference` so it stays legible over any background.
- Anchor links scroll smoothly (`html { scroll-behavior: smooth }`) to each section id.
- No mobile hamburger menu yet — nav links are hidden below 860px (see §6 Known Gaps).

### 4.2 Hero (`.hero`)
- Two-column grid: copy block (`.hero-copy`) + photo collage (`.hero-collage`).
- **Shutter-iris intro**: an SVG of 6 triangular "blades" animates open on load (`.iris`, `@keyframes bladeSpin/irisOpen`), mimicking a camera aperture opening to reveal the page.
- `.hero-collage` is a manually staggered 2×2 image grid (one column offset via `transform: translateY(8%)`) — not a real carousel, just a static layout.
- CTA buttons: primary (`Book a session` → `#contact`) and a text link to Instagram.

### 4.3 Work / Gallery (`#work`)
- CSS Grid with manually assigned `grid-column: span N` per item to create an asymmetric editorial layout (not auto-generated — adding/removing photos requires adjusting spans).
- Each `.g-item` reveals a `.g-caption` on hover: title, location + date, and mock EXIF data (aperture/shutter/ISO) styled in monospace.
- Images are hotlinked from Unsplash placeholders — **not** the studio's real work.

### 4.4 Services (`#services`)
- 4-column grid (`.services-grid`) using a 1px background gap trick to create hairline dividers between cards.
- Static content; each card = number, title, one-line description.

### 4.5 Clients Marquee (`#clients`)
- `.logo-track` is a flex row of `.logo-item`s, duplicated once so the CSS `@keyframes marquee` (translateX 0 → ‑50%) loops seamlessly.
- Pauses on `:hover`.
- Currently **text-based placeholder logos** (e.g. "NORTHSHORE MEDIA") — needs real client logo images.
- Masked at the edges (`mask-image: linear-gradient(...)`) for a soft fade rather than a hard cut-off.

### 4.6 Instagram Feed (`#feed`)
- Static 6-image grid styled to look like an Instagram grid, plus a "Follow on Instagram" button linking to `https://www.instagram.com/_anteye/`.
- **Not a live feed** — Instagram blocks scraping and has no public unauthenticated API. A real live feed needs the Instagram Graph API (Business account + token) or a third-party embed service (e.g. SnapWidget, Elfsight, Behold.so).

### 4.7 About (`#about`)
- Two-column: framed portrait image + bio copy + a 3-stat row (years shooting / sessions delivered / continents worked).
- All bio/stat content is placeholder and should be replaced with real studio facts.

### 4.8 Testimonials (`#testimonials`)
- 3-column card grid, each with a quote, avatar image, name, and context line.
- Content is fabricated placeholder — needs real client quotes (with permission).

### 4.9 CTA Band
- A plain full-width `<div>` (not a `<section>`), sits between Testimonials and Contact as a secondary conversion point.

### 4.10 Contact (`#contact`)
- Two-column: static contact details (email, Instagram, location) + a booking enquiry form.
- **Form behavior**: JS `submit` handler intercepts the form, builds a `mailto:` link from the field values, and redirects the browser to the visitor's email client with the message pre-filled. **No data is sent anywhere automatically** — the visitor must actually hit "send" in their own mail app.
- Fields: name, email, shoot type (`<select>`), preferred date, message.

### 4.11 Footer
- Copyright line + Instagram/Email/Work quick links.

---

## 5. Design System

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0d0d0c` | Page background |
| `--bg-soft` | `#141312` | Card/hover backgrounds |
| `--paper` | `#f2ece1` | Primary text |
| `--paper-dim` | `#c9c2b4` | Secondary/italic text |
| `--stone` | `#8a8680` | Muted/meta text |
| `--accent` | `#8c2f26` | Buttons, active states |
| `--accent-bright` | `#b5432f` | Hover states, highlights |
| `--line` | `rgba(242,236,225,0.12)` | Hairline borders/dividers |

**Typography:**
- `Fraunces` (serif, variable) — headlines, section titles, italic accents
- `Inter` — body copy
- `JetBrains Mono` — labels, nav, EXIF-style metadata, buttons

**Motion:**
- Scroll-triggered fade/slide-up via `IntersectionObserver` on any element with `[data-reveal]`
- Hover-driven image zoom + desaturation lift (grayscale → color) across gallery, Instagram grid, and collage
- Marquee auto-scroll for client logos
- One-time shutter-iris animation on page load

---

## 6. Known Gaps / Placeholder Content

These are called out explicitly so nothing gets mistaken for production-ready:

1. **All photography is Unsplash stock** — hero collage, gallery, Instagram grid, about portrait, testimonial avatars. Needs the studio's real work.
2. **Instagram feed is static**, not live-synced. Needs Graph API + token, or an embed widget service.
3. **Client logos are text placeholders**, not real logo marks.
4. **Testimonials, stats, and bio copy are fabricated** and need replacing with real client quotes and facts.
5. **Contact form has no backend** — it only opens a pre-filled `mailto:`. To collect submissions directly (and avoid relying on the visitor's mail client), it needs a form backend (Formspree, Netlify Forms, or a custom endpoint).
6. **No mobile nav menu** — nav links simply disappear under 860px width; there's no hamburger/drawer replacement yet.
7. **No SEO metadata** — missing `<meta description>`, Open Graph tags, favicon, and structured data (`LocalBusiness`/`Photographer` schema would help local search in Durban).
8. **No analytics** — no visit tracking, form-conversion tracking, etc.
9. **Single page only** — no dedicated Album/Gallery detail pages, blog, or store, unlike the reference template.

---

## 7. Recommended Evolution Path

If/when this grows past a one-page brochure site:

1. **Split files**: extract `<style>` → `styles.css`, `<script>` → `main.js`, keep `index.html` markup-only.
2. **Real Instagram sync**: connect Instagram Graph API (requires Business/Creator account) or drop in an embed widget for a low-effort live feed.
3. **Form backend**: swap the `mailto:` handler for a POST to Formspree/Netlify Forms/custom serverless function, with a proper success/error state in the UI instead of leaving the page.
4. **Content management**: if the studio wants to update galleries/testimonials without touching code, move to a lightweight static-site generator (Astro/Eleventy) or headless CMS (Sanity/Contentful) feeding this same design.
5. **Multi-page structure** (mirroring the reference template): `/`, `/about`, `/albums`, `/album/:slug`, `/contact` — useful once the gallery grows beyond a single teaser grid and needs full case studies per shoot.
6. **Performance**: self-host/optimize images (currently hotlinked, unoptimized Unsplash URLs), add `loading="lazy"` to below-the-fold images, and add a proper favicon + OG image for link previews.
