# 02 — Payment integration principles and how this code maps to them

This file maps the codebase to core payment-integration principles and highlights the trust boundaries.

- **Trust boundaries**
  - Client: collects tip metadata and initiates checkout. It holds only the public Flutterwave key (`NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`) that is safe to expose.
  - Server: holds the secret key (`FLUTTERWAVE_SECRET_KEY`) and is the only place that can perform authoritative verification and persist `verified` payments.

- **Server-side verification is the source of truth**
  - Code mapping: `/api/tip/[slug]/verify` calls Flutterwave's verify endpoint and compares the response to the local Tip record before marking `verified`.
  - Principle: never mark a payment `verified` based only on the client callback. The server's verify response is authoritative because it uses the secret key and returns provider-side status.

- **Idempotency and repeated callbacks**
  - Code mapping: the Tip model includes a unique `flutterwaveRef` and a `paymentStatus` field; verify handler must check current status before applying credits.
  - Principle: make the verify endpoint idempotent — if the tip is already `verified`, return success without double-crediting (or re-apply safe operations only once).

- **Separation of test vs production keys**
  - Code mapping: env vars `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` vs `FLUTTERWAVE_SECRET_KEY`; developer should use test keys for local/dev and production keys in production.
  - Principle: never use test keys in production and never commit keys to source control. Separate deploy environments with distinct env vars.

- **Never log or expose secret keys**
  - Code mapping: secret key is only read on server and used in server-to-provider HTTP calls. Do not print it to logs or include it in client responses.
  - Principle: redact secrets from logs and avoid accidental inclusion in error traces or monitoring payloads.

- **Amount validation and anti-tampering**
  - Code mapping: verify handler validates the amount returned by Flutterwave matches the expected Tip amount before updating the database.
  - Principle: treat client-submitted amounts as untrusted until confirmed by the provider; always compare the provider's settled amount to your expected amount.

- **Webhook vs on-demand verify**
  - Code mapping: current flow uses client-initiated verify route. For higher reliability, also support server-side webhooks (provider -> your server) and verify the webhook signature.
  - Principle: webhooks are more robust (work when the client closes the window) but must be validated and made idempotent.

- **Failure handling and retries**
  - Code mapping: verify endpoint should implement retry/backoff if Flutterwave responds with transient errors; mark `pending` and alert if persistent failures occur.
  - Principle: network or provider failures are normal—design the flow so state is consistent (pending → verified or failed) and retries don't create duplicates.

Summary: The code enforces clear client/server trust boundaries, uses server-side verification as the authority, and should implement idempotency and careful secret handling to be production-safe.
