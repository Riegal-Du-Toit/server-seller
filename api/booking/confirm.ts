import { BookingConfigurationError, BookingProviderError, createBooking, notifyCrm, type BookingRequest } from "../../lib/cal-booking";

const allowedTimeZones = new Set(["Asia/Manila", "Africa/Johannesburg", "Europe/London"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

function text(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function parseBooking(value: unknown): BookingRequest | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const priorities = Array.isArray(body.priorities) ? body.priorities.map((item) => text(item, 100)).filter(Boolean).slice(0, 3) : [];
  const start = text(body.start, 80);
  const timeZone = text(body.timeZone, 80);
  const email = text(body.email, 200).toLowerCase();
  const duration = Number(body.duration);
  if (!text(body.name, 100) || !emailPattern.test(email) || !start || Number.isNaN(new Date(start).valueOf()) || !allowedTimeZones.has(timeZone) || ![30, 45].includes(duration) || priorities.length !== 3 || !text(body.role, 180) || !text(body.problem, 500) || !text(body.timeline, 100) || !text(body.decisionRole, 100)) return null;
  const teamSize = Number(body.teamSize);
  if (!Number.isSafeInteger(teamSize) || teamSize < 1 || teamSize > 500) return null;
  return { name: text(body.name, 100), email, start: new Date(start).toISOString(), timeZone, duration, role: text(body.role, 180), teamSize, priorities, problem: text(body.problem, 500), timeline: text(body.timeline, 100), decisionRole: text(body.decisionRole, 100), startTime: start, endTime: start };
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ message: "Content type must be application/json." }, 415);
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 32_000) return json({ message: "Request is too large." }, 413);
  let raw: Record<string, unknown>;
  try {
    raw = await request.json() as Record<string, unknown>;
  } catch {
    return json({ message: "Invalid request." }, 400);
  }
  if (text(raw.website, 200)) return json({ bookingId: crypto.randomUUID() }, 201);
  const booking = parseBooking(raw);
  if (!booking) return json({ message: "Complete the booking details using a valid work email." }, 400);
  if (new Date(booking.start).valueOf() < Date.now() - 60_000) return json({ message: "Please choose a future time." }, 400);
  try {
    const result = await createBooking(booking);
    await notifyCrm({ type: "demo_booking", createdAt: new Date().toISOString(), booking: { ...booking, uid: result.uid, meetingUrl: result.meetingUrl } });
    return json({ bookingId: result.uid ?? crypto.randomUUID(), start: result.start, meetingUrl: result.meetingUrl }, 201);
  } catch (error) {
    if (error instanceof BookingConfigurationError) return json({ message: "Scheduling is being connected. Please check back shortly." }, 503);
    if (error instanceof BookingProviderError) {
      const status = error.status === 409 || error.status === 422 ? 409 : 502;
      return json({ message: status === 409 ? "That time has just been taken. Please choose another." : "We could not confirm that time. Please try again." }, status);
    }
    console.error("Booking confirmation failed", error);
    return json({ message: "We could not confirm that time. Please try again." }, 500);
  }
}
