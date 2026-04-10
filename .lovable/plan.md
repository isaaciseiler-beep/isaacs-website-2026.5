

## Inspiration Board — First-Person Explorer

### Concept

A first-person walking experience inside a dark gallery/warehouse space rendered on a 2D canvas with pseudo-3D perspective (raycasting-style or simple perspective projection). The player moves forward/backward and turns left/right with arrow keys, exploring a room containing CRT TVs, corkboards, and objects displaying inspiration content. Black and white aesthetic with site accent color (#c8d7df) for highlights.

Think: Wolfenstein-era first-person renderer meets a lo-fi art gallery.

### How it works

**Rendering**: Simple raycasting engine (like Wolfenstein 3D) drawn on a `<canvas>`. Walls rendered as vertical strips based on ray-wall intersection distances. Objects (TVs, corkboards) rendered as sprites at their world positions, scaled by distance.

**Controls**: Arrow Up/Down = move forward/backward. Arrow Left/Right = rotate view. When facing an object within interaction range, a prompt appears ("Press E"). Pressing E opens a styled overlay with the content.

**World**: A small enclosed room (~12x12 grid). Walls are white lines on black. Floor has a subtle grid. Objects placed around the room:
- 3 CRT TVs on walls showing images (with scanline effect)
- 2 corkboards with pinned quotes
- 1 desk with a notebook (personal note)
- 2 magazine stands (links)

**Visual style**: 
- Black background, white wireframe walls (or filled with subtle gradient)
- Scanlines over TVs, static noise when idle
- Accent color (#c8d7df) for interaction prompts, TV glow, pushpin heads
- Retro bitmap-style font for HUD text

**Content overlay**: When interacting with an object, a modal appears over the canvas showing the full content (image, quote, link) using existing site design tokens. Escape or click to close.

**Mobile**: Touch controls — left side drag = turn, right side tap = move forward, double-tap = interact. Or a simple on-screen D-pad + action button.

### Technical approach

- Single file rewrite: `src/components/InspirationBoard.tsx`
- Pure canvas raycasting — no libraries. ~300-400 lines
- Map defined as a 2D array (0 = empty, 1 = wall)
- Player state: x, y, angle, updated each frame
- Rays cast from player angle across FOV (~60°), one per canvas column
- Sprites sorted by distance, drawn after walls
- Images preloaded via `new Image()`
- `requestAnimationFrame` loop, cleanup on unmount
- Canvas sized via ResizeObserver to fill container
- Same sticky/scroll section wrapper and SectionHeading

### Files changed

| File | Change |
|------|--------|
| `src/components/InspirationBoard.tsx` | Full rewrite — first-person raycasting engine |

