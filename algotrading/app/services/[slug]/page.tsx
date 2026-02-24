
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ArrowLeft, Zap, Shield, BarChart3, Globe, Cpu, Users } from "lucide-react";
import { notFound } from "next/navigation";

const serviceData: Record<string, {
    iconBg: string;
    title: string;
    tagline: string;
    heroDesc: string;
    features: { title: string; desc: string }[];
    benefits: string[];
    stats: { value: string; label: string }[];
    cta: string;
}> = {
    "broking-houses": {
        iconBg: "from-rose-500 to-pink-600",
        title: "Broking Houses & Fintech Platforms",
        tagline: "White-labeled algo trading for your clients",
        heroDesc: "Offer algorithmic trading capabilities to your clients with white-labeled, scalable, compliant infrastructure. Seamless integration, enterprise-grade execution, audit-ready logs, and SLA-backed stability.",
        features: [
            { title: "White-Label Solution", desc: "Your brand, our engine. Fully customizable UI, branded reports, and client-facing dashboards under your own identity." },
            { title: "Multi-Tenant Architecture", desc: "Serve thousands of clients simultaneously with isolated environments, individual risk controls, and per-account reporting." },
            { title: "Compliance & Audit Trails", desc: "Every trade, every order, every modification — logged and exportable for regulatory review. SEBI, SEC, FCA-ready." },
            { title: "API-First Integration", desc: "RESTful APIs, WebSocket feeds, and FIX protocol support for seamless connectivity with your existing systems." },
            { title: "SLA-Backed Uptime", desc: "99.99% uptime guarantee with geo-redundant servers, automatic failover, and 24/7 infrastructure monitoring." },
            { title: "Dedicated Account Manager", desc: "Enterprise clients get a dedicated technical account manager for onboarding, customization, and ongoing support." },
        ],
        benefits: [
            "Launch algo trading services in weeks, not months",
            "Zero infrastructure management overhead",
            "Revenue share and licensing models available",
            "Scalable from 100 to 100,000+ users",
            "Full regulatory compliance out of the box",
            "Custom strategy marketplace for your clients",
        ],
        stats: [
            { value: "99.99%", label: "Uptime SLA" },
            { value: "<50ms", label: "Execution Latency" },
            { value: "50+", label: "Broker Integrations" },
            { value: "24/7", label: "Monitoring" },
        ],
        cta: "Schedule Enterprise Demo",
    },
    "hedge-funds": {
        iconBg: "from-sky-500 to-blue-600",
        title: "Hedge Funds & Asset Managers",
        tagline: "Automate portfolio strategies at scale",
        heroDesc: "Automate portfolio strategies, reduce manual execution risk, and offer enhanced execution algos to clients under your own brand. Designed for institutional volume and precision.",
        features: [
            { title: "Portfolio Strategy Automation", desc: "Deploy multi-leg, multi-asset strategies across global markets with real-time position management and automated rebalancing." },
            { title: "Smart Order Routing", desc: "Route orders across multiple venues to achieve best execution. Minimize market impact with TWAP, VWAP, and iceberg algorithms." },
            { title: "Risk Analytics Dashboard", desc: "Real-time portfolio-level risk metrics including VaR, drawdown analysis, correlation matrices, and stress testing." },
            { title: "Execution Quality (TCA)", desc: "Transaction cost analysis with slippage tracking, fill rate monitoring, and execution benchmark comparisons." },
            { title: "FIX Protocol Connectivity", desc: "Industry-standard FIX 4.2/4.4 protocol connectivity for seamless integration with prime brokers and execution venues." },
            { title: "Custom Algo Development", desc: "Our quant team works with you to develop, backtest, and optimize proprietary algorithms tailored to your strategy." },
        ],
        benefits: [
            "Reduce execution costs by up to 40%",
            "Eliminate manual order entry errors",
            "Scale strategies across multiple funds",
            "Institutional-grade security and encryption",
            "SOC 2 Type II certified infrastructure",
            "Dedicated quant support team",
        ],
        stats: [
            { value: "$450M+", label: "Volume Traded" },
            { value: "40%", label: "Cost Reduction" },
            { value: "15+", label: "Asset Classes" },
            { value: "SOC 2", label: "Certified" },
        ],
        cta: "Talk to Institutional Sales",
    },
    "prop-desks": {
        iconBg: "from-violet-500 to-purple-600",
        title: "Proprietary & Quantitative Trading Desks",
        tagline: "Deploy proprietary models with zero infra burden",
        heroDesc: "Deploy proprietary models securely using our infra. Scale execution with full control, zero infra burden, and real-time analytics. Built for speed and precision.",
        features: [
            { title: "Secure Model Sandbox", desc: "Deploy your proprietary algorithms in isolated, encrypted sandboxes. Your IP stays protected with zero-knowledge infrastructure." },
            { title: "Co-Location Infrastructure", desc: "Execute from data centers co-located with major exchanges for sub-millisecond order routing and minimal network latency." },
            { title: "Multi-Strategy Execution", desc: "Run multiple strategies concurrently with independent risk parameters, position limits, and P&L tracking per strategy." },
            { title: "Advanced Backtesting", desc: "Tick-level historical data, Monte Carlo simulations, walk-forward optimization, and out-of-sample testing frameworks." },
            { title: "Real-time P&L Tracking", desc: "Live mark-to-market P&L across all strategies, positions, and accounts with customizable alerting and reporting." },
            { title: "Custom Risk Parameters", desc: "Configure per-strategy drawdown limits, position sizing rules, correlation-based exposure limits, and kill switches." },
        ],
        benefits: [
            "Focus on alpha generation, not infrastructure",
            "Sub-millisecond execution from co-located servers",
            "IP protection with zero-knowledge deployment",
            "Scale from proof-of-concept to production seamlessly",
            "Robust disaster recovery and failover",
            "Pay only for what you use — no upfront CapEx",
        ],
        stats: [
            { value: "<1ms", label: "Order Latency" },
            { value: "100%", label: "IP Protected" },
            { value: "10+", label: "Data Centers" },
            { value: "∞", label: "Scalability" },
        ],
        cta: "Request Infrastructure Access",
    },
    "rias": {
        iconBg: "from-amber-500 to-orange-600",
        title: "RIAs & RAs",
        tagline: "Compliance-first algorithmic infrastructure",
        heroDesc: "Develop and deploy strategies for your internal use or for your clients with full compliance visibility. Build using no-code, low-code, or full code tools — backed by institutional-grade infrastructure.",
        features: [
            { title: "No-Code Strategy Builder", desc: "Drag-and-drop interface for advisors to create, test, and deploy trading strategies without writing a single line of code." },
            { title: "Client Portfolio Allocation", desc: "Model portfolios, sleeve-based allocation, and automated rebalancing across all client accounts simultaneously." },
            { title: "Compliance Dashboard", desc: "Real-time compliance monitoring, pre-trade and post-trade checks, restriction lists, and regulatory reporting." },
            { title: "Automated Rebalancing", desc: "Calendar-based, threshold-based, or event-driven rebalancing workflows with tax-loss harvesting integration." },
            { title: "White-Glove Onboarding", desc: "Dedicated implementation team handles data migration, strategy conversion, and team training during onboarding." },
            { title: "Regulatory Integration", desc: "Built-in reporting for major regulatory requirements. Generate audit trails and compliance reports with one click." },
        ],
        benefits: [
            "Serve more clients with automated workflows",
            "Ensure compliance with every trade",
            "Reduce operational risk significantly",
            "Offer algo trading as a differentiator",
            "No tech team needed — fully managed",
            "Transparent fee structure with no hidden costs",
        ],
        stats: [
            { value: "0", label: "Code Required" },
            { value: "100%", label: "Compliant" },
            { value: "5x", label: "Efficiency Gain" },
            { value: "1-Click", label: "Reports" },
        ],
        cta: "Book Advisory Demo",
    },
    "quant-devs": {
        iconBg: "from-red-500 to-rose-600",
        title: "Quant Developers & Technical Teams",
        tagline: "Build, test, and deploy with powerful dev tools",
        heroDesc: "Build advanced strategies using Python, ML, CLI, notebooks, or external signal integrations — without needing to manage servers, APIs, or high-availability systems.",
        features: [
            { title: "Python SDK", desc: "Full-featured Python SDK with async support, pandas integration, and comprehensive documentation. pip install algotradingbot." },
            { title: "Jupyter Notebook Support", desc: "Research, backtest, and prototype strategies directly in Jupyter notebooks with live market data and execution capabilities." },
            { title: "ML Pipeline Integration", desc: "Deploy TensorFlow, PyTorch, and scikit-learn models directly into the execution pipeline. GPU-accelerated inference available." },
            { title: "CLI Tools", desc: "Command-line tools for rapid deployment, strategy management, log streaming, and infrastructure provisioning." },
            { title: "Webhook Connectors", desc: "Connect external signals from TradingView, custom APIs, or any HTTP endpoint to trigger automated execution." },
            { title: "Version Control", desc: "Git-based strategy versioning with rollback capabilities, A/B testing, and deployment pipelines." },
        ],
        benefits: [
            "Ship strategies 10x faster",
            "No DevOps or infrastructure management",
            "Built-in market data — no separate vendor needed",
            "Collaborative team environments with RBAC",
            "Detailed API documentation and examples",
            "Active developer community and Slack channel",
        ],
        stats: [
            { value: "10x", label: "Faster Shipping" },
            { value: "100+", label: "API Endpoints" },
            { value: "5ms", label: "Data Latency" },
            { value: "24/7", label: "Dev Support" },
        ],
        cta: "Access Developer Portal",
    },
    "retail-traders": {
        iconBg: "from-teal-500 to-emerald-600",
        title: "Retail Traders & Investors",
        tagline: "Institutional power, retail simplicity",
        heroDesc: "Choose ready algorithms or create your own using no-code tools, AI-assisted builders, or full-code environments — all deployed on institutional-grade infra.",
        features: [
            { title: "Algorithm Marketplace", desc: "Browse and deploy proven strategies from our marketplace. Filter by asset class, risk level, historical performance, and trading style." },
            { title: "AI Strategy Builder", desc: "Describe your trading idea in plain English. Our AI converts it into a working algorithm with backtesting results." },
            { title: "One-Click MT4/MT5 Setup", desc: "Connect your existing MetaTrader account in under 2 minutes. No VPS, no configuration headaches." },
            { title: "Copy Trading", desc: "Follow top-performing traders and automatically mirror their strategies in your account with customizable risk settings." },
            { title: "Paper Trading Mode", desc: "Test any strategy risk-free with our realistic paper trading simulator before going live with real capital." },
            { title: "Mobile Dashboard", desc: "Monitor your bots, view P&L, and manage strategies from anywhere with our responsive mobile interface." },
        ],
        benefits: [
            "Start trading in under 5 minutes",
            "No coding knowledge required",
            "Free paper trading to test strategies",
            "Community of 12,500+ active traders",
            "Educational resources and tutorials",
            "24/7 customer support via Telegram",
        ],
        stats: [
            { value: "12,500+", label: "Active Traders" },
            { value: "87.4%", label: "Avg Win Rate" },
            { value: "5 min", label: "Setup Time" },
            { value: "Free", label: "Paper Trading" },
        ],
        cta: "Start Trading Now",
    },
};

