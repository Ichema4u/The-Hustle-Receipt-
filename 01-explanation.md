# 01 — ELI7: Payment flow explained line-by-line

This file explains the payment flow at a very simple level, mapping the implementation (client + server) to what actually happens when someone tips a creator.

1. Supporter fills the tip form on the public page

- What happens: The supporter types name, email, amount, and message into the form.
- Why it matters: The client collects the minimum information Flutterwave needs to start a checkout and a record to link the eventual payment to the correct creator.

2. Client sends a POST to `/api/tip/[slug]` to initiate the payment

- What happens: The browser sends the tip data (amount, tipper email/name/message) to the server with the creator slug.
- Important lines: the fetch POST in `handleInitiatePayment`.
- Why: The server generates a unique reference (e.g. `HUSTLE_{timestamp}_{uuid}`) and creates a Tip record with status `pending`. That reference is the single identifier both the client and server will use to track the transaction.

3. Server responds with Flutterwave payload and the unique reference

- What happens: Server returns the JS payload needed for FlutterwaveInlineCheckout (public key, amount, customer email, tx_ref/reference, redirect/callback info).
- Why: The payload configures the Flutterwave modal; the tx_ref ties the checkout session to your Tip record.

4. Client opens the Flutterwave modal (window.FlutterwaveCheckout)

- What happens: The client loads the Flutterwave SDK and calls `window.FlutterwaveCheckout({...flutterwavePayload, callback, onclose})`.
- Why: This displays the secure payment UI hosted by Flutterwave. The user enters card details there — the card data never touches your server or app bundle (Flutterwave handles it).

5. Flutterwave calls the callback (client-side) after payment attempt

- What happens: Flutterwave invokes the `callback` with a `response` that contains a transaction `status` and the `tx_ref` or `reference` returned by Flutterwave.
- Why: This informs the client that Flutterwave recorded something, but it's only a notification — it does not mean your server has verified the payment yet.

6. Client posts the Flutterwave reference to `/api/tip/[slug]/verify`

- What happens: The client sends `{ reference }` to your server's verify route.
- Why: The server must now verify that the transaction is actually successful by calling Flutterwave's server-side verify endpoint using your secret key.

7. Server calls Flutterwave's verify API (server -> Flutterwave)

- What happens: The server makes an authenticated HTTPS request to Flutterwave's verify endpoint (e.g. `GET /v3/transactions/{reference}/verify`) including the secret key in headers.
- Why server-side: Only your server holds the secret key securely; this call returns the authoritative transaction status and charged amount directly from Flutterwave.

8. Server checks the verify response and the local Tip record

- What happens: The server confirms the returned status is `successful` (or the provider-specific success indicator), that the `amount` and `currency` match the expected values, and that `tx_ref` matches the tip record.
- If OK: server marks the Tip as `verified` and persists any extra tip metadata.
- If NOT OK: server marks the Tip `failed` (or leaves `pending`) and returns an error to the client.

9. Server responds to the client about verification result

- What happens: If verification succeeded, server returns success and the client redirects supporter to `/tip/[slug]/success?ref={reference}` (this is just a UX page). If verification failed, server returns an error displayed to the user.
- Why the redirect: The client uses the server's verification result to decide whether to show a success UI. The redirect is for UX only — not the authority for marking payments verified.

10. Final note — why client-side success messages are not trusted

- Flutterwave's client callback can be spoofed or intercepted; it tells the app _what Flutterwave claims the browser saw_, but not what Flutterwave's backend recorded and settled.
- Only the server-side verify call (authenticated with your secret key) is the source of truth. Always persist verification results only after server-side confirmation.

Summary: Initiation = client -> server (create pending tip + generate tx_ref). Payment UI = Flutterwave-hosted modal. Authoritative verification = server -> Flutterwave verify with secret key. Redirects and client messages = UX only.
