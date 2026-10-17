import assert from "node:assert/strict";

const baseUrl = process.argv[2] || "http://localhost:4321";

const validResponse = await fetch(`${baseUrl}/api/demo-requests`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Test Buyer", email: "buyer@example.com", company: "Example Co", interest: "Connected operations", message: "Automated test request", consent: "yes", website: "" }),
});
const validBody = await validResponse.json();
assert.equal(validResponse.status, 201);
assert.match(validBody.requestId, /^[0-9a-f-]{36}$/);

const invalidResponse = await fetch(`${baseUrl}/api/demo-requests`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "", email: "bad", company: "", interest: "", consent: "no" }),
});
assert.equal(invalidResponse.status, 400);

console.log("Demo API: valid request stored; invalid request rejected.");
