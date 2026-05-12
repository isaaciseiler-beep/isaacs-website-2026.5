# Welcome to your Lovable project

TODO: Document your project here

## Website AI Assistant

The chat assistant uses Vercel Serverless Functions in `api/chat.ts` and reads
Markdown grounding files from `knowledge/` at request time.

### Local setup

Create a local env file:

```bash
cp .env.example .env.local
```

Then set:

```bash
OPENAI_API=sk-your-openai-api-key
```

`OPENAI_CHAT_MODEL` is optional. If it is not set, the API uses the default in
`api/chat.ts`.

Run the site with Vite. Local dev mounts `/api/chat` through the Vite server:

```bash
npm run dev
```

Then open the local URL and test the chat with prompts like:

- `Who is Isaac?`
- `What is Isaac's AI work?`
- `How can I contact Isaac?`
- `Tell me about the Fulbright educator lab.`

### Production setup

In Vercel, add these project environment variables:

```bash
OPENAI_API=sk-your-production-key
OPENAI_CHAT_MODEL=gpt-4.1-mini
```

After deploying, verify that the chat answers from public knowledge, refuses or
redirects private/sensitive questions, and uses careful wording for current or
OpenAI-related claims.

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

### Required Supabase persistence for shared pins

Without Supabase values, the map runs in local browser mode and stores pins in
`localStorage`. For the collaborative live map, add both values:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

These are Vite build-time variables. On Vercel, add them to the project
environment variables and redeploy; a deployment built without them will always
show "Local browser mode" and pins will not sync between users.

The database and storage setup has been migrated to
`supabase/fulbrightmap-schema.sql`.
