# Website audit

Scope: current local source and configuration. Findings are source observations; production configuration, real delivery, browser rendering, assistive technology, dependency vulnerabilities and external integrations were not verified. This is not a completed independent security scan.

## Features and flows

- Homepage: animated scroll hero, platform and business-benefit showcases, industry carousel, demo request form, navigation and footer.
- Privacy page: short notice linked from the form and footer.
- Demo API: validates and stores requests in a local JSONL file; optionally sends sales and customer emails, forwards to a CRM webhook and returns a scheduling link. The repository does not contain an interactive product demo.
- Analytics: the form emits browser events and optionally pushes to an existing dataLayer; no analytics provider is configured here.

## Priority 1: reliability and security

1. **Malformed paths can terminate the server.** `scripts/server.mjs` decodes the request path outside its error handler. Invalid percent encoding rejects the async request handler without a catch. Catch malformed URLs at the server boundary, return 400 and test that subsequent requests still work.
2. **Requests can be recorded without sales notification.** The API returns success when notification settings are absent or delivery fails. Delivery status is stored locally but there is no dashboard, alert, retry or operator workflow. Configure durable storage and notification monitoring; add a retryable queue and an operational way to review failures.
3. **Duplicate leads after a partial failure.** The lead is saved before notifications and the delivery record. If the latter write fails, the client receives an error despite the saved lead and potentially sent emails. Retrying can duplicate both. Use an idempotency key and durable job state.
4. **Rate limiter can exhaust memory and is not shared.** The in-memory map retains addresses indefinitely, resets on restart and is separate per process. Use bounded, expiring shared storage or edge rate limiting; check trusted proxy configuration before relying on client IPs.
5. **Stored personal information needs operational controls.** JSONL contains contact details and messages. File mode helps on systems that enforce it, but encryption, retention, deletion, access controls and backup policy are not implemented here. Define and test those controls for the deployment.
6. **Static hosting alone cannot process demo requests.** `astro dev` and `astro preview` do not run `scripts/server.mjs`; the production API requires `npm start` or a separately deployed equivalent. Document the real deployment path and add a health check and end-to-end test.
7. **Invalid JSON is reported as a server error.** JSON parsing exceptions become 500 responses. Return a clear 400 for malformed input and validate input type and allowed interest values server-side.
8. **Outbound integrations lack retry and alerting.** Email and CRM failures are recorded but not retried; calls have an eight-second timeout. Add monitored retries with backoff and idempotency, and ensure secrets remain in a secret manager.
9. **Security headers and transport depend on deployment.** The custom server supplies some headers but no CSP or HSTS. Configure a restrictive, tested CSP and HTTPS/HSTS at the trusted edge, and verify proxy headers cannot be supplied directly by clients.

## Priority 2: experience and accessibility

10. **Hero requires substantial scrolling.** The animated section is 700 viewport heights and responds to scroll even when reduced motion is requested. Provide a shorter or static reduced-motion experience, and verify on mobile, keyboard and short screens.
11. **Mobile navigation omits platform links.** Mobile users only see the demo CTA in the header. Add accessible navigation to the main sections and test touch targets and focus behavior.
12. **Industry descriptions are presented as quotations.** They are generic solution descriptions, not attributed customer quotes. Remove quotation styling or use verified, permissioned testimonials. The carousel now stays on the selected item and controls describe industry solutions.
13. **Demo terminology overpromises.** “Book a Demo” opens a request form; actual scheduling is optional and depends on configuration. Use “Request a Demo” consistently or provide a confirmed booking flow.
14. **Form recovery and feedback need testing.** Add field-specific server validation, timeout handling, focus management after submission and an accessible way to correct errors. Confirm success text reflects actual follow-up capabilities.
15. **Privacy notice lacks a direct contact route and specific retention information.** Supply verified business contact details, actual processors, retention and jurisdiction-specific disclosures after legal review.
16. **Showcase hover decoration implies a link.** Removed the arrow from non-interactive rows. Check mobile layout and whether meaningful imagery is clear without hover.

## Priority 3: content, performance and operations

17. **Claims need evidence.** “Under 60 seconds”, automated approvals, payments and industry-specific capabilities should be checked against the actual product and conditions. Add screenshots, concrete workflow examples and substantiated proof.
18. **SEO and sharing metadata are incomplete.** Add canonical URLs, sitemap, robots rules, social preview image and verified organization metadata where applicable. Confirm indexing on the deployed site.
19. **All main React islands load immediately.** Measure real Core Web Vitals and bundle sizes; defer below-the-fold hydration where appropriate, optimize large artwork and retain a fast accessible first render.
20. **Tests cover only two API cases.** Add isolated tests for malformed paths and JSON, validation, rate limits, persistence errors, partial delivery, retries, honeypot behavior and configured integrations. Add browser tests for responsive navigation, keyboard operation, motion preference and the complete form flow.
21. **Dependencies and deployment are unverified.** Audit the lockfile with a current advisory source, pin and update dependencies as needed, and verify production logs, health checks, backup restoration and security headers.
