declare const process: { env: Record<string, string | undefined> };

const marketDefaults: Record<string, { currency: string; locale: string; timeZone: string; rate: number; rounding: number }> = {
  PH: { currency: "PHP", locale: "en-PH", timeZone: "Asia/Manila", rate: 3.85, rounding: 1000 },
  ZA: { currency: "ZAR", locale: "en-ZA", timeZone: "Africa/Johannesburg", rate: 1, rounding: 100 },
  GB: { currency: "GBP", locale: "en-GB", timeZone: "Europe/London", rate: 0.043, rounding: 5 },
  IE: { currency: "EUR", locale: "en-IE", timeZone: "Europe/Dublin", rate: 0.050, rounding: 5 },
  DE: { currency: "EUR", locale: "de-DE", timeZone: "Europe/Berlin", rate: 0.050, rounding: 5 },
  FR: { currency: "EUR", locale: "fr-FR", timeZone: "Europe/Paris", rate: 0.050, rounding: 5 },
  AU: { currency: "AUD", locale: "en-AU", timeZone: "Australia/Sydney", rate: 0.083, rounding: 25 },
  CA: { currency: "CAD", locale: "en-CA", timeZone: "America/Toronto", rate: 0.074, rounding: 25 },
  SG: { currency: "SGD", locale: "en-SG", timeZone: "Asia/Singapore", rate: 0.073, rounding: 25 },
  AE: { currency: "AED", locale: "en-AE", timeZone: "Asia/Dubai", rate: 0.20, rounding: 50 },
  US: { currency: "USD", locale: "en-US", timeZone: "America/New_York", rate: 0.054, rounding: 25 },
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

function priceInMarket(baseZar: number, market: { currency: string; locale: string; rate: number; rounding: number }) {
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
  const amount = Math.round((baseZar * rate) / market.rounding) * market.rounding;
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
  const baseZar = Number(process.env.STARTING_PRICE_ZAR || "25000");
  const startingPriceZar = Number.isFinite(baseZar) && baseZar > 0 ? baseZar : 25000;
  return Response.json({
    country,
    timeZone: validTimeZone(browserTimeZone) ? browserTimeZone : market.timeZone,
    price: priceInMarket(startingPriceZar, market),
  }, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Vary": "x-vercel-ip-country",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
