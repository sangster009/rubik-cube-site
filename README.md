# Rubik Solve

A mobile-friendly site to learn the 3×3 Rubik's cube step-by-step and follow **Micah**'s weekly algorithm videos. Supports email and RSS subscription.

## Stack

- **Next.js 16** (App Router), TypeScript, Tailwind CSS
- **shadcn/ui** for components
- **Resend** for email subscription (optional)
- Content: file-based JSON for weekly videos and solve steps

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding weekly algorithms

Edit **`content/weekly/videos.json`**. Add a new object:

- `id` – unique string
- `slug` – URL slug (e.g. `my-new-algorithm`)
- `title` – display title
- `youtubeId` – YouTube video ID (from the video URL)
- `publishedAt` – ISO date string (e.g. `2025-03-08T12:00:00.000Z`)
- `cubeType` – `"3x3"` (or `"3x3-oh"` when you add OH)
- `description` – optional short description
- `stepLabel` – optional, e.g. `"OLL"`, `"PLL"`, `"F2L"`

## Editing the solve guide

Edit **`content/solve/3x3/steps.json`** to change or add steps. Each step has:

- `order` – number for ordering
- `title` – step name
- `body` – explanation and algorithm notation
- `youtubeId` – optional YouTube ID for a “Watch” link

## Subscription (email)

1. Copy `.env.example` to `.env`.
2. Add your **Resend** API key: [resend.com](https://resend.com). Optionally set `RESEND_AUDIENCE_ID` to add subscribers to an audience.
3. Set `NEXT_PUBLIC_SITE_URL` to your production URL (for RSS links).

Without `RESEND_API_KEY`, the subscribe form will return a “not configured” error when submitting.

## RSS

The feed is at **`/feed.xml`**. Set `NEXT_PUBLIC_SITE_URL` so item links point to your real domain.

## Scaling to more cube types

- **3×3 OH / other cubes**: Add entries in `videos.json` with `cubeType: "3x3-oh"` (or `"4x4"`). You can later add filtering on the Weekly page and new solve guides under `content/solve/3x3-oh/`, etc.
- **New solve methods**: Add `content/solve/<cube>/steps.json` and a page at `app/solve/<cube>/page.tsx` using `getSolveSteps("<cube>")`.

## Build & deploy

```bash
npm run build
npm start
```

Deploy to Vercel (or any Node host); add the env vars above for production.
