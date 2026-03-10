# SEO Changelog

All maintenance runs and SEO changes are logged here for tracking and accountability.

---

## [2026-03-11] Maintenance Run

- **Structure Status:** ✅ Pass
- **Media Status:** ✅ Pass
- **Technical Status:** ✅ Pass
- **Actions Taken:** No issues found — System Healthy

### Audit Summary
| Audit | Result | Details |
|-------|--------|---------|
| Structure | ✅ Pass | 16/16 metadata pages have openGraph + twitter. Layout has metadataBase, title.template. All pages have exactly 1 H1. Organization ld+json present. |
| Media | ✅ Pass | Zero legacy `<img>` tags. All `<Image>` components have alt text. All external links have `target="_blank"` + `rel="noopener noreferrer"`. No broken internal links. |
| Technical | ✅ Pass | `robots.ts` (MetadataRoute.Robots), `sitemap.ts` (MetadataRoute.Sitemap), `manifest.ts` (MetadataRoute.Manifest) — all present. |

### Previous Fixes Applied (Pre-Maintenance)
| Fix | Files | Date |
|-----|-------|------|
| Added `metadataBase` + `title.template` | `layout.tsx` | 2026-03-11 |
| Added global `openGraph` + `twitter` | `layout.tsx` | 2026-03-11 |
| Added Organization ld+json | `layout.tsx` | 2026-03-11 |
| Added openGraph + twitter | 14 static pages + 2 dynamic pages | 2026-03-11 |
| Fixed dual H1 in blog/[slug] | `blog/[slug]/page.tsx` | 2026-03-11 |
| Fixed broken `/forgot-password` link | `login/page.tsx` | 2026-03-11 |
| Created `manifest.ts` | `app/manifest.ts` | 2026-03-11 |
