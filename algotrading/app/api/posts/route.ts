
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.algotradingbot.online";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        const apiUrl = category
            ? `${API_URL}/api/posts?category=${encodeURIComponent(category)}`
            : `${API_URL}/api/posts`;

        const res = await fetch(apiUrl, { next: { revalidate: 60 } });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch posts" }, { status: res.status });
        }

        const posts = await res.json();
        return NextResponse.json(posts);
    } catch (e: any) {
        console.error("Posts API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
