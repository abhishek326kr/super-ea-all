
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { BlogPost } from "@/lib/blog-data";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=1000&auto=format&fit=crop";

function safeImageUrl(raw: string | undefined | null): string {
    if (!raw || typeof raw !== "string") return FALLBACK_IMAGE;
    // Handle JSON array strings like '["https://..."]'
    if (raw.startsWith("[")) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        } catch { /* fall through */ }
    }
    // Check if it's a valid URL
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return FALLBACK_IMAGE;
}

interface BlogCardProps {
    post: BlogPost;
    index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
    const imageUrl = safeImageUrl(post.image);
    return (
        <Link href={`/blog/${post.slug}`} className="group h-full flex flex-col">
            <div
                className="relative h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-neon-green/50 hover:shadow-[0_0_30px_rgba(57,255,20,0.15)] hover:-translate-y-1 flex flex-col"
            >
                {/* Image Section */}
                <div className="relative w-full h-48 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />

                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neon-green/90 text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg backdrop-blur-md">
                            <Tag size={10} strokeWidth={3} />
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-neon-green" />
                            <span>{post.publishDate}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-neon-green" />
                            <span>{post.readTime}</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-neon-green transition-colors">
                        {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {post.description}
                    </p>

                    <div className="flex items-center text-neon-green text-sm font-semibold mt-auto group/btn">
                        Read Article
                        <ArrowRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
