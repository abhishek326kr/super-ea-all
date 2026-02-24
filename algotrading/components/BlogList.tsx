
"use client";

import { useState } from "react";
import { BlogPost, BLOG_CATEGORIES } from "@/lib/blog-data";
import BlogCard from "./BlogCard";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface BlogListProps {
    initialPosts: BlogPost[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    useEffect(() => {
        if (initialCategory && BLOG_CATEGORIES.includes(initialCategory as any)) {
            setSelectedCategory(initialCategory);
        }
    }, [initialCategory]);

    const filteredPosts = selectedCategory === "All"
        ? initialPosts
        : initialPosts.filter(post => post.category === selectedCategory);

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar / Mobile Tabs */}
            <div className="w-full lg:w-1/4 shrink-0 space-y-8">
                <div className="sticky top-24">
                    <h3 className="text-xl font-bold text-white mb-6 hidden lg:block">Categories</h3>
                    <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                        {BLOG_CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`flex-shrink-0 px-4 py-2 lg:py-3 lg:px-6 rounded-full lg:rounded-xl text-sm lg:text-base font-medium transition-all duration-300 text-left w-auto lg:w-full border ${selectedCategory === category
                                    ? "bg-neon-green/10 text-neon-green border-neon-green/50 shadow-[0_0_15px_rgba(57,255,20,0.2)]"
                                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post, index) => (
                            <motion.div
                                layout
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <BlogCard post={post} index={index} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-24 text-gray-500">
                        No articles found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}
