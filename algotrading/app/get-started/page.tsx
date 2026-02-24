
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Shield, Bot, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
    title: "Get Started - AlgoTradingBot | Start Trading in Minutes",
    description: "Choose your plan and start automated trading in minutes. Free paper trading, no credit card required.",
};

const plans = [
    {
        name: "Starter",
        price: "Free",
        period: "",
        desc: "Perfect for beginners exploring automated trading",
        features: [
            "1 Active Bot",
            "Paper Trading Mode",
            "Basic Indicators",
            "Community Access",
            "Email Support",
        ],
        cta: "Start Free",
        popular: false,
        gradient: "from-gray-600 to-gray-700",
    },
    {
        name: "Pro",
        price: "$49",
        period: "/mo",
        desc: "For serious traders ready to scale",
        features: [
            "5 Active Bots",
            "Live & Paper Trading",
            "Advanced Indicators & AI Signals",
            "Priority Support",
            "Strategy Backtesting",
            "Telegram Alerts",
        ],
        cta: "Get Pro",
        popular: true,
        gradient: "from-neon-green to-emerald-500",
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        desc: "White-label & institutional solutions",
        features: [
            "Unlimited Bots",
            "Custom Strategy Development",
            "Dedicated Account Manager",
            "White-Label Options",
            "API Access & Webhooks",
            "SLA-Backed Uptime",
            "Compliance & Audit Tools",
        ],
        cta: "Contact Sales",
        popular: false,
        gradient: "from-violet-500 to-purple-600",
    },
];

const steps = [
    {
        num: "01",
        icon: Bot,
        title: "Create Your Account",
        desc: "Sign up in 30 seconds. No credit card required. Start with our free paper trading plan.",
    },
    {
        num: "02",
        icon: Zap,
        title: "Choose or Build a Strategy",
        desc: "Browse our marketplace of proven bots or create your own using our AI-assisted builder.",
    },
    {
        num: "03",
        icon: Shield,
        title: "Connect Your Broker",
        desc: "Link your MT4, MT5, or crypto exchange account securely. We support 50+ brokers worldwide.",
    },
    {
        num: "04",
        icon: BarChart3,
        title: "Go Live",
        desc: "Activate your bot and let it execute trades 24/7 while you monitor from our dashboard.",
    },
];

export default function GetStartedPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[150px] -z-10" />
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                        Start Trading in{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400">Minutes</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        No coding required. No credit card needed. Choose a plan and automate your trading strategy today.
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">How It <span className="text-neon-green">Works</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step) => (
                            <div key={step.num} className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-neon-green/30 transition-all group">
                                <div className="text-5xl font-black text-white/5 mb-4">{step.num}</div>
                                <div className="w-12 h-12 bg-neon-green/10 rounded-xl flex items-center justify-center mb-4 text-neon-green group-hover:bg-neon-green group-hover:text-black transition-all">
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-gray-400 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Choose Your <span className="text-neon-green">Plan</span></h2>
                        <p className="text-gray-400 text-lg">Start free. Upgrade when you&apos;re ready.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative p-8 rounded-3xl border transition-all duration-300 ${plan.popular
                                    ? "bg-white/[0.05] border-neon-green/50 shadow-[0_0_40px_rgba(57,255,20,0.1)]"
                                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-green text-black text-xs font-bold rounded-full uppercase tracking-wider">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-black text-white">{plan.price}</span>
                                    {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
                                </div>
                                <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-neon-green flex-shrink-0" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={plan.name === "Enterprise" ? "/contact" : "/register"}
                                    className={`block w-full py-3 text-center font-bold rounded-xl transition-all ${plan.popular
                                        ? "bg-neon-green text-black hover:shadow-[0_0_25px_rgba(57,255,20,0.4)] hover:scale-105"
                                        : "bg-white/5 border border-white/20 text-white hover:bg-white/10"
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Still have questions?</h2>
                    <p className="text-gray-400 text-lg mb-8">Our team is here to help you get started.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/faq" className="px-8 py-3 bg-white/5 border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
                            Read FAQ
                        </Link>
                        <Link href="/contact" className="px-8 py-3 bg-neon-green text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2">
                            Contact Support <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
