# Budgetly — Budget Planner Landing Page

A premium, conversion-focused landing page for **Budget Spreadsheet for Google Sheets**.
Built with Next.js (App Router), TypeScript and Tailwind CSS v4.

## Getting started

```bash
npm install
cp .env.example .env   # fill in your values (see below)
npm run dev
```

The site runs fine with an **empty .env** — prices fall back to placeholders and
the checkout endpoint returns a friendly "not available" message until Lemon
Squeezy is configured.

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | Canonical/OG URL base |
| `LEMON_SQUEEZY_API_KEY` | **server only** | Creates checkouts via the Lemon Squeezy API |
| `LEMON_SQUEEZY_STORE_ID` | server | Store relationship for checkouts |
| `LEMON_SQUEEZY_VARIANT_LIFETIME` | server | Variant ID for the lifetime plan |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | server | Verifies `X-Signature` on webhooks |
| `MONGODB_URI` | server (optional) | Persists purchases + newsletter subscribers |
| `NEXT_PUBLIC_PRICE_LIFETIME` | public | Price shown on the pricing card |
| `NEXT_PUBLIC_BRAND_NAME` | public | Brand name in header/footer |
| `NEXT_PUBLIC_CONTACT_EMAIL` | public | Contact link in the footer |

Never commit real secrets — `.env` is git-ignored.

## Payments (Lemon Squeezy)

1. Buy buttons call `POST /api/checkout` with `{ plan: "lifetime" }`.
2. The server maps the plan to a variant, creates an embedded checkout via the
   Lemon Squeezy API, and returns the checkout URL. **The API key never
   reaches the browser.**
3. `components/CheckoutButton.tsx` opens the URL as an overlay with Lemon.js.
4. `POST /api/webhooks/lemonsqueezy` verifies the HMAC-SHA256 `X-Signature`
   before trusting any order event, then records the purchase (MongoDB when
   `MONGODB_URI` is set, otherwise a server-side log).

Point the Lemon Squeezy webhook at `https://your-domain/api/webhooks/lemonsqueezy`.

## Structure

- `app/` — layout, page, and API routes (`checkout`, `webhooks/lemonsqueezy`, `newsletter`)
- `components/` — one file per landing-page section + `mockups/` (CSS-rendered
  spreadsheet "screenshots" — swap in real screenshots later by replacing these)
- `data/` — all product copy, testimonials (placeholder samples), and FAQ content
- `lib/` — Lemon Squeezy helpers (server-only), optional MongoDB helpers, utils

## Scripts

```bash
npm run dev     # develop
npm run build   # production build + type check
npm run lint    # eslint
```
