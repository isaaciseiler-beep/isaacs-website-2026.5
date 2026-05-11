# Welcome to your Lovable project

TODO: Document your project here

## Fulbright Map

The unlinked map page lives at `https://www.isaacseiler.xyz/fulbrightmap`. It is
a Vite/React route for sharing favorite spots in New Taipei with Mapbox markers,
image uploads, and optional Supabase persistence. It is intentionally not linked
from the primary site navigation.

### Required Mapbox token

Add a public Mapbox token before running the route:

```bash
VITE_MAPBOX_ACCESS_TOKEN=pk_your_token_here
```

`VITE_MAPBOX_TOKEN` is also accepted as a fallback.

### Optional Supabase persistence

Without Supabase values, the map runs in local browser mode and stores pins in
`localStorage`. For the collaborative live map, add both values:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

The database and storage setup has been migrated to
`supabase/fulbrightmap-schema.sql`.
