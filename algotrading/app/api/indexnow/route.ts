import { NextResponse } from "next/server";
import { submitUrl, submitUrls, getAllSiteUrls } from "@/lib/indexnow";

/**
 * POST /api/indexnow
 *
 * Submit specific URLs to IndexNow search engines.
 *
 * Body: { "urls": ["https://algotradingbot.online/blog/my-post"] }
 * Or:   { "url": "https://algotradingbot.online/blog/my-post" }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const urls: string[] = body.urls || (body.url ? [body.url] : []);

        if (urls.length === 0) {
            return NextResponse.json(
                { error: "Provide 'url' (string) or 'urls' (array) in the request body." },
                { status: 400 }
            );
        }

        const results = await submitUrls(urls);

        return NextResponse.json({
            submitted: urls.length,
            results,
        });
    } catch (e: any) {
        console.error("[IndexNow API] Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

/**
 * GET /api/indexnow
 *
 * Submit ALL site URLs (from sitemap) to IndexNow search engines.
 * Useful for initial submission or periodic re-submission.
 */
export async function GET() {
    try {
        const urls = await getAllSiteUrls();
        const results = await submitUrls(urls);

        return NextResponse.json({
            submitted: urls.length,
            urls,
            results,
        });
    } catch (e: any) {
        console.error("[IndexNow API] Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
