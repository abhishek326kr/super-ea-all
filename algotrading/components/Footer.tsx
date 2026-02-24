"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Mail, Phone, Calendar, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import Logo from "./Logo";

const SocialIcon = ({ path }: { path: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d={path} />
    </svg>
);

export default function Footer() {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const socialLinks = [
        {
            name: "Telegram",
            path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.743.051c-.404.052-.816.126-1.231.222a11.92 11.92 0 0 0-4.068 1.947c-2.479 1.907-4.218 4.672-4.708 7.846l-.113.826 3.14.776c.49-3.125 2.196-5.845 4.64-7.72A8.93 8.93 0 0 1 11.944 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9c0-3.32 1.8-6.242 4.493-7.918l-1.638-2.61A11.96 11.96 0 0 0 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12-5.373-12-12-12zM20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z",
            href: "https://t.me/AlgoTradingBotSupport"
        },
        {
            name: "Twitter",
            path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
            href: "https://twitter.com/algotradingbot"
        },
        {
            name: "LinkedIn",
            path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
            href: "https://linkedin.com/company/algotradingbot"
        },
        {
            name: "Facebook",
            path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
            href: "https://facebook.com/algotradingbot"
        },
        {
            name: "Instagram",
            path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
            href: "https://instagram.com/algotradingbot"
        },
    ];

    return (
        <footer className="w-full bg-black border-t border-neon-green/30 pt-16 pb-8 md:pt-24 md:pb-12 text-white/80 font-light relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green/50 to-transparent opacity-50 blur-sm" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                {/* Column 1: Brand */}
                <div className="space-y-6">

                    <Link href="/" className="group flex items-center gap-2 w-fit">
                        <Logo textClassName="text-2xl tracking-tighter" />
                    </Link>
                    <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
                        We build intelligent algorithmic trading systems for modern traders.
                        Automate your strategies with precision and speed.
                    </p>
                    <div className="flex gap-4">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-neon-green hover:text-black transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <SocialIcon path={social.path} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white tracking-wide">Quick Links</h3>

                    <ul className="space-y-3 text-sm">
                        <li>
                            <Link href="/" className="hover:text-neon-green transition-colors flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog?category=Custom%20Strategies" className="hover:text-neon-green transition-colors flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                Custom Bots
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog?category=MT5%20%26%20Popular%20Bots" className="hover:text-neon-green transition-colors flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                Popular/MT5
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog?category=Gold%20%26%20Crypto" className="hover:text-neon-green transition-colors flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                Gold & Crypto
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-neon-green transition-colors flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Resources */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white tracking-wide">Resources</h3>
                    <ul className="space-y-3 text-sm">
                        {[
                            { name: "FAQ", href: "/faq" },
                            { name: "Documentation", href: "/docs" },
                            { name: "Support", href: "/support" },
                            { name: "Privacy Policy", href: "/privacy" },
                            { name: "Terms & Conditions", href: "/terms" },
                        ].map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="hover:text-neon-green transition-colors flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Contact */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white tracking-wide">Contact Info</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3 text-gray-400 group">
                            <Mail className="w-5 h-5 text-neon-green mt-0.5 group-hover:drop-shadow-[0_0_8px_rgba(57,255,20,0.8)] transition-all" />
                            <a href="mailto:support@algotradingbot.online" className="hover:text-white transition-colors">
                                support@algotradingbot.online
                            </a>
                        </div>
                        <div className="flex items-start gap-3 text-gray-400 group">
                            <Phone className="w-5 h-5 text-neon-green mt-0.5 group-hover:drop-shadow-[0_0_8px_rgba(57,255,20,0.8)] transition-all" />
                            <a href="tel:+1234567890" className="hover:text-white transition-colors">
                                +1 (555) 123-4567
                            </a>
                        </div>
                        <div className="flex items-start gap-3 text-gray-400">
                            <Calendar className="w-5 h-5 text-neon-green mt-0.5" />
                            <span>
                                Mon - Fri: 9:00 AM - 6:00 PM EST
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Disclaimer / Risk Disclosure Section ── */}
            <div className="mt-16 border-t border-white/10 pt-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                        <h3 className="text-sm font-semibold text-yellow-500 uppercase tracking-wider">
                            Important Disclaimers &amp; Risk Disclosures
                        </h3>
                    </div>

                    <div className="space-y-1">
                        {/* General Disclaimer */}
                        <div className="border border-white/5 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection("general")}
                                className="w-full flex items-center justify-between px-5 py-3 text-left text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-neon-green" />
                                    General Disclaimer
                                </span>
                                {expandedSection === "general" ? (
                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                            {expandedSection === "general" && (
                                <div className="px-5 pb-4 text-[11px] leading-relaxed text-gray-500 space-y-3">
                                    <p>
                                        Trading in financial products involves significant risk and may not be suitable for all investors. The use of our services, including algorithmic trading strategies and the Algo Marketplace, carries the risk of substantial losses, potentially exceeding your deposited funds. It is crucial to fully understand these risks before engaging in trading activities.
                                    </p>
                                    <p>
                                        AlgoTradingBot (AlgoTradingBot.online) does not guarantee the accuracy or completeness of any information provided on our platform, including third-party content. Such information should not be relied upon without thorough independent investigation by the investor. Investments in securities and equity-related instruments are subject to various market risks, which can be influenced by specific security factors, broader market conditions, and economic, political, and global developments.
                                    </p>
                                    <p>
                                        Past performance of any strategy, model, or advice provided by AlgoTradingBot does not guarantee future results. Actual returns may vary significantly due to various factors, including but not limited to, impact costs, expenses, entry and exit timings, additional flows or redemptions, client-specific mandates, and unique portfolio construction characteristics. There is no assurance that the objectives of any strategy, model, or advice will be achieved.
                                    </p>
                                    <p>
                                        AlgoTradingBot, its partners, officers, and employees do not guarantee any specific return on investments made based on the strategies or advice provided. The value of investments can fluctuate, influenced by market forces and conditions. AlgoTradingBot and its associates are not responsible for any losses or shortfalls arising from market conditions.
                                    </p>
                                    <p>
                                        Investors are encouraged to thoroughly read and understand the terms and conditions outlined in the relevant advisory agreement before subscribing to any services. AlgoTradingBot and its associates/employees shall not be held liable for any risks or losses associated with the strategies, models, or advice provided. Trading in securities is subject to market risks, and AlgoTradingBot makes no representation or guarantee that the objectives of any model, strategy, or advice offered will be achieved in the future.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Risk Disclosure */}
                        <div className="border border-white/5 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection("risk")}
                                className="w-full flex items-center justify-between px-5 py-3 text-left text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                                    Risk Disclosure
                                </span>
                                {expandedSection === "risk" ? (
                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                            {expandedSection === "risk" && (
                                <div className="px-5 pb-4 text-[11px] leading-relaxed text-gray-500">
                                    <p>
                                        Futures and forex trading contains substantial risk and is not for every investor. An investor could potentially lose all or more than the initial investment. Risk capital is money that can be lost without jeopardising ones&apos; financial security or lifestyle. Only risk capital should be used for trading and only those with sufficient risk capital should consider trading. Past performance is not necessarily indicative of future results.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Hypothetical Performance */}
                        <div className="border border-white/5 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection("hypothetical")}
                                className="w-full flex items-center justify-between px-5 py-3 text-left text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    Hypothetical Performance Disclosure
                                </span>
                                {expandedSection === "hypothetical" ? (
                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                            {expandedSection === "hypothetical" && (
                                <div className="px-5 pb-4 text-[11px] leading-relaxed text-gray-500">
                                    <p>
                                        Hypothetical performance results have many inherent limitations, some of which are described below. No representation is being made that any account will or is likely to achieve profits or losses similar to those shown; in fact, there are frequently sharp differences between hypothetical performance results and the actual results subsequently achieved by any particular trading program. One of the limitations of hypothetical performance results is that they are generally prepared with the benefit of hindsight. In addition, hypothetical trading does not involve financial risk, and no hypothetical trading record can completely account for the impact of financial risk of actual trading. For example, the ability to withstand losses or to adhere to a particular trading program in spite of trading losses are material points which can also adversely affect actual trading results. There are numerous other factors related to the markets in general or to the implementation of any specific trading program which cannot be fully accounted for in the preparation of hypothetical performance results and all which can adversely affect trading results.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Testimonial Disclosure */}
                        <div className="border border-white/5 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection("testimonial")}
                                className="w-full flex items-center justify-between px-5 py-3 text-left text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    Testimonial Disclosure
                                </span>
                                {expandedSection === "testimonial" ? (
                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                            {expandedSection === "testimonial" && (
                                <div className="px-5 pb-4 text-[11px] leading-relaxed text-gray-500">
                                    <p>
                                        Testimonials appearing on this website may not be representative of other clients or customers and is not a guarantee of future performance or success.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Copyright Bar ── */}
            <div className="mt-10 border-t border-white/5 pt-8 pb-4">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© 2026 AlgoTradingBot.online. All Rights Reserved.</p>
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-neon-green" />
                        <p>Trading involves risk. Past performance does not guarantee future results.</p>
                    </div>
                </div>
            </div>
        </footer >
    );
}
