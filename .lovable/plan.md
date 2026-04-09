## Changes

### 1. Hero → Featured spacing
Add bottom padding/margin to HeroSection to create more breathing room.

### 2. Section heading reveals (Projects, News, Photos, Inspiration)
Add a simplified letter-by-letter reveal animation (inspired by hero but toned down) to section headings using `whileInView` with framer-motion. Apply to the `section-heading` elements in each section.

### 3. Featured Section — Scroll-driven expansion + sequential colorization
- Use `useScroll` with the section as target to drive:
  - Frame expansion from current margins to full-width
  - Sequential grayscale→color on: top card, then bottom-right, then bottom-left
  - Shrink back to current footprint
- Make bottom two cards show permanent title/subtitle overlays (not hover-only)
- Add dark gradient overlays on bottom cards for text legibility

### 4. Inspiration Section — Fullscreen takeover + wind exit
- Use scroll-driven animation to expand to fullscreen
- Change background to light blue accent color
- On exit, animate pins with wind-blown effect (random x/rotation/opacity transforms)

### Files to modify:
- `src/components/HeroSection.tsx` — add bottom spacing
- `src/components/FeaturedSection.tsx` — major rework with scroll animations
- `src/components/InspirationBoard.tsx` — fullscreen + wind effect
- `src/components/ProjectsSection.tsx` — heading reveal
- `src/components/NewsSection.tsx` — heading reveal
- `src/components/PhotoSection.tsx` — heading reveal
