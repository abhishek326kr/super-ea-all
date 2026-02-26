
"use client";

import Link from "next/link";
import { ArrowRight, Bot, BarChart3, ShieldCheck, Zap, Activity, Users, Star } from "lucide-react";
import BlogSection from "@/components/BlogSection";
import HomeBotIllustration from "@/components/HomeBotIllustration";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <div className="flex flex-col items-center overflow-x-hidden">

      {/* HER0 SEC: 2-Column Layout */}
      <section className="w-full min-h-[90vh] pt-24 pb-16 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        {/* Background Glows */}
        {/* Background Glows & Grid */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-green/10 rounded-full blur-[150px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10 animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] -z-20 pointer-events-none" />

        {/* Text Content */}
        <div className="flex-1 text-center md:text-left space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neon-green text-sm font-medium w-fit mx-auto md:mx-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
            </span>
            Next-Gen Trading Intelligence
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.15]">
            Automate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400 drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">
              Your Profits
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mx-auto md:mx-0">
            Institutional-grade algorithms now available for retail traders.
            Execute trades with <span className="text-white font-semibold">millisecond precision</span> and eliminate emotional bias.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
            <Link
              href="/get-started"
              className="w-full sm:w-auto px-8 py-4 bg-neon-green text-black font-extrabold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              Start Trading Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/performance-bots"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center backdrop-blur-sm"
            >
              View Live Results
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 flex items-center gap-6 justify-center md:justify-start grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {/* Simple placeholders for broker logos */}
            <div className="h-8 w-24 bg-white/20 rounded animate-pulse" />
            <div className="h-8 w-24 bg-white/20 rounded animate-pulse delay-75" />
            <div className="h-8 w-24 bg-white/20 rounded animate-pulse delay-150" />
          </div>
        </div>

        {/* Illustration Content */}
        <div className="flex-1 w-full flex justify-center md:justify-end relative">
          <HomeBotIllustration />
        </div>
      </section>

      {/* STATS BAR */}
      <section className="w-full border-y border-white/5 bg-black/50 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
          {[
            { label: "Total Volume Traded", value: "$450M+" },
            { label: "Active Traders", value: "12,500+" },
            { label: "Average Win Rate", value: "87.4%" },
            { label: "Supported Brokers", value: "50+" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES GRID */}
      <section ref={sectionRef} className="w-full py-32 px-6 relative bg-gradient-to-b from-black to-gray-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Who We <span className="text-neon-green">Serve</span></h2>
            <p className="text-gray-400 text-lg">Institutional-grade algorithmic trading infrastructure for every market participant.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                slug: "broking-houses",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /></svg>
                ),
                iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
                title: "Broking Houses & Fintech Platforms",
                desc: "Offer algorithmic trading capabilities to your clients with white-labeled, scalable, compliant infrastructure. Seamless integration, enterprise-grade execution, audit-ready logs, and SLA-backed stability.",
                link: "Explore Enterprise Solutions"
              },
              {
                slug: "hedge-funds",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M7 8l5-5 5 5M7 16l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ),
                iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
                title: "Hedge Funds & Asset Managers",
                desc: "Automate portfolio strategies, reduce manual execution risk, and offer enhanced execution algos to clients under your own brand.",
                link: "Explore Enterprise Solutions"
              },
              {
                slug: "prop-desks",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                ),
                iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
                title: "Proprietary & Quantitative Trading Desks",
                desc: "Deploy proprietary models securely using our infra. Scale execution with full control, zero infra burden, and real-time analytics.",
                link: "Explore Institutional Offering"
              },
              {
                slug: "rias",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M3 21l4-4m0 0l4-4m-4 4V7m14 14l-4-4m0 0l-4-4m4 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ),
                iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
                title: "RIAs & RAs",
                desc: "Develop and deploy strategies for your internal use or for your clients with full compliance visibility. Build using no-code, low-code, or full code tools — backed by institutional-grade infrastructure.",
                link: "Explore Enterprise Solutions"
              },
              {
                slug: "quant-devs",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="M6 12h3m3 0h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                ),
                iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
                title: "Quant Developers & Technical Teams",
                desc: "Build advanced strategies using Python, ML, CLI, notebooks, or external signal integrations — without needing to manage servers, APIs, or high-availability systems.",
                link: "Explore Developer Tools"
              },
              {
                slug: "retail-traders",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                ),
                iconBg: "bg-gradient-to-br from-teal-500 to-emerald-600",
                title: "Retail Traders & Investors",
                desc: "Choose ready algorithms or create your own using no-code tools, AI-assisted builders, or full-code environments — all deployed on institutional-grade infra.",
                link: "Explore Retail Solutions"
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                style={{ y }}
                className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all duration-300 group flex flex-col justify-between backdrop-blur-sm"
              >
                <div>
                  <div className={`w-12 h-12 ${service.iconBg} rounded-xl flex items-center justify-center mb-5 text-white shadow-lg`}>
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm mb-6">{service.desc}</p>
                </div>
                <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-1.5 text-amber-400 font-semibold text-sm group-hover:text-amber-300 transition-colors">
                  {service.link}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS / HOW IT WORKS */}
      <section className="w-full py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Start Automating in <span className="text-neon-green">3 Steps</span></h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {/* Step 1 */}
            <div className="flex-1 text-center p-8 rounded-2xl bg-white/5 border border-white/10 w-full max-w-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="text-6xl font-black text-white/10 mb-4">01</div>
              <h3 className="text-xl font-bold text-white mb-2">Select Your Bot</h3>
              <p className="text-gray-400 text-sm">Browse our marketplace and choose a strategy that fits your risk appetite.</p>
            </div>
            {/* Connector */}
            <div className="hidden md:block w-16 h-1 bg-white/10" />

            {/* Step 2 */}
            <div className="flex-1 text-center p-8 rounded-2xl bg-white/5 border border-white/10 w-full max-w-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="text-6xl font-black text-white/10 mb-4">02</div>
              <h3 className="text-xl font-bold text-white mb-2">Connect Account</h3>
              <p className="text-gray-400 text-sm">Link your MT4/MT5 or Crypto Exchange account securely via API keys.</p>
            </div>

            {/* Connector */}
            <div className="hidden md:block w-16 h-1 bg-white/10" />

            {/* Step 3 */}
            <div className="flex-1 text-center p-8 rounded-2xl bg-neon-green/10 border border-neon-green/30 w-full max-w-sm hover:-translate-y-2 transition-transform duration-300 shadow-[0_0_30px_rgba(57,255,20,0.1)]">
              <div className="text-6xl font-black text-neon-green/20 mb-4">03</div>
              <h3 className="text-xl font-bold text-white mb-2">Launch</h3>
              <p className="text-gray-400 text-sm">Activate the bot and watch it execute trades 24/7 on your behalf.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="w-full py-32 px-6 bg-gradient-to-t from-black to-gray-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-16">Trusted by <span className="text-neon-green">Traders</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                name: "Michael K.",
                role: "Forex Scalper",
                text: "I was skeptical at first, but the Gold Scalper Pro has consistent results. withdrawals are smooth. The support on Telegram is also very responsive.",
                stars: 5
              },
              {
                name: "Sarah J.",
                role: "Crypto Analyst",
                text: "The arbitrage bot is a game changer. It catches price differences faster than I ever could manually. Paid for itself in the first week.",
                stars: 5
              },
              {
                name: "David R.",
                role: "Fund Manager",
                text: "We integrated their API for our prop firm challenge. The risk management features are exactly what we needed to pass evaluations safely.",
                stars: 4
              }
            ].map((review, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6">"{review.text}"</p>
                <div>
                  <h4 className="font-bold text-white">{review.name}</h4>
                  <span className="text-xs text-neon-green font-medium uppercase tracking-wider">{review.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BlogSection category="pre-bots" />

      {/* FINAL CTA */}
      <section className="w-full py-20 px-6">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-blue-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative bg-black border border-white/10 rounded-3xl p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none" />

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to Automate?</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">Stop staring at charts. Let algorithms do the work.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/get-started" className="px-8 py-3 bg-neon-green text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-105 transition-all text-sm md:text-base">
                Get Lifetime Access
              </Link>
              <Link href="/contact" className="px-8 py-3 bg-white/5 border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all text-sm md:text-base">
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
