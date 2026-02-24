"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogCard from "./BlogCard";
import { BlogPost } from "@/lib/blog-data";

export default function BlogSection({
    category,
    title = "Latest Insights &",
    subtitle = "Market Research",
    description = "Stay ahead of the market with our expert analysis, algorithm strategies, and AI trading research."
}: {
    category?: string;
    title?: string;
    subtitle?: string;
    description?: string;
}) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = category
            ? `/api/posts?category=${encodeURIComponent(category)}`
            : "/api/posts";
        fetch(url)
            .then((res) => res.json())
            .then((data: BlogPost[]) => {
                setPosts(data.slice(0, 6));
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [category]);

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="space-y-4 max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                            {title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-500">
                                {subtitle}
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            {description}
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-neon-green/10 hover:border-neon-green/50 hover:text-neon-green transition-all"
                    >
                        <span className="font-semibold">View All Articles</span>
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-80 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <BlogCard key={post.id} post={post} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12">
                        <p className="text-lg">No articles published yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </section>
    );
}
