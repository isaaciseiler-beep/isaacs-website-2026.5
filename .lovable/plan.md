

## Photos Page — Location-Filtered Album Gallery

### What this is

A dedicated `/photos` route with a unique, editorially-crafted gallery. Albums grouped by location, with a location filter strip, stacked album cards, an expanded masonry view, and a keyboard-navigable lightbox. Every animation, spacing value, and typographic choice mirrors the existing site exactly.

### Design system alignment

The site uses a tight, consistent vocabulary I will follow precisely:

- **Easing:** `[0.16, 1, 0.3, 1]` for reveals, `[0.25, 0.1, 0.25, 1]` for text — never generic `ease-in-out`
- **Spacing:** `px-6` page padding, `gap-[3px]` between image tiles, `py-12` section padding
- **Typography:** `SectionHeading` component for headings (letter-by-letter blur reveal), `mono-text` class for labels (JetBrains Mono, 10px, tracking-widest, uppercase, 50% opacity)
- **Images:** Always `grayscale(100%)` by default, `grayscale(0%)` on hover with `duration-700`
- **Borders:** 0px radius everywhere (no rounding except pills)
- **Gradients:** Bottom-up `rgba(0,0,0,0.85)` overlays on images for text legibility
- **Edge fades:** `linear-gradient(to left, hsl(var(--background))...)` on scroll containers
- **Chevrons:** Same `chevronVariants` pattern with custom directional enter/exit
- **Parallax:** Wrap in `ParallaxSection` or use `useScroll`/`useTransform` scroll-linked motion

### Layout concept

**Filter strip** — Horizontal row of location pills at top. JetBrains Mono, uppercase, tracking-widest. "All" default. Active pill: `bg-foreground text-background`. Inactive: `border border-border text-foreground/50`. No rounded corners on pills (square, matching site's 0px radius). Animated underline on active using `layoutId` shared layout animation.

**Album grid (overview)** — 3-column grid (2-col tablet, 1-col mobile). Each album is a "stacked prints" card: a main cover image with 2 pseudo-layers behind it offset by 4px and 8px (using `::before`/`::after` or extra divs), creating depth. Cover is grayscale, full row is color on hover. Location name large, photo count in mono-text. Staggered reveal with the site's blur+y animation.

**Expanded album** — Clicking an album transitions (AnimatePresence) to a masonry-style view of that location's photos. Back button top-left. Photos stagger in with `delay: index * 0.04`. Each photo is a `grid-item` with the existing grayscale hover + overlay pattern.

**Lightbox** — Full-screen overlay, `bg-black/90`. Photo centered. Prev/next chevrons (same `chevronVariants`). ESC and arrow key navigation. Photo counter in mono-text. Smooth scale-in animation on open.

**"View All" link** — Added to the existing `PhotoSection` on the index page, styled as a `pill-button` linking to `/photos`.

### Data

Reuse the 4 existing photo assets (`photo-1` through `photo-4`) distributed across 6 location albums (Chicago, Brooklyn, Detroit, Brussels, Tokyo, Berlin). Each album gets 3-5 photos with titles. All data is static, defined in the component.

### Files

| File | Change |
|------|--------|
| `src/pages/PhotosPage.tsx` | **New** — Full page: filter strip, album grid, expanded view, lightbox |
| `src/App.tsx` | Add `/photos` route import and `<Route>` |
| `src/components/PhotoSection.tsx` | Add "View All →" pill-button link to `/photos` |

### Animation inventory (matching site exactly)

- Filter pill selection: `layoutId` spring for active indicator
- Album card reveal: `initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}` → `whileInView` with staggered delay
- Album hover: cover image `grayscale(0%)` + subtle `scale(1.02)` with `duration-700`
- View transition (overview → expanded): `AnimatePresence` with `mode="wait"`, fade + slight y-shift
- Photo grid stagger: `delay: index * 0.04, duration: 0.4`
- Lightbox enter: `scale: 0.95 → 1`, `opacity: 0 → 1`, duration 0.3
- Chevron arrows: identical `chevronVariants` from PhotoSection/NewsSection
- Back button: fade-in with slight x-shift

### Page structure

The page includes its own header (Logo + back arrow) matching the site's fixed header pattern, plus the same footer component. No sidebar needed on the photos page — clean, full-bleed experience.

