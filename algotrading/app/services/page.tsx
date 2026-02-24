
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Services - AlgoTradingBot | Algorithmic Trading Solutions",
    description: "Institutional-grade algorithmic trading infrastructure for brokers, hedge funds, prop desks, quant developers, and retail traders.",
};

const services = [
    {
        id: "broking-houses",
        iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /></svg>
        ),
        title: "Broking Houses & Fintech Platforms",
        tagline: "White-labeled algo trading for your clients",
        desc: "Offer algorithmic trading capabilities to your clients with white-labeled, scalable, compliant infrastructure. Seamless integration, enterprise-grade execution, audit-ready logs, and SLA-backed stability.",
        features: [
            "White-label ready — your brand, our engine",
            "Enterprise-grade execution with sub-50ms latency",
            "Full audit trail & compliance-ready logging",
            "SLA-backed 99.99% uptime guarantee",
            "Multi-tenant architecture for scalability",
            "RESTful API & WebSocket integration",
        ],
        cta: "Explore Enterprise Solutions",
    },
    {
        id: "hedge-funds",
        iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7"><path d="M7 8l5-5 5 5M7 16l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ),
        title: "Hedge Funds & Asset Managers",
        tagline: "Automate portfolio strategies at scale",
        desc: "Automate portfolio strategies, reduce manual execution risk, and offer enhanced execution algos to clients under your own brand. Designed for institutional volume.",
        features: [
            "Portfolio-level strategy automation",
            "Smart order routing across venues",
            "Real-time risk analytics dashboard",
            "Custom algo development support",
            "Execution quality analysis (TCA)",
            "FIX protocol connectivity",
        ],
        cta: "Explore Enterprise Solutions",
    },
    {
        id: "prop-desks",
        iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        ),
        title: "Proprietary & Quantitative Trading Desks",
        tagline: "Deploy proprietary models with zero infra burden",
        desc: "Deploy proprietary models securely using our infra. Scale execution with full control, zero infra burden, and real-time analytics. Built for speed and precision.",
        features: [
            "Secure model deployment sandbox",
            "Co-location grade infrastructure",
            "Real-time P&L and position tracking",
            "Custom risk parameter configuration",
            "Multi-strategy concurrent execution",
            "Advanced backtesting framework",
        ],
        cta: "Explore Institutional Offering",
    },
    {
        id: "rias",
        iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7"><path d="M3 21l4-4m0 0l4-4m-4 4V7m14 14l-4-4m0 0l-4-4m4 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ),
        title: "RIAs & RAs",
        tagline: "Compliance-first algorithmic infrastructure",
        desc: "Develop and deploy strategies for your internal use or for your clients with full compliance visibility. Build using no-code, low-code, or full code tools — backed by institutional-grade infrastructure.",
        features: [
            "No-code strategy builder for advisors",
            "Full compliance visibility & audit logs",
            "Client-level portfolio allocation",
            "Automated rebalancing workflows",
            "White-glove onboarding support",
            "Regulatory reporting integration",
        ],
        cta: "Explore Enterprise Solutions",
    },
    {
        id: "quant-devs",
        iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7"><rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="M6 12h3m3 0h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        ),
        title: "Quant Developers & Technical Teams",
        tagline: "Build, test, and deploy with powerful dev tools",
        desc: "Build advanced strategies using Python, ML, CLI, notebooks, or external signal integrations — without needing to manage servers, APIs, or high-availability systems.",
        features: [
            "Python SDK & Jupyter Notebook support",
            "ML model pipeline integration",
            "CLI tools for rapid deployment",
            "External signal webhook connectors",
            "Git-based version control for strategies",
            "Real-time market data streaming APIs",
        ],
        cta: "Explore Developer Tools",
    },
    {
        id: "retail-traders",
        iconBg: "bg-gradient-to-br from-teal-500 to-emerald-600",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        ),
        title: "Retail Traders & Investors",
        tagline: "Institutional power, retail simplicity",
        desc: "Choose ready algorithms or create your own using no-code tools, AI-assisted builders, or full-code environments — all deployed on institutional-grade infra.",
        features: [
            "Pre-built algorithm marketplace",
            "AI-assisted strategy builder",
            "One-click MT4/MT5 integration",
            "Copy trading & social signals",
            "Paper trading mode for testing",
            "Mobile-friendly dashboard",
        ],
        cta: "Explore Retail Solutions",
    },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neon-green text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                        </span>
                        Enterprise-Grade Solutions
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                        Built for Every <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400 drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">
                            Market Participant
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        From retail traders to hedge funds — our algorithmic trading infrastructure powers every level of the market with institutional-grade execution, compliance, and scalability.
                    </p>
                </div>
            </section>

            {/* Services Detailed Grid */}
            <section className="pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    {services.map((service, idx) => (
                        <div
                            key={service.id}
                            id={service.id}
                            className={`flex flex-col ${idx % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 lg:gap-16 items-center p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 group`}
                        >
                            {/* Left: Info */}
                            <div className="flex-1 space-y-6">
                                <div className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                    {service.icon}
                                </div>
                                <div>
                                    <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">{service.tagline}</p>
                                    <h2 className="text-2xl md:text-4xl font-bold text-white leading-snug">{service.title}</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed text-base md:text-lg">{service.desc}</p>
                                <Link
                                    href={`/services/${service.id}`}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-neon-green text-black font-bold rounded-xl hover:shadow-[0_0_25px_rgba(57,255,20,0.4)] hover:scale-105 transition-all text-sm md:text-base group/btn"
                                >
                                    {service.cta}
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Right: Features List */}
                            <div className="flex-1 w-full">
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-neon-green"></span>
                                        Key Capabilities
                                    </h3>
                                    <ul className="space-y-4">
                                        {service.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-300 text-sm md:text-base">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="w-full py-20 px-6">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-blue-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-black border border-white/10 rounded-3xl p-8 md:p-12 text-center overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none" />
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Not Sure Which Plan Fits?</h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">Talk to our solutions team. We&apos;ll help you find the perfect setup for your trading needs.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link href="/contact" className="px-8 py-3 bg-neon-green text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-105 transition-all">
                                Schedule a Demo
                            </Link>
                            <Link href="/docs" className="px-8 py-3 bg-white/5 border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
                                Read Documentation
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
