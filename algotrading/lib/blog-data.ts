// Backend API URL - uses environment variable or falls back to production URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.algotradingbot.online";

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    category: string;
    author: string;
    publishDate: string;
    image: string;
    readTime: string;
    isDownloadable?: boolean;
    downloadUrl?: string;
    price?: "Free" | "Premium";
}

// Default fallback categories
export const BLOG_CATEGORIES = [
    "All",
    "pre-built",
    "self-develop"
] as const;

export async function getAllCategories(): Promise<string[]> {
    try {
        const res = await fetch(`${API_URL}/categories/`, { next: { revalidate: 60 } });
        if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
                return ["All", ...data.map((c: any) => c.name)];
            }
        }
    } catch (e) {
        console.error("Failed to fetch categories from API:", e);
    }
    return [...BLOG_CATEGORIES];
}

export async function getAllPosts(): Promise<BlogPost[]> {
    try {
        const res = await fetch(`${API_URL}/api/posts`, { next: { revalidate: 60 } });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error("Failed to fetch posts from API:", e);
    }
    return [];
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
    if (category === "All") return getAllPosts();
    try {
        const res = await fetch(`${API_URL}/api/posts?category=${encodeURIComponent(category)}`, { next: { revalidate: 60 } });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error("Failed to fetch posts by category:", e);
    }
    return [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    // Fetch all posts and find by slug (backend doesn't have a slug endpoint yet)
    const posts = await getAllPosts();
    return posts.find(p => p.slug === slug);
}

export async function getLatestPosts(limit: number = 6): Promise<BlogPost[]> {
    const posts = await getAllPosts();
    return posts.slice(0, limit);
}
