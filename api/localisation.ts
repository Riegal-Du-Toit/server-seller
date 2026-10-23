declare const process: { env: Record<string, string | undefined> };

const marketDefaults: Record<string, { currency: string; locale: string; timeZone: string; rate: number; rounding: number }> = {
  PH: { currency: "PHP", locale: "en-PH", timeZone: "Asia/Manila", rate: 57.5, rounding: 100 },
  ZA: { currency: "ZAR", locale: "en-ZA", timeZone: "Africa/Johannesburg", rate: 18.4, rounding: 50 },
  GB: { currency: "GBP", locale: "en-GB", timeZone: "Europe/London", rate: 0.79, rounding: 5 },
  IE: { currency: "EUR", locale: "en-IE", timeZone: "Europe/Dublin", rate: 0.92, rounding: 5 },
  DE: { currency: "EUR", locale: "de-DE", timeZone: "Europe/Berlin", rate: 0.92, rounding: 5 },
  FR: { currency: "EUR", locale: "fr-FR", timeZone: "Europe/Paris", rate: 0.92, rounding: 5 },
  AU: { currency: "AUD", locale: "en-AU", timeZone: "Australia/Sydney", rate: 1.53, rounding: 5 },
  CA: { currency: "CAD", locale: "en-CA", timeZone: "America/Toronto", rate: 1.37, rounding: 5 },
  SG: { currency: "SGD", locale: "en-SG", timeZone: "Asia/Singapore", rate: 1.35, rounding: 5 },
  AE: { currency: "AED", locale: "en-AE", timeZone: "Asia/Dubai", rate: 3.67, rounding: 5 },
  US: { currency: "USD", locale: "en-US", timeZone: "America/New_York", rate: 1, rounding: 1 },
};

function validTimeZone(value: string | null) {
  if (!value || value.length > 80) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

function priceInMarket(baseUsd: number, market: { currency: string; locale: string; rate: number; rounding: number }) {
  const configuredRates = process.env.LOCALIZATION_RATES_JSON;
  let rate = market.rate;
  if (configuredRates) {
    try {
      const parsed = JSON.parse(configuredRates) as Record<string, number>;
      if (Number.isFinite(parsed[market.currency]) && parsed[market.currency] > 0) rate = parsed[market.currency];
    } catch {
      console.error("LOCALIZATION_RATES_JSON is not valid JSON");
    }
  }
  const amount = Math.round((baseUsd * rate) / market.rounding) * market.rounding;
  return {
    amount,
    currency: market.currency,
    formatted: new Intl.NumberFormat(market.locale, { style: "currency", currency: market.currency, maximumFractionDigits: 0 }).format(amount),
  };
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const country = (request.headers.get("x-vercel-ip-country") || url.searchParams.get("country") || "US").toUpperCase();
  const market = marketDefaults[country] || marketDefaults.US;
  const browserTimeZone = url.searchParams.get("timeZone");
  const baseUsd = Number(process.env.STARTING_PRICE_USD || "299");
  const startingPriceUsd = Number.isFinite(baseUsd) && baseUsd > 0 ? baseUsd : 299;
  return Response.json({
    country,
    timeZone: validTimeZone(browserTimeZone) ? browserTimeZone : market.timeZone,
    price: priceInMarket(startingPriceUsd, market),
  }, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Vary": "x-vercel-ip-country",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
