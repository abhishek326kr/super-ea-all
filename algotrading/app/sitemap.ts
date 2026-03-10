import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.SITE_URL || "https://algotradingbot.online";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.algotradingbot.online";

// All known static pages
const staticPages = [
  { path: "/", changeFrequency: "daily" as const, priority: 1.0 },
  { path: "/services", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/blog", changeFrequency: "daily" as const, priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/docs", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/custom-ea", changeFrequency: "weekly" as const, priority: 0.8 },
  {
    path: "/pre-bot-indicators",
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  {
    path: "/already-develop-ea",
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  {
    path: "/self-develop-ea",
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  {
    path: "/get-started",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    path: "/performance-bots",
    changeFrequency: "daily" as const,
    priority: 0.8,
  },
  {
    path: "/how-we-work",
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/support", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/login", changeFrequency: "yearly" as const, priority: 0.2 },
  { path: "/register", changeFrequency: "yearly" as const, priority: 0.3 },
];

// Known service slugs (must match serviceData keys in services/[slug]/page.tsx)
const serviceSlugs = [
  "broking-houses",
  "hedge-funds",
  "prop-desks",
  "rias",
  "quant-devs",
  "retail-traders",
];

async function fetchBlogSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const posts: { slug: string }[] = await res.json();
      return posts.map((p) => p.slug).filter(Boolean);
    }
  } catch (e) {
    console.error("[Sitemap] Failed to fetch blog posts:", e);
  }
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Static pages
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // 2. Service sub-pages
  const serviceEntries: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Blog posts (dynamic)
  const blogSlugs = await fetchBlogSlugs();
  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
