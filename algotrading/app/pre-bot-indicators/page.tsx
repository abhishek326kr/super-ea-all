import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Bot, TrendingUp, BarChart3, Activity, Gauge, Shield } from "lucide-react";
import BlogSection from "@/components/BlogSection";

export const metadata: Metadata = {
    title: "Pre-Built BOTs & Indicators - AlgoTradingBot",
    description: "Ready-to-deploy trading bots and custom indicators for MT4/MT5. Tested, optimized, and profitable strategies available instantly.",
};

const bots = [
    { name: "Gold Scalper Pro", asset: "XAUUSD", winRate: "89.2%", type: "Scalper", price: "$149" },
    { name: "Forex Trend Rider", asset: "EURUSD/GBPUSD", winRate: "82.7%", type: "Trend", price: "$99" },
    { name: "Crypto Arbitrage V3", asset: "BTC/ETH", winRate: "94.1%", type: "Arbitrage", price: "$249" },
    { name: "Index Momentum AI", asset: "US30/NAS100", winRate: "78.5%", type: "Momentum", price: "$199" },
    { name: "Smart Grid Trader", asset: "Multi-pair", winRate: "91.3%", type: "Grid", price: "$179" },
    { name: "News Scalper Elite", asset: "Major Pairs", winRate: "71.4%", type: "News", price: "$129" },
];

const indicators = [
    { name: "Trend Master Pro", desc: "Multi-timeframe trend detection with signal arrows and alerts.", price: "$49" },
    { name: "Supply & Demand Zones", desc: "Automatically plots institutional S/D zones with strength ratings.", price: "$59" },
    { name: "Smart Money Concepts", desc: "Order blocks, FVG, BOS/CHoCH detection with customizable display.", price: "$79" },
    { name: "Volatility Dashboard", desc: "Real-time ATR, session ranges, and pip movement tracker.", price: "$39" },
];

export default function PreBotIndicatorsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mx-auto">
                        <Bot className="w-4 h-4" /> Priority Service — P2
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                        Pre-Built <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">BOTs & Indicators</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                        Skip the development. Deploy battle-tested trading bots and premium indicators that are ready to generate profits from day one.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="w-full border-y border-white/5 bg-black/50">
                <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
                    {[
                        { icon: TrendingUp, value: "87.4%", label: "Avg Win Rate" },
                        { icon: Activity, value: "50+", label: "Active Bots" },
                        { icon: Gauge, value: "<50ms", label: "Execution Speed" },
                        { icon: Shield, value: "30 Days", label: "Money-Back" },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center px-4">
                            <stat.icon className="w-5 h-5 text-blue-400 mb-2" />
                            <h3 className="text-2xl font-black text-white mb-1">{stat.value}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bots */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Trading <span className="text-neon-green">BOTs</span></h2>
                    <p className="text-gray-400 text-center mb-12">Plug-and-play Expert Advisors for MT4/MT5</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bots.map((bot, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-neon-green/30 transition-all group">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-white">{bot.name}</h3>
                                    <span className="px-2 py-1 text-xs font-bold bg-neon-green/10 text-neon-green rounded-full">{bot.type}</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">{bot.asset}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-400">Win Rate: <strong className="text-neon-green">{bot.winRate}</strong></span>
                                    <span className="text-xl font-black text-white">{bot.price}</span>
                                </div>
                                <Link href="/contact" className="block w-full py-2.5 text-center bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-neon-green hover:text-black hover:border-neon-green transition-all text-sm">
                                    Get This Bot
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Indicators */}
            <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Premium <span className="text-blue-400">Indicators</span></h2>
                    <p className="text-gray-400 text-center mb-12">Enhance your chart analysis with institutional-grade tools</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {indicators.map((ind, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 flex-shrink-0">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-bold text-white">{ind.name}</h3>
                                        <span className="text-lg font-black text-white">{ind.price}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3">{ind.desc}</p>
                                    <Link href="/contact" className="text-blue-400 text-sm font-semibold flex items-center gap-1 hover:text-blue-300 transition-colors">
                                        Purchase <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blogs */}
            <BlogSection
                category="pre-built"
                title="Pre-Bot Strategies &"
                subtitle="Insights"
                description="Learn the latest strategies and techniques for using pre-built trading bots."
            />

            {/* CTA */}
            <section className="w-full py-20 px-6">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-neon-green/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-black border border-white/10 rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need a Custom Solution?</h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">Can&apos;t find what you need? We can build a custom bot or indicator tailored to your exact strategy.</p>
                        <Link href="/custom-ea" className="inline-flex items-center gap-2 px-8 py-4 bg-neon-green text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-105 transition-all">
                            Request Custom EA <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
