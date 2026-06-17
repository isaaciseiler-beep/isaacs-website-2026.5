# Isaac Seiler Portfolio

Personal portfolio for [Isaac Seiler](https://isaacseiler.xyz), built to present work across AI, public technology, communications, journalism, research, and Fulbright projects.

![Isaac Seiler portfolio preview](public/webpreview-linkedin.png)

## What This Site Includes

- A fast React portfolio homepage with animated sections and responsive navigation.
- Project case studies covering AI governance, local journalism, public-sector research, communications strategy, and reporting.
- A grounded AI assistant that answers from local knowledge files in `knowledge/`.
- Photo and map routes for visual work and location-based storytelling.
- SEO assets, sitemap files, Open Graph previews, `llms.txt`, and structured metadata.

## Tech Stack

- React 18, TypeScript, Vite
- Tailwind CSS and shadcn/ui primitives
- Framer Motion for interaction and page transitions
- Vercel Serverless Functions for API routes
- OpenAI API for the site assistant
- Mapbox GL for map experiences
- Supabase for optional shared Fulbright map persistence
- Vitest and Testing Library for focused tests

## Local Development

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Start the dev server:

```bash
npm run dev
```

Then open the local Vite URL printed in your terminal.

## Environment Variables

The core portfolio runs without API keys. The AI assistant and map routes need optional environment variables.

### AI Assistant

```bash
OPENAI_API=sk-your-openai-api-key
OPENAI_CHAT_MODEL=gpt-4.1-mini
```

`OPENAI_CHAT_MODEL` is optional. If it is not set, the API uses the default in `api/chat.ts`.

The assistant uses Vercel Serverless Functions in `api/chat.ts` and reads grounding files from `knowledge/` at request time. Useful local test prompts:

- `Who is Isaac?`
- `What is Isaac's AI work?`
- `How can I contact Isaac?`
- `Tell me about the Fulbright educator lab.`

## Scripts

```bash
npm run dev       # Start local development
npm run build     # Build production assets and generated project previews
npm run preview   # Preview the production build
npm run test      # Run Vitest tests
npm run lint      # Run ESLint
```

## Deployment

The site is designed for Vercel. Production deployments should include the same environment variables listed above when AI assistant or shared map behavior is enabled.

After deploying, verify:

- The homepage loads quickly on mobile and desktop.
- Project pages render their case-study content and preview assets.
- The chat answers from public knowledge and redirects private or sensitive questions.