const iconMap: Record<string, React.ReactNode> = {
    "broking-houses": <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /></svg>,
    "hedge-funds": <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><path d="M7 8l5-5 5 5M7 16l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    "prop-desks": <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    "rias": <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><path d="M3 21l4-4m0 0l4-4m-4 4V7m14 14l-4-4m0 0l-4-4m4 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    "quant-devs": <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="M6 12h3m3 0h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    "retail-traders": <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
};

export async function generateStaticParams() {
    return Object.keys(serviceData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const service = serviceData[slug];
    if (!service) return { title: "Service Not Found" };
    return {
        title: `${service.title} - AlgoTradingBot`,
        description: service.heroDesc,
    };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = serviceData[slug];
    if (!service) notFound();

    const featureIcons = [Zap, Shield, BarChart3, Globe, Cpu, Users];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto">
                    <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-neon-green transition-colors mb-8">
                        <ArrowLeft size={16} /> Back to Services
                    </Link>

                    <div className="flex flex-col lg:flex-row items-start gap-12">
                        <div className="flex-1 space-y-6">
                            <div className={`w-16 h-16 bg-gradient-to-br ${service.iconBg} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                {iconMap[slug]}
                            </div>
                            <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider">{service.tagline}</p>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">{service.title}</h1>
                            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">{service.heroDesc}</p>
                            <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                                <Link href="/contact" className="px-8 py-4 bg-neon-green text-black font-extrabold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-105 transition-all flex items-center gap-2 group">
                                    {service.cta}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/docs" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                                    View Documentation
                                </Link>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="w-full lg:w-auto grid grid-cols-2 gap-4">
                            {service.stats.map((stat, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[140px]">
                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</h3>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Core <span className="text-neon-green">Capabilities</span></h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to deploy, manage, and scale your algorithmic trading operations.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.features.map((feature, idx) => {
                            const Icon = featureIcons[idx % featureIcons.length];
                            return (
                                <div key={idx} className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-neon-green/30 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-neon-green/10 rounded-xl flex items-center justify-center mb-5 text-neon-green group-hover:bg-neon-green group-hover:text-black transition-all duration-300">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-24 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Teams Choose <span className="text-neon-green">AlgoTradingBot</span></h2>
                            <p className="text-gray-400 text-lg mb-8">We handle the complexity of infrastructure so you can focus on what matters most — generating alpha.</p>
                            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-neon-green text-black font-bold rounded-xl hover:shadow-[0_0_25px_rgba(57,255,20,0.4)] hover:scale-105 transition-all group">
                                Get Started Today
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-5">
                                {service.benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full py-20 px-6">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-blue-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-black border border-white/10 rounded-3xl p-8 md:p-12 text-center overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none" />
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to Transform Your Trading?</h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">Join thousands of traders and institutions already using AlgoTradingBot.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link href="/contact" className="px-8 py-3 bg-neon-green text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-105 transition-all">
                                {service.cta}
                            </Link>
                            <Link href="/services" className="px-8 py-3 bg-white/5 border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
                                View All Services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
