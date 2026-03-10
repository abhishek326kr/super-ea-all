# SEO Audit — Structure Report

**Site:** AlgoTradingBot.online  
**Framework:** Next.js 16.1.6 (App Router)  
**Scan Date:** 2026-03-11 (Fresh Maintenance Run)  
**Total Pages Scanned:** 20 `page.tsx` files

---

## 1. Metadata Completeness

### Pages with `export const metadata` (14/20) ✅
| Page | `title` | `description` | `openGraph` | `twitter` |
|------|---------|---------------|-------------|-----------|
| `already-develop-ea/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `blog/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `contact/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `custom-ea/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `docs/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `faq/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `get-started/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `how-we-work/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `performance-bots/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `pre-bot-indicators/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `privacy/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `self-develop-ea/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `services/page.tsx` | ✅ | ✅ | ✅ | ✅ |
| `terms/page.tsx` | ✅ | ✅ | ✅ | ✅ |

### Pages with `generateMetadata()` (2/20) ✅
| Page | `title` | `description` | `openGraph` | `twitter` |
|------|---------|---------------|-------------|-----------|
| `blog/[slug]/page.tsx` | ✅ | ✅ | ✅ (title, desc, image, type:article) | ✅ (summary_large_image) |
| `services/[slug]/page.tsx` | ✅ | ✅ | ✅ | ✅ |

### Pages Using Layout Fallback (4/20) ✅
| Page | Reason | Status |
|------|--------|--------|
| `page.tsx` (Homepage) | `"use client"` — inherits global openGraph/twitter from layout | ✅ Covered |
| `login/page.tsx` | `"use client"` — inherits from layout | ✅ Covered |
| `register/page.tsx` | `"use client"` — inherits from layout | ✅ Covered |
| `support/page.tsx` | Redirect to `/contact` | ✅ N/A |

---

## 2. Layout Integrity (`app/layout.tsx`)

| Property | Status |
|----------|--------|
| `metadata.metadataBase` | ✅ Present — `new URL(SITE_URL)` |
| `title.template` | ✅ Present — `"%s | AlgoTradingBot"` |
| `openGraph` (global) | ✅ Present — type, locale, siteName, images |
| `twitter` (global) | ✅ Present — `summary_large_image` with creator |
| `keywords` | ✅ Present |
| `robots` | ✅ Present — full googleBot config |
| Google Analytics | ✅ Present — `G-6QJ6559J4F` |

---

## 3. Semantic HTML Audit

### H1 Tag Analysis
✅ **All 19 pages** (excl. `support/` redirect) have **exactly 1 `<h1>` tag**. No duplicates found.

### Nested `<a>` Tags
✅ **None found** — all pages use `<Link>` correctly.

### Structured Data (`<script type="application/ld+json">`)
| Scope | Schema | Status |
|-------|--------|--------|
| `layout.tsx` (site-wide) | `Organization` | ✅ Present |

---

## 🟢 Overall Status: PASS — No issues found.
