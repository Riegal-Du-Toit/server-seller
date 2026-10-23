import { BookingConfigurationError, BookingProviderError, getAvailableSlots } from "../../src/lib/cal-booking";

function validTimeZone(value: string) {
  if (!value || value.length > 80) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

function validDate(value: string | null) {
  return Boolean(value && !Number.isNaN(new Date(value).valueOf()));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const startTime = url.searchParams.get("startTime");
  const endTime = url.searchParams.get("endTime");
  const timeZone = url.searchParams.get("timeZone") || "Asia/Manila";
  const duration = Number(url.searchParams.get("duration") || "30");
  if (!validDate(startTime) || !validDate(endTime) || !validTimeZone(timeZone) || ![30, 45].includes(duration)) return json({ message: "Invalid availability request." }, 400);
  if (new Date(endTime!).valueOf() <= new Date(startTime!).valueOf()) return json({ message: "Invalid availability range." }, 400);
  try {
    const slots = await getAvailableSlots({ startTime: startTime!, endTime: endTime!, timeZone, duration });
    return json({ slots });
  } catch (error) {
    if (error instanceof BookingConfigurationError) return json({ message: "Scheduling is being connected. Please check back shortly." }, 503);
    if (error instanceof BookingProviderError) return json({ message: "We could not load open times. Please try again." }, 502);
    console.error("Availability request failed", error);
    return json({ message: "We could not load open times. Please try again." }, 500);
  }
}
