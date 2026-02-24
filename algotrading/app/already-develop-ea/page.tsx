import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Download, Settings, Shield, RefreshCw, Wrench, HeadphonesIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "Already Developed EA - AlgoTradingBot",
    description: "Browse and download our collection of pre-developed Expert Advisors. Tested, optimized, and ready for deployment on MT4/MT5.",
};

const eas = [
    { name: "Gold Scalper V4.2", pair: "XAUUSD", tf: "M5-M15", type: "Scalper", status: "Available", desc: "Aggressive gold scalping with smart lot sizing and session filters." },
    { name: "Trend Pro EA", pair: "EURUSD, GBPUSD", tf: "H1-H4", type: "Trend Following", status: "Available", desc: "Catches strong trends using moving averages and ADX confirmation." },
    { name: "Grid Master 3.0", pair: "Multi-pair", tf: "Any", type: "Grid", status: "Available", desc: "Smart grid trading with dynamic spacing and equity protection." },
    { name: "Breakout Hunter", pair: "Major Pairs", tf: "M15-H1", type: "Breakout", status: "Available", desc: "Detects session breakouts with volatility filters and momentum confirmation." },
    { name: "Hedge Pro EA", pair: "Correlated Pairs", tf: "H1", type: "Hedging", status: "Available", desc: "Statistical arbitrage between correlated pairs with automatic hedging." },
    { name: "Martingale Safe", pair: "EURUSD", tf: "M5", type: "Martingale", status: "Available", desc: "Conservative martingale with strict drawdown limits and equity stops." },
];

export default function AlreadyDevelopEAPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gray-500/5 rounded-full blur-[120px] -z-10" />
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400 text-sm font-medium mx-auto">
                        <Download className="w-4 h-4" /> Priority Service — P3
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                        Already <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">Developed EA</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                        Browse our library of pre-built Expert Advisors. Each EA has been tested, optimized, and is ready for immediate deployment on your MT4/MT5 account.
                    </p>
                </div>
            </section>

            {/* EA Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Available <span className="text-neon-green">Expert Advisors</span></h2>
                    <p className="text-gray-400 text-center mb-12">Download, configure, and start trading</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {eas.map((ea, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-gray-400/30 transition-all group">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-white">{ea.name}</h3>
                                    <span className="px-2 py-1 text-xs font-bold bg-neon-green/10 text-neon-green rounded-full flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-neon-green rounded-full"></span>
                                        {ea.status}
                                    </span>
                                </div>
                                <div className="flex gap-2 mb-3">
                                    <span className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded">{ea.pair}</span>
                                    <span className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded">{ea.tf}</span>
                                    <span className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded">{ea.type}</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">{ea.desc}</p>
                                <Link href="/contact" className="block w-full py-2.5 text-center bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-neon-green hover:text-black hover:border-neon-green transition-all text-sm flex items-center justify-center gap-2">
                                    <Download className="w-4 h-4" /> Get This EA
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">What&apos;s <span className="text-neon-green">Included</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { icon: Download, title: "Compiled EA File", desc: "Ready-to-install .ex4/.ex5 file for immediate deployment." },
                            { icon: Settings, title: "User Guide", desc: "Step-by-step installation and configuration documentation." },
                            { icon: Shield, title: "Risk Settings", desc: "Pre-configured risk parameters with recommended settings." },
                            { icon: RefreshCw, title: "Free Updates", desc: "Lifetime updates for bug fixes and performance improvements." },
                            { icon: Wrench, title: "Set Files", desc: "Optimized .set files for different market conditions." },
                            { icon: HeadphonesIcon, title: "Support", desc: "Telegram support for installation and configuration help." },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need Something Custom?</h2>
                    <p className="text-gray-400 text-lg mb-8">If none of these EAs match your strategy, we can build one from scratch.</p>
                    <Link href="/custom-ea" className="inline-flex items-center gap-2 px-8 py-4 bg-neon-green text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-105 transition-all">
                        Request Custom EA <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
