# Confidential Connect Ltd — Full Build Roadmap

I can't ship all of this in a single response (it's dozens of files, new tables, edge functions, and third-party integrations). Here's the sequenced plan I'll execute back-to-back, one round per turn. Reply **"go"** to start Round 1 and I'll continue automatically through each round, pausing only for API keys or destructive confirmations.

## Round 1 — Marketplace Homepage + Promote With Link plan
- New `businesses` table (name, category, description, state, phone, whatsapp, website, logo_url, verified, promotion_tier, sort_boost, owner_id, status).
- Public read of `status = 'approved'`; owner/admin write.
- Public `<Marketplace />` section injected into `/` right after hero — search bar, category + state filters, promoted-first ordering (`promotion_tier` desc → `sort_boost` desc → `created_at` desc).
- Business cards: logo, name, category, location, verified badge, "Promote With Link" badge, WhatsApp/Website/Call buttons, "View details" → `/business/:id`.
- `/business/:id` public detail page + view/click analytics counters (`views`, `whatsapp_clicks`, `link_clicks`).
- Admin CRUD at `/admin/businesses` (approve, edit, feature, delete).
- Add "Promote With Link" plan (₦5,000/day) to `promotion_plans` — already dynamic, so it flows to homepage `#pricing` and `/advertising` immediately.

## Round 2 — PIN Reseller Core (WAEC / NECO / NABTEB / JAMB)
- New `pin_transactions` table (customer_name, email, product, amount, paystack_ref, status, pin, serial, api_response, delivered_at).
- Public `/buy/waec-pin`, `/buy/neco-pin`, `/buy/nabteb-pin`, `/buy/jamb-epin` pages — name/email form → Paystack.
- Edge function `purchase-pin`: verifies Paystack tx → calls NaijaResultPins → stores pin/serial → returns to page → sends email.
- Success page shows pin + serial; failure page shows contact-support message.
- Requires secrets: `NAIJARESULTPINS_API_TOKEN`, `RESEND_API_KEY` (I'll request them at start of Round 2).

## Round 3 — Email Receipts + Admin Transactions Dashboard
- Resend integration for pin-delivery email (Subject: "Your WAEC Result Checker PIN — Confidential Connect Ltd").
- `/admin/pin-transactions` — search, filter by status/product/date, CSV export, revenue totals (today / this month / all time), pending & failed counters, retry-delivery button.
- Extend main admin dashboard cards with PIN revenue + total pins sold.

## Round 4 — Verify Identity fix + polish
- Debug the KYC flow end-to-end (upload → submit → admin review → user notified).
- Homepage SEO refresh for marketplace keywords.
- Mobile QA sweep on new marketplace + buy-pin pages.

## Technical details
- All new tables get GRANTs + RLS in the same migration.
- Realtime subscription on `businesses` so approvals appear instantly.
- Paystack: existing `verify-paystack` edge function reused; new `purchase-pin` function chains verify → NaijaResultPins → email.
- All prices continue to live in `promotion_plans` (already dynamic per your prior request).
- No hardcoded copies of prices, product names, or business data anywhere.

## What I need from you
1. Reply **"go"** to start Round 1.
2. At the start of Round 2 I'll open secure forms for `NAIJARESULTPINS_API_TOKEN` and `RESEND_API_KEY`.
3. Confirm the NaijaResultPins API base URL + endpoint if it's not the default `https://api.naijaresultpins.com/v1/buy-pin` — otherwise I'll code against their public docs.
