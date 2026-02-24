
import BlogList from "@/components/BlogList";
import { getAllPosts } from "@/lib/blog-data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "AlgoTradingBot Blog - Expert Insights & Market Analysis",
    description: "Stay ahead with advanced algorithmic trading strategies, AI market analysis, and trading bot tutorials.",
};

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Page Header */}
                <div className="text-center md:text-left space-y-4 border-b border-white/10 pb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                        Market <span className="text-neon-green">Insights</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Deep dives into algorithmic trading, quantitative analysis, and the future of AI in finance.
                    </p>
                </div>

                {/* Blog Content with Sidebar */}
                <Suspense fallback={<div className="text-white text-center">Loading categories...</div>}>
                    <BlogList initialPosts={posts} />
                </Suspense>
            </div>
        </div>
    );
}
