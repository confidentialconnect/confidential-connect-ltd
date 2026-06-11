## Confidential Connect Ltd — Enterprise Upgrade Plan

This is a large, multi-month scope. Below is the audit summary and a phased roadmap so we can ship in approved, reviewable chunks instead of one giant unreviewable change.

---

### 1. Current State (what's already shipped)

- Auth + RBAC (user_roles, has_role), 30-min auto logout
- Products + categories (admin CRUD, public shop, search/filter/sort, featured)
- Orders + checkout (Paystack edge function, 1.5%+₦100 fee passthrough, Moniepoint bank transfer)
- Service requests + admin document delivery (private storage bucket, signed URLs, Downloads tab)
- Promotion payments (Advertising plans, customer "My Promotions" tab, admin approval)
- Admin dashboard: Home, Orders, Products, Categories, Documents, Promotions, Users, Analytics (LiveCharts), Settings
- AI chat widget (Lovable AI), Perplexity smart search, WhatsApp support, reCAPTCHA on service requests
- SEO basics: titles, descriptions, sitemap, robots.txt

### 2. Audit Findings (gaps vs. brief)

**Security**
- No 2FA / MFA
- No audit log table (admin actions, logins)
- No login security monitoring (failed attempts, IP, device)
- HIBP leaked-password check not enabled
- Identity verification (KYC) workflow missing

**Revenue / Marketplace**
- No vendor self-registration (only admin uploads products)
- No reviews/ratings on products or vendors
- No Flutterwave (Paystack only)
- No subscription billing / recurring plans
- No automated PDF invoices
- Self-service ad booking exists as form, but no campaign performance reports / impression tracking

**Content / Media**
- No News/Media center (publishing, editor workflow, scheduled posts, breaking news)
- No reporter/editor roles

**Communication**
- Only in-app notifications + WhatsApp link; no transactional email, SMS, or push

**AI**
- General chatbot exists; no dedicated admission assistant, no recommendation engine, no AI content drafting for admins

**Performance / Scale**
- No PWA / offline
- No image optimization pipeline (vite-imagetools)
- No CDN strategy doc
- No DB indexes review on products/orders/service_requests for 100k-user scale

**SEO**
- No JSON-LD schema (Organization, Product, BreadcrumbList)
- Sitemap is static, not auto-generated from products/categories
- No per-page canonical management beyond home

**UX**
- No profile verification badge UI
- No bookmarks/saved items beyond wishlist
- No global notification center bell in header

### 3. Priority List

**P0 — Security & Trust (must-have)**
1. Audit logs table + admin viewer
2. Enable HIBP leaked-password check
3. 2FA (TOTP) for admins
4. KYC/identity verification (upload ID, admin review, verified badge)

**P1 — Revenue expansion**
5. Vendor self-registration + vendor dashboard (apply → admin approves → upload products)
6. Product reviews + ratings (1–5 stars, verified-purchase flag)
7. Flutterwave as second gateway alongside Paystack
8. Automated PDF invoices on order completion
9. Ad campaign performance (impressions/clicks tracking per promotion)

**P2 — News/Media center**
10. `news_posts` table + reporter/editor roles + scheduled publishing + breaking-news banner
11. Public `/news` index + `/news/:slug` pages with JSON-LD Article schema

**P3 — Communication**
12. Transactional email (Resend) for order/service/promotion status changes
13. Notification bell in header reading `notifications` table in real time
14. Optional SMS via Termii (Nigeria) — gated by budget

**P4 — AI & Recommendations**
15. Admission assistant (dedicated system prompt + curated knowledge)
16. "You may also like" recommendations on product page (category + price proximity)
17. Admin AI content drafting (product descriptions, news drafts)

**P5 — Performance, SEO, PWA**
18. JSON-LD: Organization on home, Product on product page, BreadcrumbList everywhere
19. Auto-generated sitemap edge function pulling products/news
20. Manifest-only PWA (Add to Home Screen) — defer offline unless requested
21. `vite-imagetools` for hero/product images; lazy-load below fold
22. DB indexes: `products(status, category_id, created_at)`, `orders(user_id, created_at)`, `service_requests(user_id, status)`

### 4. Roadmap (suggested order)

| Round | Scope | Why first |
|---|---|---|
| 6 | P0 security (audit logs, HIBP, 2FA, KYC) | Protects everything below |
| 7 | P1a Vendor onboarding + reviews | Unlocks marketplace revenue |
| 8 | P1b Flutterwave + PDF invoices + ad analytics | Completes payments brief |
| 9 | P2 News/Media center | Big surface, isolated module |
| 10 | P3 Email + notification bell | Cross-cutting, needs templates ready |
| 11 | P4 AI upgrades | Builds on news + products data |
| 12 | P5 SEO + PWA + perf + indexes | Final polish before scale |

Each round = its own approved migration(s) + UI + admin tooling, shippable independently.

### 5. Tech Stack (kept consistent)

- Frontend: React 18 + Vite + Tailwind + shadcn (no change)
- Backend: Lovable Cloud (Supabase) — Postgres, RLS, Storage, Edge Functions
- AI: Lovable AI Gateway (google/gemini-3-flash-preview default)
- Payments: Paystack (live) + Flutterwave (to add) + Moniepoint bank transfer
- Email: Resend (to add) ・ SMS: Termii (optional)
- Search/AI: Perplexity (already wired)

### 6. What I need from you

Please confirm:
1. **Approve this roadmap order** (or reorder rounds).
2. **Round 6 scope confirmation**: start with P0 security (audit logs + HIBP + 2FA-for-admins + KYC verification). This needs one DB migration (audit_logs, kyc_submissions, storage bucket `kyc-documents`) + admin pages + a user "Verify Identity" flow.
3. **Flutterwave**: do you have a Flutterwave merchant account ready? If yes I'll request the secret when we reach Round 8.
4. **Resend**: same question for transactional email in Round 10.

Reply "approve round 6" (or with edits) and I'll start implementation.
