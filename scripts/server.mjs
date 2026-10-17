import { createServer } from "node:http";
import { appendFile, mkdir, readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { randomUUID } from "node:crypto";

const port = Number(process.env.PORT || process.argv[2] || 4321);
const root = resolve("dist");
const dataDirectory = resolve(process.env.DEMO_DATA_DIR || ".data");
const leadsFile = join(dataDirectory, "demo-requests.jsonl");
const rateLimits = new Map();
const MIME_TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon" };

const sendJson = (response, status, body) => {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  response.end(JSON.stringify(body));
};

const clean = (value, limit) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 32_000) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function isRateLimited(address) {
  const now = Date.now();
  const attempts = (rateLimits.get(address) || []).filter((timestamp) => now - timestamp < 15 * 60_000);
  attempts.push(now);
  rateLimits.set(address, attempts);
  return attempts.length > 5;
}

async function persist(record) {
  await mkdir(dataDirectory, { recursive: true });
  await appendFile(leadsFile, `${JSON.stringify(record)}\n`, { encoding: "utf8", mode: 0o600 });
}

async function sendEmail(message) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return "not_configured";
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, ...message }), signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  return "sent";
}

async function notifySales(lead) {
  const to = process.env.SALES_NOTIFICATION_EMAIL;
  if (!to) return "not_configured";
  const fields = [["Name", lead.name], ["Email", lead.email], ["Company", lead.company], ["Phone", lead.phone || "Not provided"], ["Interest", lead.interest], ["Message", lead.message || "Not provided"]];
  return sendEmail({ to: [to], reply_to: lead.email, subject: `Kervox demo request — ${lead.company}`, html: `<h2>New demo request</h2>${fields.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join("")}<p><small>Reference: ${lead.id}</small></p>` });
}

async function confirmWithCustomer(lead) {
  return sendEmail({ to: [lead.email], subject: "We received your Kervox demo request", html: `<h2>Thanks, ${escapeHtml(lead.name)}.</h2><p>We received your demo request and will contact you to arrange a suitable time.</p><p><strong>Area of interest:</strong> ${escapeHtml(lead.interest)}</p><p><small>Reference: ${lead.id}</small></p>` });
}

async function notifyWebhook(lead) {
  if (!process.env.CRM_WEBHOOK_URL) return "not_configured";
  const response = await fetch(process.env.CRM_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json", ...(process.env.CRM_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify(lead), signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`CRM webhook returned ${response.status}`);
  return "sent";
}

async function handleDemoRequest(request, response) {
  if (!request.headers["content-type"]?.toLowerCase().startsWith("application/json")) return sendJson(response, 415, { message: "Content type must be application/json." });
  const forwardedAddress = process.env.TRUST_PROXY === "true" ? request.headers["x-forwarded-for"]?.split(",")[0]?.trim() : "";
  const address = forwardedAddress || request.socket.remoteAddress || "unknown";
  if (isRateLimited(address)) return sendJson(response, 429, { message: "Too many requests. Please wait and try again." });
  try {
    const body = await readBody(request);
    if (clean(body.website, 200)) return sendJson(response, 201, { requestId: randomUUID() });
    const lead = { id: randomUUID(), createdAt: new Date().toISOString(), status: "requested", name: clean(body.name, 100), email: clean(body.email, 200).toLowerCase(), company: clean(body.company, 150), phone: clean(body.phone, 40), interest: clean(body.interest, 100), message: clean(body.message, 2000), consent: body.consent === "yes", source: "website" };
    if (!lead.name || !validEmail(lead.email) || !lead.company || !lead.interest || !lead.consent) return sendJson(response, 400, { message: "Complete all required fields using a valid work email." });
    await persist({ type: "demo_request", ...lead });
    const delivery = { salesEmail: "pending", customerEmail: "pending", crm: "pending" };
    const results = await Promise.allSettled([notifySales(lead), confirmWithCustomer(lead), notifyWebhook(lead)]);
    delivery.salesEmail = results[0].status === "fulfilled" ? results[0].value : "failed";
    delivery.customerEmail = results[1].status === "fulfilled" ? results[1].value : "failed";
    delivery.crm = results[2].status === "fulfilled" ? results[2].value : "failed";
    await persist({ type: "delivery_result", requestId: lead.id, createdAt: new Date().toISOString(), delivery });
    const calendarUrl = /^https:\/\//.test(process.env.DEMO_CALENDAR_URL || "") ? process.env.DEMO_CALENDAR_URL : undefined;
    return sendJson(response, 201, { requestId: lead.id, message: "Demo request received.", ...(calendarUrl ? { calendarUrl } : {}) });
  } catch (error) {
    console.error("Demo request failed", error instanceof Error ? error.message : error);
    return sendJson(response, error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? 413 : 500, { message: "We could not submit your request. Please try again." });
  }
}

async function serveStatic(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  else if (!extname(pathname)) pathname += "/index.html";
  const filePath = normalize(join(root, pathname));
  if (!filePath.startsWith(root)) return sendJson(response, 404, { message: "Not found" });
  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");
    const content = await readFile(filePath);
    response.writeHead(200, { "Content-Type": MIME_TYPES[extname(filePath)] || "application/octet-stream", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "SAMEORIGIN" });
    response.end(content);
  } catch {
    sendJson(response, 404, { message: "Not found" });
  }
}

createServer(async (request, response) => {
  if (request.method === "POST" && request.url?.split("?")[0] === "/api/demo-requests") return handleDemoRequest(request, response);
  if (request.method !== "GET" && request.method !== "HEAD") return sendJson(response, 405, { message: "Method not allowed" });
  return serveStatic(request, response);
}).listen(port, () => console.log(`Kervox server listening on http://localhost:${port}`));
