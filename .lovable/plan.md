

## Problem

The section height is `350vh` but the animation only occupies a narrow band of `scrollYProgress` (~0.22–0.74). This creates a massive empty gap below the sticky content. The user scrolls through dead space and may miss the animation entirely.

The core math issue: `useScroll` with `offset: ["start end", "end start"]` means progress 0→1 spans `350vh + 100vh = 450vh` of scroll. The sticky content only fills `100vh`, so most of that scroll range is wasted space.

## Approach

Reduce section height to `200vh` and recalculate all keyframe positions to use the full progress range efficiently. The `200vh` height gives `300vh` total scroll travel (200 + 100 viewport), which means:

- **100vh** of scroll to bring section into view (progress 0→0.33)
- **100vh** of sticky scroll for the animation (progress 0.33→0.67) — this is where freeze, expand, colorize, contract all happen
- **100vh** of scroll to move section out (progress 0.67→1.0)

## Timeline (recalculated for 200vh)

```text
Progress  Phase
0.00–0.33  Section scrolls into view
0.33–0.40  FREEZE — all content visible, buffers intact, grayscale
0.40–0.48  EXPAND — padding/gap → 0, full bleed
0.44–0.48  Top card → color
0.48–0.52  Bottom-left → color  
0.52–0.56  Bottom-right → color
0.56–0.60  HOLD — full color, full bleed
0.60–0.67  CONTRACT — buffers return
0.67–1.00  Section scrolls out
```

## File changes

**`src/components/FeaturedSection.tsx`** — single file edit:

1. Change `height: "350vh"` → `height: "200vh"`
2. Update all `useTransform` keyframe arrays to match the new timeline above
3. Keep everything else (sticky container, BUFFER, layout, filters) exactly the same

