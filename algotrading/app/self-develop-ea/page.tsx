import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, BookOpen, TestTube, Rocket, Users, Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "Self-Develop EA - AlgoTradingBot | Build Your Own Expert Advisor",
    description: "Learn to build your own Expert Advisors with our comprehensive tools, tutorials, and development environment. From beginner to professional MQL developer.",
};

export default function SelfDevelopEAPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-green/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium w-fit">
                                <Code2 className="w-4 h-4" /> Priority Service — P4
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                                Self-Develop <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Your EA</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
                                Build your own Expert Advisors using our development tools, tutorials, and community support. From no-code builders to full MQL programming — everything you need to create profitable bots.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/register" className="px-8 py-4 bg-neon-green text-black font-extrabold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-105 transition-all flex items-center gap-2 group">
                                    Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/docs" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                                    Read Documentation
                                </Link>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: "5,000+", label: "Developers" },
                                { value: "200+", label: "Tutorials" },
                                { value: "Free", label: "IDE Access" },
                                { value: "24/7", label: "Community" },
                            ].map((stat, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[140px]">
                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</h3>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Paths */}
            <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">Choose Your <span className="text-purple-400">Path</span></h2>
                    <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Whether you&apos;re a complete beginner or an experienced coder, we have the right tools for you.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                level: "Beginner",
                                title: "No-Code Builder",
                                desc: "Use our visual drag-and-drop interface to create EAs without writing any code. Perfect for traders with no programming experience.",
                                features: ["Drag-and-drop strategy builder", "Pre-built logic blocks", "Visual backtesting", "One-click deployment", "Template library"],
                                color: "from-green-500 to-emerald-600",
                                tag: "No Experience Needed",
                            },
                            {
                                level: "Intermediate",
                                title: "Low-Code Studio",
                                desc: "Combine visual builders with simple scripting for more complex strategies. Use our simplified syntax that compiles to MQL.",
                                features: ["Simplified scripting language", "Code-assist & autocomplete", "Built-in indicator library", "Multi-timeframe support", "Step-by-step tutorials"],
                                color: "from-blue-500 to-cyan-600",
                                tag: "Basic Knowledge",
                            },
                            {
                                level: "Advanced",
                                title: "Full-Code IDE",
                                desc: "Professional MQL4/MQL5 development environment with debugging, version control, and direct MetaTrader integration.",
                                features: ["Professional MQL IDE", "Real-time debugging tools", "Git integration", "Strategy profiler", "ML/AI model integration"],
                                color: "from-purple-500 to-violet-600",
                                tag: "For Developers",
                            },
                        ].map((path, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all group">
                                <span className={`inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r ${path.color} text-white rounded-full mb-4`}>{path.tag}</span>
                                <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-1">{path.level}</p>
                                <h3 className="text-2xl font-bold text-white mb-3">{path.title}</h3>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{path.desc}</p>
                                <ul className="space-y-3 mb-6">
                                    {path.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                            <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/register" className="block w-full py-3 text-center bg-white/5 border border-white/20 text-white font-bold rounded-xl hover:bg-purple-500 hover:border-purple-500 transition-all text-sm">
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources */}
            <section className="py-24 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">Resources & <span className="text-neon-green">Tools</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: BookOpen, title: "MQL Tutorials", desc: "200+ step-by-step tutorials from basics to advanced strategies." },
                            { icon: TestTube, title: "Strategy Tester", desc: "Cloud-based backtesting with tick data and multi-currency support." },
                            { icon: Code2, title: "Code Snippets", desc: "Library of reusable code snippets for common trading functions." },
                            { icon: Rocket, title: "Deploy Pipeline", desc: "One-click deployment from IDE to your live MT4/MT5 account." },
                            { icon: Users, title: "Community Forum", desc: "Connect with 5,000+ developers sharing code, strategies, and tips." },
                            { icon: Shield, title: "Code Review", desc: "Submit your EA for professional code review and optimization." },
                        ].map((resource, idx) => (
                            <div key={idx} className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all group">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-5 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                    <resource.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3">{resource.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{resource.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full py-20 px-6">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-neon-green/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-black border border-white/10 rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Don&apos;t Want to Code?</h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">Let our team build a custom EA for you. Share your strategy and we handle the rest.</p>
                        <Link href="/custom-ea" className="inline-flex items-center gap-2 px-8 py-4 bg-neon-green text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-105 transition-all">
                            Request Custom EA <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
