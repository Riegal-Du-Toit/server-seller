# Server Selling

Astro + TypeScript startup project with React components and shadcn-compatible setup for 21st.dev components.

## Commands

```bash
npm install
npm run dev
npm run build
npm start
```

`npm start` serves the production site and the demo-request API. Requests are saved to `.data/demo-requests.jsonl` by default. Copy `.env.example` into your hosting provider's environment settings to enable sales and customer email, a scheduling link, and an optional CRM webhook. For production, mount `DEMO_DATA_DIR` on persistent storage and back it up. Set `TRUST_PROXY=true` only when the app is behind a trusted reverse proxy that replaces `X-Forwarded-For`.

## 21st.dev Components

This project includes `components.json`, path aliases, Tailwind, React, and shadcn-style primitives.

Install a 21st.dev component with:

```bash
npx shadcn@latest add "https://21st.dev/r/<author>/<component>?api_key=$API_KEY_21ST"
```

Example discovered from 21st.dev:

```bash
npx shadcn@latest add "https://21st.dev/r/efferd/pricing?api_key=$API_KEY_21ST"
```
