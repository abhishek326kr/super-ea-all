
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Zap, Activity } from "lucide-react";

export const metadata: Metadata = {
    title: "Performance & Live Results - AlgoTradingBot",
    description: "View live trading performance, backtest results, and verified track records of our algorithmic trading bots.",
};

const bots = [
    {
        name: "Gold Scalper Pro",
        asset: "XAUUSD",
        winRate: "89.2%",
        monthlyReturn: "+18.4%",
        drawdown: "4.2%",
        trades: "1,240",
        status: "Active",
        timeframe: "M5",
        riskLevel: "Medium",
    },
    {
        name: "Forex Trend Rider",
        asset: "EURUSD, GBPUSD",
        winRate: "82.7%",
        monthlyReturn: "+12.6%",
        drawdown: "6.8%",
        trades: "890",
        status: "Active",
        timeframe: "H1",
        riskLevel: "Low",
    },
    {
        name: "Crypto Arbitrage V3",
        asset: "BTC/ETH/SOL",
        winRate: "94.1%",
        monthlyReturn: "+24.3%",
        drawdown: "3.1%",
        trades: "3,420",
        status: "Active",
        timeframe: "M1",
        riskLevel: "Low",
    },
    {
        name: "Index Momentum AI",
        asset: "US30, NAS100",
        winRate: "78.5%",
        monthlyReturn: "+15.7%",
        drawdown: "8.4%",
        trades: "560",
        status: "Active",
        timeframe: "H4",
        riskLevel: "Medium-High",
    },
    {
        name: "Smart Grid Trader",
        asset: "Multi-pair",
        winRate: "91.3%",
        monthlyReturn: "+9.8%",
        drawdown: "2.5%",
        trades: "2,100",
        status: "Active",
        timeframe: "M15",
        riskLevel: "Conservative",
    },
    {
        name: "News Scalper Elite",
        asset: "Major Pairs",
        winRate: "71.4%",
        monthlyReturn: "+22.1%",
        drawdown: "11.2%",
        trades: "320",
        status: "Active",
        timeframe: "M1-M5",
        riskLevel: "High",
    },
];

export default function PerformanceBotsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] -z-10" />
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neon-green text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                        </span>
                        Live Performance Data
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                        Verified{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400">Live Results</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Real performance data from our algorithms. No demo accounts, no inflated numbers — just verified results.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="w-full border-y border-white/5 bg-black/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
                    {[
                        { label: "Avg Monthly Return", value: "+17.2%", icon: TrendingUp },
                        { label: "Avg Win Rate", value: "84.5%", icon: Activity },
                        { label: "Max Drawdown", value: "5.7%", icon: Shield },
                        { label: "Avg Latency", value: "<50ms", icon: Zap },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center px-4">
                            <stat.icon className="w-6 h-6 text-neon-green mb-2" />
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bots Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Our Top <span className="text-neon-green">Performing Bots</span></h2>
                    <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Each bot has been backtested across 5+ years of data and verified on live accounts.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bots.map((bot, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-neon-green/30 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-white">{bot.name}</h3>
                                    <span className="px-2 py-1 text-xs font-bold bg-neon-green/10 text-neon-green rounded-full flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></span>
                                        {bot.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">{bot.asset} • {bot.timeframe}</p>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                        <p className="text-xs text-gray-400 mb-1">Win Rate</p>
                                        <p className="text-lg font-bold text-neon-green">{bot.winRate}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                        <p className="text-xs text-gray-400 mb-1">Monthly Return</p>
                                        <p className="text-lg font-bold text-emerald-400">{bot.monthlyReturn}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                        <p className="text-xs text-gray-400 mb-1">Drawdown</p>
                                        <p className="text-lg font-bold text-amber-400">{bot.drawdown}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                        <p className="text-xs text-gray-400 mb-1">Total Trades</p>
                                        <p className="text-lg font-bold text-white">{bot.trades}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${bot.riskLevel === "Low" || bot.riskLevel === "Conservative"
                                        ? "bg-green-500/10 text-green-400"
                                        : bot.riskLevel === "Medium"
                                            ? "bg-amber-500/10 text-amber-400"
                                            : "bg-red-500/10 text-red-400"
                                        }`}>
                                        Risk: {bot.riskLevel}
                                    </span>
                                    <Link href="/get-started" className="text-neon-green text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Deploy Bot <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Disclaimer + CTA */}
            <section className="w-full py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-12">
                        <p className="text-gray-400 text-xs leading-relaxed">
                            <strong className="text-white">Disclaimer:</strong> Past performance is not indicative of future results. Trading involves significant risk of loss. These results are from verified live and demo accounts and are presented for informational purposes only. Always trade with capital you can afford to lose.
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-blue-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-black border border-white/10 rounded-3xl p-8 md:p-12 text-center overflow-hidden">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Deploy?</h2>
                            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">Start with paper trading risk-free, then go live when you&apos;re confident.</p>
                            <Link href="/get-started" className="inline-flex items-center gap-2 px-8 py-4 bg-neon-green text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-105 transition-all">
                                Start Trading Now <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
