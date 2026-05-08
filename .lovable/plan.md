## Goal

Wire the 13 Cloudflare R2 albums into the Photos portfolio and the home page rotating preview, replacing the current placeholder data.

## Source

Base: `https://pub-9c24f6ce599b4e09bac5241fc8f8beb0.r2.dev`

Albums (folder → display name → continent):
- `Australia` → Australia → Oceania
- `GranCanaria` → Canary Islands → Europe
- `HongKong` → Hong Kong → Asia
- `Iceland` → Iceland → Europe
- `Indonesia` → Indonesia → Asia
- `Japan` → Japan → Asia
- `Korea` → Korea → Asia
- `NewZealand` → New Zealand → Oceania
- `Portugal` → Portugal → Europe
- `Taiwan` → Taiwan → Asia
- `TaiwanStrait` → Matsu → Asia
- `Thailand` → Thailand → Asia
- `Vietnam` → Vietnam → Asia

## Changes

1. **New file `src/lib/photoAlbums.ts`** — single source of truth.
   - Export `R2_BASE` constant.
   - Export `albums: Album[]` with `{ folder, location, continent, photos: string[] }`, where each photo is just the filename. A helper builds full URLs via `` `${R2_BASE}/${folder}/${file}` ``.
   - Export `allPhotos` flat list and `coverFor(album)` (first photo).

2. **`src/pages/PhotosPage.tsx`**
   - Import albums from the new file; remove the local `photo1..4` placeholder imports and the hardcoded `albums` array.
   - Continent filter list becomes `["All", "Asia", "Europe", "Oceania"]` (drop "North America" since no albums there).
   - `AlbumCover` and the album detail grid keep current layout/animations; just consume the new data.
   - `FeaturedHero` (top of page) sources its 5 images from a curated picks array (e.g., one striking shot from Iceland, NZ, Japan, Taiwan, Australia).
   - Eager preload list switches to the curated hero picks + each album's cover only (avoid preloading 130+ images).

3. **`src/components/PhotoSection.tsx`** (home preview)
   - Replace the 12-photo placeholder array with ~12 curated picks pulled from `albums` (one or two per album), preserving the staggered hover cycle.

4. **`src/components/FeaturedSection.tsx`** (3-tile featured block on home)
   - The two thumbnails currently labeled "Projects archive" and "Photo portfolio" use `featuredProjects[1]/[2]`. The Photo portfolio tile's image should switch to a strong picture from the new R2 set so it visually represents photos.

5. **Cleanup**
   - Leave `src/assets/photo-1..4.jpg` in place (they're still used elsewhere — InspirationBoard images aren't, but other components may reference them; will only remove imports that become unused to keep the diff tight).

## Notes

- Filenames stay URL-safe as-is (uppercase hex + underscores, no spaces) so no encoding needed.
- All images render through existing grayscale → color hover treatment; no styling changes.
- If you later want a different cover per album or a custom display order, we can add `cover` and `order` fields to `photoAlbums.ts` without touching components.
