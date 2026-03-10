/**
 * IndexNow Protocol Utility
 *
 * Submits URLs to all IndexNow-supporting search engines:
 * Microsoft Bing, Yandex, Naver, Seznam.cz, Yep
 *
 * @see https://www.indexnow.org/documentation
 */

const SITE_URL =
    process.env.SITE_URL || "https://algotradingbot.online";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "";

// All search engines that support IndexNow
const INDEXNOW_ENGINES = [
    "api.indexnow.org",      // shared endpoint (routes to all)
    "www.bing.com",          // Microsoft Bing
    "yandex.com",            // Yandex
    "searchadvisor.naver.com", // Naver
    "search.seznam.cz",      // Seznam
    "indexnow.yep.com",      // Yep
];

export interface IndexNowResult {
    engine: string;
    status: number;
    ok: boolean;
    message: string;
}

/**
 * Submit a single URL to all IndexNow search engines
 */
export async function submitUrl(url: string): Promise<IndexNowResult[]> {
    if (!INDEXNOW_KEY) {
        console.warn("[IndexNow] No INDEXNOW_KEY set. Skipping submission.");
        return [];
    }

    const results: IndexNowResult[] = [];

    for (const engine of INDEXNOW_ENGINES) {
        try {
            const endpoint = `https://${engine}/indexnow?url=${encodeURIComponent(url)}&key=${INDEXNOW_KEY}`;
            const res = await fetch(endpoint, { method: "GET" });
            results.push({
                engine,
                status: res.status,
                ok: res.status === 200 || res.status === 202,
                message: res.status === 200 || res.status === 202 ? "Submitted" : `HTTP ${res.status}`,
            });
        } catch (error: any) {
            results.push({
                engine,
                status: 0,
                ok: false,
                message: error.message || "Network error",
            });
        }
    }

    return results;
}

/**
 * Submit multiple URLs (batch) to all IndexNow search engines
 * Supports up to 10,000 URLs per batch
 */
export async function submitUrls(urls: string[]): Promise<IndexNowResult[]> {
    if (!INDEXNOW_KEY) {
        console.warn("[IndexNow] No INDEXNOW_KEY set. Skipping submission.");
        return [];
    }

    if (urls.length === 0) return [];
    if (urls.length === 1) return submitUrl(urls[0]);

    const host = new URL(SITE_URL).hostname;
    const results: IndexNowResult[] = [];

    const body = JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls.slice(0, 10000), // IndexNow max is 10,000
    });

    for (const engine of INDEXNOW_ENGINES) {
        try {
            const res = await fetch(`https://${engine}/indexnow`, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body,
            });
            results.push({
                engine,
                status: res.status,
                ok: res.status === 200 || res.status === 202,
                message: res.status === 200 || res.status === 202
                    ? `Submitted ${urls.length} URLs`
                    : `HTTP ${res.status}`,
            });
        } catch (error: any) {
            results.push({
                engine,
                status: 0,
                ok: false,
                message: error.message || "Network error",
            });
        }
    }

    return results;
}

/**
 * Get all site URLs from the sitemap for bulk submission
 */
export async function getAllSiteUrls(): Promise<string[]> {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://api.algotradingbot.online";

    // Static pages
    const staticPaths = [
        "/", "/services", "/blog", "/contact", "/faq", "/docs",
        "/custom-ea", "/pre-bot-indicators", "/already-develop-ea",
        "/self-develop-ea", "/get-started", "/performance-bots",
        "/how-we-work", "/privacy", "/terms", "/support",
    ];

    // Service slugs
    const serviceSlugs = [
        "broking-houses", "hedge-funds", "prop-desks",
        "rias", "quant-devs", "retail-traders",
    ];

    const urls: string[] = [
        ...staticPaths.map((p) => `${SITE_URL}${p}`),
        ...serviceSlugs.map((s) => `${SITE_URL}/services/${s}`),
    ];

    // Dynamic blog posts
    try {
        const res = await fetch(`${API_URL}/api/posts`, {
            next: { revalidate: 3600 },
        });
        if (res.ok) {
            const posts: { slug: string }[] = await res.json();
            posts.forEach((p) => {
                if (p.slug) urls.push(`${SITE_URL}/blog/${p.slug}`);
            });
        }
    } catch (e) {
        console.error("[IndexNow] Failed to fetch blog posts for URL list:", e);
    }

    return urls;
}
