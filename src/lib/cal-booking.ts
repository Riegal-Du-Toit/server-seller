declare const process: { env: Record<string, string | undefined> };

const CAL_API_URL = "https://api.cal.com/v2";
const CAL_API_VERSION = "2026-02-25";

export type BookingContext = {
  role: string;
  teamSize: number;
  priorities: string[];
  problem: string;
  timeline: string;
  decisionRole: string;
};

export type AvailabilityRequest = {
  startTime: string;
  endTime: string;
  timeZone: string;
  duration: number;
};

export type BookingRequest = AvailabilityRequest & BookingContext & {
  name: string;
  email: string;
  start: string;
};

type CalResponse = {
  data?: unknown;
  message?: string;
  error?: { message?: string } | string;
};

export class BookingConfigurationError extends Error {}
export class BookingProviderError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

function eventTypeId() {
  const raw = process.env.CAL_EVENT_TYPE_ID;
  const parsed = raw ? Number(raw) : NaN;
  if (!Number.isSafeInteger(parsed) || parsed <= 0 || !process.env.CAL_API_KEY) {
    throw new BookingConfigurationError("Live booking is not configured yet.");
  }
  return parsed;
}

function headers() {
  const token = process.env.CAL_API_KEY;
  if (!token) throw new BookingConfigurationError("Live booking is not configured yet.");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "cal-api-version": CAL_API_VERSION,
  };
}

function readError(payload: CalResponse, fallback: string) {
  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.error === "string") return payload.error;
  if (payload.error && typeof payload.error.message === "string") return payload.error.message;
  return fallback;
}

async function calFetch(path: string, init: RequestInit = {}) {
  const response = await fetch(`${CAL_API_URL}${path}`, {
    ...init,
    headers: { ...headers(), ...init.headers },
    signal: AbortSignal.timeout(12_000),
  });
  const payload = await response.json().catch(() => ({})) as CalResponse;
  if (!response.ok) {
    console.error("Cal.com request failed", { path, status: response.status, message: readError(payload, "Calendar provider request failed.") });
    throw new BookingProviderError(readError(payload, "Calendar provider request failed."), response.status);
  }
  return payload;
}

function iso(value: unknown) {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
}

function collectStarts(value: unknown, collected: string[] = []): string[] {
  if (typeof value === "string") {
    const parsed = iso(value);
    if (parsed) collected.push(parsed);
    return collected;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => collectStarts(entry, collected));
    return collected;
  }
  if (!value || typeof value !== "object") return collected;
  const record = value as Record<string, unknown>;
  const start = iso(record.start) ?? iso(record.startTime) ?? iso(record.time);
  if (start) {
    collected.push(start);
    return collected;
  }
  Object.values(record).forEach((entry) => collectStarts(entry, collected));
  return collected;
}

export async function getAvailableSlots(request: AvailabilityRequest) {
  const id = eventTypeId();
  const search = new URLSearchParams({
    eventTypeId: String(id),
    startTime: request.startTime,
    endTime: request.endTime,
    timeZone: request.timeZone,
    duration: String(request.duration),
  });
  const payload = await calFetch(`/slots?${search.toString()}`);
  const starts = [...new Set(collectStarts(payload.data))]
    .filter((start) => new Date(start).valueOf() > Date.now())
    .sort((first, second) => new Date(first).valueOf() - new Date(second).valueOf());
  return starts.map((start) => ({ start }));
}

function clean(value: string, limit: number) {
  return value.trim().slice(0, limit);
}

function metadata(context: BookingContext) {
  return {
    source: "kervox.cloud booking journey",
    role: clean(context.role, 180),
    teamSize: String(context.teamSize),
    priorities: clean(context.priorities.join(", "), 500),
    problem: clean(context.problem, 500),
    timeline: clean(context.timeline, 100),
    decisionRole: clean(context.decisionRole, 100),
  };
}

export async function createBooking(request: BookingRequest) {
  const id = eventTypeId();
  const payload = await calFetch("/bookings", {
    method: "POST",
    body: JSON.stringify({
      start: request.start,
      eventTypeId: id,
      lengthInMinutes: request.duration,
      attendee: {
        name: clean(request.name, 100),
        email: clean(request.email, 200).toLowerCase(),
        timeZone: request.timeZone,
        language: "en",
      },
      metadata: metadata(request),
    }),
  });
  const data = (payload.data && typeof payload.data === "object" ? payload.data : {}) as Record<string, unknown>;
  return {
    uid: typeof data.uid === "string" ? data.uid : undefined,
    start: typeof data.start === "string" ? data.start : request.start,
    meetingUrl: typeof data.meetingUrl === "string" ? data.meetingUrl : undefined,
  };
}

export async function notifyCrm(payload: Record<string, unknown>) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CRM_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) console.error("CRM notification failed", { status: response.status });
  } catch (error) {
    console.error("CRM notification failed", error instanceof Error ? error.message : error);
  }
}
