
import { getPostBySlug, getPostsByCategory, getAllPosts } from "@/lib/blog-data";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin, Download, ShieldCheck, Mail } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) {
        return {
            title: "Article Not Found - AlgoTradingBot",
        }
    }
    return {
        title: `${post.title} - AlgoTradingBot Blog`,
        description: post.description,
        openGraph: {
            images: [post.image]
        }
    };
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">404</h1>
                    <p className="text-gray-400">Article not found.</p>
                    <Link href="/blog" className="text-neon-green hover:underline">Back to Blog</Link>
                </div>
            </div>
        );
    }

    // Get related posts
    const allCategoryPosts = await getPostsByCategory(post.category);
    const relatedPosts = allCategoryPosts
        .filter((p) => p.id !== post.id)
        .slice(0, 3);

    return (
        <article className="min-h-screen bg-black text-white pb-24 pt-24 md:pt-32">
            {/* Breadcrumb Section (Top bar) */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 md:mb-12">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-neon-green transition-colors mb-6"
                >
                    <ArrowLeft size={16} />
                    Back to Insights
                </Link>

                <div className="flex flex-col gap-6">
                    {/* Category Badge */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-bold uppercase tracking-wider w-fit">
                        {post.category}
                    </span>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-5xl">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 border-b border-white/10 pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center">
                                <User size={14} className="text-white" />
                            </div>
                            <span className="font-medium text-white">{post.author}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-neon-green" />
                            <span>{post.publishDate}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <span>{post.readTime}</span>
                    </div>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 lg:gap-16">

                {/* Left Column: Content */}
                <div>
                    {/* Featured Image (In-content, not full background) */}
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-12 group">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                            sizes="(max-width: 1024px) 100vw, 800px"
                        />
                        {/* Subtle Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Rich Text Content */}
                    <div
                        className="prose prose-invert prose-lg max-w-none 
                prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white 
                prose-a:text-neon-green prose-li:text-gray-300
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:border-l-4 [&_h2]:border-neon-green [&_h2]:pl-4
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-4
                [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:border [&_img]:border-white/10
                [&_p]:leading-relaxed [&_p]:mb-6
                "
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>

                {/* Right Column: Sticky Sidebar with CTA */}
                <div className="space-y-8">
                    <div className="sticky top-24 space-y-8">

                        {/* Product/Bot Action Card */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-2">Algorithm Status</h3>
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`inline-block w-2 h-2 rounded-full ${post.isDownloadable || post.price === 'Free' ? 'bg-neon-green animate-pulse' : 'bg-blue-500'}`} />
                                <span className="text-sm font-medium text-gray-300">
                                    {post.isDownloadable || post.price === 'Free' ? 'Available for Download' : 'Premium Access Only'}
                                </span>
                            </div>

                            {post.isDownloadable || post.price === 'Free' ? (
                                <>
                                    <div className="mb-6">
                                        <span className="text-3xl font-bold text-white">Free</span>
                                        <span className="text-gray-500 text-sm ml-2">/ Lite Version</span>
                                    </div>
                                    <a
                                        href={post.downloadUrl || "#"}
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-neon-green text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-[1.02] transition-all mb-4"
                                    >
                                        <Download size={20} />
                                        Download Bot Now
                                    </a>
                                    <p className="text-xs text-center text-gray-500">
                                        <ShieldCheck size={12} className="inline mr-1" />
                                        Virus Scanned & Backtested
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <span className="text-3xl font-bold text-white">Premium</span>
                                        <span className="text-gray-500 text-sm ml-2">/ License Key Required</span>
                                    </div>
                                    <Link
                                        href="/contact"
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-[1.02] transition-all mb-4"
                                    >
                                        <Mail size={20} />
                                        Contact Sales
                                    </Link>
                                    <p className="text-xs text-center text-gray-500">
                                        Includes 24/7 Support & Updates
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Share Card */}
                        <div className="p-6 rounded-2xl bg-transparent border border-white/10">
                            <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Share this insights</h4>
                            <div className="flex gap-2">
                                <button className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-[#1DA1F2] hover:text-white transition-colors flex justify-center text-gray-400">
                                    <Twitter size={18} />
                                </button>
                                <button className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-[#4267B2] hover:text-white transition-colors flex justify-center text-gray-400">
                                    <Facebook size={18} />
                                </button>
                                <button className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-[#0077b5] hover:text-white transition-colors flex justify-center text-gray-400">
                                    <Linkedin size={18} />
                                </button>
                                <button className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-neon-green hover:text-black transition-colors flex justify-center text-gray-400">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 md:px-12 mt-24 border-t border-white/10 pt-16">
                    <h2 className="text-3xl font-bold text-white mb-12">Related Algorithms & Research</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedPosts.map((relatedPost, idx) => (
                            <BlogCard key={relatedPost.id} post={relatedPost} index={idx} />
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
