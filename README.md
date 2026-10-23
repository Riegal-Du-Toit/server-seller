# Kervox

Kervox is an Astro landing site with a compact qualification journey and a live calendar-booking flow.

## Commands

```bash
npm install
npm run dev
npm run build
npm start
```

## Production booking

The public booking interface calls three Vercel Functions:

- `GET /api/localisation` reads Vercel's country header and the browser timezone to select a local currency display and default appointment timezone.
- `GET /api/booking/availability` fetches real available times.
- `POST /api/booking/confirm` creates the calendar event, sends the calendar provider's invitation, and optionally notifies the CRM webhook.

It uses Cal.com's API v2, keeping the provider API key on the server. Create a Kervox event type in Cal.com, connect the host's calendar and video provider, then configure these Vercel environment variables for both Preview and Production:

```
CAL_API_KEY=cal_live_...
CAL_EVENT_TYPE_ID=123
STARTING_PRICE_ZAR=25000
```

The event type must allow the two session lengths offered by the site (30 and 45 minutes). Cal.com owns the calendar conflict checks and the invitation; the booking context is attached as event metadata.

The journey displays a compact `From` price in the visitor's currency and allows them to change their timezone. Before paid traffic, replace the initial rounded estimates with approved regional prices. Supabase is the intended source of truth for that regional price table and conversion-rate snapshots.

Optionally configure `CRM_WEBHOOK_URL` and `CRM_WEBHOOK_TOKEN` to receive a completed booking payload. Configure Vercel WAF rate limiting for `/api/booking/*` before opening the form to paid traffic.

`npm start` remains a local static-server preview with the legacy demo-request endpoint. For local testing of Vercel Functions, use `vercel dev` after linking the project and pulling the environment with `vercel env pull`.

## 21st.dev Components

This project includes `components.json`, path aliases, Tailwind, and shadcn-style primitives.

```bash
npx shadcn@latest add "https://21st.dev/r/<author>/<component>?api_key=$API_KEY_21ST"
```
