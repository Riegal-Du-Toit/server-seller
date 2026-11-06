# Kervox Seller

Kervox Seller is the public Astro marketing site for Kervox.

- **Explore Plans** opens the protected Kervox Packages sign-in page at `https://www.kervox.dev/packages`.
- **Book a Demo on WhatsApp** opens a prefilled WhatsApp message to the Kervox team.
- Localised starting prices are supplied by `api/localisation.ts`, using Vercel's country header when deployed.

## Commands

```bash
npm install
npm run dev
npm run build
npm start
```

## Environment

Set `STARTING_PRICE_ZAR` to the approved base monthly price. `LOCALIZATION_RATES_JSON` can override the rounded local conversion rates used for display.

The local `npm start` server retains a legacy demo-request endpoint. It is not part of the public WhatsApp demo journey.
