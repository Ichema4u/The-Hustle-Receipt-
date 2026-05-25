# 03 — Audit notes: threats, edge-cases, and mitigations

Q: What if an attacker calls your success route directly with a fake transaction ID?

- Problem: If your success page or client logic accepts a transaction reference and shows a success message without server verification, an attacker can spoof the UI.
- Mitigation: The success page may show a friendly message, but it should always display the authoritative status fetched from your server (which in turn calls Flutterwave). Never mark internal records as `verified` based on the presence of a `ref` query parameter alone.

Q: What if Flutterwave's callback (or webhook) fires twice — could a tip be credited twice?

- Problem: Duplicate callbacks or retries can cause double-crediting if the verify handler blindly creates or credits a tip on every call.
- Mitigation: Make the verify handler idempotent. Use a unique `flutterwaveRef` and check the existing `paymentStatus` before making changes. If the Tip is already `verified`, return success without side effects. Use DB transactions and `UNIQUE` constraints to avoid race conditions.

Q: Is the secret key ever exposed to the client bundle?

- Answer: It must not be. Only public keys (prefixed with NEXT*PUBLIC*) should appear in client bundles. The secret key (`FLUTTERWAVE_SECRET_KEY`) must live on the server and never be returned in API responses or rendered into pages.

Q: What if the verify API call fails (network or provider error)?

- Problem: A transient failure during verification can leave the Tip in `pending` and confuse the user.
- Mitigation:
  - Mark the Tip `pending` and surface a clear message to the user asking them to wait or contact support.
  - Implement server-side retries (exponential backoff) for transient errors.
  - Use webhooks as a fallback: the provider may re-send notification later and your webhook handler (also idempotent) can finalize the Tip.
  - Provide operators an admin view to manually reconcile stuck transactions if needed.

Q: Are amounts validated server-side or only on the client (can an attacker change the amount)?

- Problem: If the server trusts the client-provided amount when creating or verifying a Tip, an attacker could manipulate the client to change amounts and pay less than expected.
- Mitigation: Always record the expected amount on the server when you create the `pending` Tip and compare the amount returned by the provider during verification to the expected server-side amount. Only persist `verified` when amounts and currency match.

Additional hardening notes

- Use HTTPS everywhere; enforce HSTS in production.
- Store and rotate secret keys via a secure secrets manager (not in plaintext in repo or .env for long-lived production keys).
- Add monitoring and alerts for failed verification rates and repeated `pending` tips.
- Log events safely: record transaction IDs and statuses but redact sensitive fields and never log secret keys or raw card data.

Short checklist for deploy readiness

- Secret keys in secure env only (no commit)
- Verify endpoint idempotent and transactional
- Amount/currency validated server-side
- Webhook handler implemented and signature-verified
- Retry/backoff for transient verify errors
- Admin reconciliation UI for edge cases
