# Build Plan — Confidential Connect Ltd Ecosystem

The full scope (marketplace CMS + document delivery + promotion platform + analytics + admin everything) is roughly 8–12 hours of focused build work. Trying to do it in one turn would leave most pieces half-wired. I'll ship it in 5 rounds. Each round is self-contained and tested before moving on.

## Round 1 — Branding sweep + WhatsApp Channel (quick win)
- Replace remaining "Confidential Connect" → "Confidential Connect Ltd" across all pages, header, footer, emails, popups, notifications.
- Add "in partnership with All Campus Connect TV" line to footer + about.
- Wire every "Join Now" / channel CTA to `https://whatsapp.com/channel/0029Vb7C1k61yT24qg7Ip427` (header, hero, popups, CTA sections).

## Round 2 — Product/Marketplace CMS
- DB: extend `products` (discount_price, images[], video_url, status, featured, tags[], whatsapp, external_link, stock, sku) + `product_categories` table.
- Storage bucket `product-images` with admin-write / public-read policies.
- `/admin/products` — list, add, edit, delete, publish/unpublish, feature, archive, duplicate.
- `/admin/categories` — CRUD.
- Public `/shop` page with search, category filter, price filter, featured/new tabs.
- Homepage "Featured Products & Services" section.

## Round 3 — Document Delivery System
- DB: extend `service_requests` (delivered_file_url, delivered_at, status enum incl. verification/ready_for_download/rejected).
- Storage bucket `delivered-documents` (private, owner + admin read).
- Customer `/dashboard` → "My Requests" with statuses + Download Center for ready files.
- `/admin/documents` — view requests, upload completed file, change status, replace/delete files.
- Notifications on status changes.

## Round 4 — Promotion Platform end-to-end polish
- Verify all 4 plans (₦2k / ₦10.5k / ₦18.2k / ₦36k) wired to payment → submission → admin approval.
- Add "Limited slots" badge, image preview in admin, approve/reject/in-progress/completed with toasts (already done) + customer status visible on dashboard.

## Round 5 — Admin Dashboard metrics + Analytics + Notifications polish
- Stats cards (total products, orders, users, revenue, active promos, pending/completed requests, featured products, documents).
- Real revenue charts (daily/weekly/monthly) from `orders` + `promotion_payments`.
- Admin user management actions (suspend/delete).
- Final mobile QA pass.

## What I need from you
Reply with **"Start Round 1"** (or pick a different starting round) and I'll execute that round in full this turn. We then iterate round by round. This is the only way to land all of this without regressions.
