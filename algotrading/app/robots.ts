import type { MetadataRoute } from "next";

const SITE_URL =
    process.env.SITE_URL || "https://algotradingbot.online";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/login", "/register"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
