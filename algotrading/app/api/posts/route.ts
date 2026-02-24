
import { NextResponse } from "next/server";
import { getAllPosts, getPostsByCategory } from "@/lib/blog-data";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        if (category) {
            const posts = await getPostsByCategory(category);
            return NextResponse.json(posts);
        }

        const posts = await getAllPosts();
        return NextResponse.json(posts);
    } catch (e: any) {
        console.error("Posts API Error:", e);
        return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
    }
}
