import { prisma } from "./prisma";

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    category: "pre-built bots" | "self-develop-bots" | string;
    author: string;
    publishDate: string;
    image: string;
    readTime: string;
    isDownloadable?: boolean;
    downloadUrl?: string; // If free download
    price?: "Free" | "Premium";
}

export const BLOG_CATEGORIES = [
    "All",
    "pre-built bots",
    "self-develop-bots"
] as const;

export async function getAllCategories(): Promise<string[]> {
    try {
        const categories = await prisma.category.findMany({
            where: { status: "active" },
            orderBy: { name: "asc" }
        });
        if (categories.length > 0) {
            return ["All", ...categories.map(c => c.name)];
        }
    } catch (e) {
        console.error("Failed to fetch categories:", e);
    }
    // Fallback to hardcoded
    return [...BLOG_CATEGORIES];
}

function mapToBlogPost(blog: any): BlogPost {
    const categoryName = blog.categories && blog.categories.length > 0
        ? blog.categories[0].category.name
        : "pre-built bots";

    // Fallback image if null
    const image = blog.featuredImages || "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=1000&auto=format&fit=crop";

    let publishDate = "Recently";
    try {
        const dateObj = blog.createdAt instanceof Date ? blog.createdAt : new Date(blog.createdAt || Date.now());
        if (!isNaN(dateObj.getTime())) {
            publishDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        }
    } catch (e) {
        // Fallback already set
    }

    return {
        id: blog.id.toString(),
        title: blog.title,
        slug: blog.seoSlug,
        description: blog.excerpt || "",
        content: blog.content,
        category: categoryName,
        author: blog.author || "AlgoTeam",
        publishDate: publishDate,
        image,
        readTime: "5 min read", // Approx
        isDownloadable: !!blog.downloadLink,
        downloadUrl: blog.downloadLink || undefined,
        price: blog.downloadLink ? "Free" : "Premium",
    };
}

export async function getAllPosts(): Promise<BlogPost[]> {
    const blogs = await prisma.blog.findMany({
        where: { status: "published" },
        include: { categories: { include: { category: true } } },
        orderBy: { createdAt: "desc" }
    });
    return blogs.map(mapToBlogPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const blog = await prisma.blog.findUnique({
        where: { seoSlug: slug },
        include: { categories: { include: { category: true } } }
    });

    if (!blog) return undefined;
    return mapToBlogPost(blog);
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
    if (category === "All") return getAllPosts();

    const blogs = await prisma.blog.findMany({
        where: {
            status: "published",
            categories: {
                some: {
                    category: {
                        name: category
                    }
                }
            }
        },
        include: { categories: { include: { category: true } } },
        orderBy: { createdAt: "desc" }
    });

    return blogs.map(mapToBlogPost);
}

export async function getLatestPosts(limit: number = 6): Promise<BlogPost[]> {
    const blogs = await prisma.blog.findMany({
        where: { status: "published" },
        take: limit,
        include: { categories: { include: { category: true } } },
        orderBy: { createdAt: "desc" }
    });
    return blogs.map(mapToBlogPost);
}

