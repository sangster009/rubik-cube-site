# Rubik Solve

A mobile-friendly site to learn the 3×3 Rubik's cube step-by-step and follow **Micah**'s weekly algorithm videos. Supports email and RSS subscription.

## Stack

- **Next.js 16** (App Router), TypeScript, Tailwind CSS
- **shadcn/ui** for components
- **Resend** for email subscription (optional)
- Content: file-based JSON for weekly videos and solve steps

## Getting started

Run the dev server **from this project root** (`rubik-cube-site`) so routes resolve correctly:

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

Email subscription uses [Resend](https://resend.com). Configure it as follows:

1. **Copy env**
   - Copy `.env.example` to `.env`.

2. **Resend API key (required for subscription)**
   - Sign up at [resend.com](https://resend.com) and create an API key.
   - In `.env` set:
     - `RESEND_API_KEY=re_xxxxxxxx` (your key).

3. **Optional: Resend audience**
   - To store subscribers in a Resend audience (for broadcasts), create an audience in the Resend dashboard and set:
     - `RESEND_AUDIENCE_ID=xxxxxxxx`.

4. **Optional: Notification when someone subscribes**
   - You are notified at `sangbackyeo@gmail.com` on each new subscription. The notification is sent with the same Resend key.
   - By default the “From” address is Resend’s test sender. To use your own domain, add and verify it in Resend, then set:
     - `RESEND_FROM=Cubing with Micah <notify@yourdomain.com>`.

5. **Site URL**
   - Set `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://yoursite.com`) for RSS and links.

Without `RESEND_API_KEY`, the subscribe form returns “Email subscription is not configured”.

## Latest from Micah (YouTube channel)

To show your **YouTube channel’s recent uploads** in the “Latest from Micah” section instead of the static list:

1. Add to `.env`: **`NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxx`** (or `YOUTUBE_CHANNEL_ID`).
2. Find your channel ID: open your YouTube channel page → View Page Source → search for `browse_id` and copy the value, or use the ID from the URL `youtube.com/channel/UC...`.

Videos are loaded from YouTube’s public RSS feed (no API key). The list is cached for 1 hour. If the env var is not set, the section falls back to **`content/weekly/videos.json`**.

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
