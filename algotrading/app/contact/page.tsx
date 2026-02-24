
import React from 'react';
import Link from 'next/link';
import { Mail, Send, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us - AlgoTradingBot',
    description: 'Get in touch for custom trading bot development, premium strategy access, or technical support.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[140px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] -z-10" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left Column: Contact Info */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                            Let's Build Your <br />
                            <span className="text-neon-green">Trading Edge</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                            Whether you need a custom MT5 EA, want access to our premium Gold Scalper, or have questions about our free tools — we're here to help.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Email Card */}
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center shrink-0 group-hover:bg-neon-green/20 transition-colors">
                                <Mail className="w-6 h-6 text-neon-green" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Email Support</h3>
                                <p className="text-gray-400 text-sm mb-2">For custom coding quotes & general inquiries.</p>
                                <a href="mailto:support@algotradingbot.online" className="text-white font-medium hover:text-neon-green transition-colors">
                                    support@algotradingbot.online
                                </a>
                            </div>
                        </div>

                        {/* Telegram Card */}
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#229ED9]/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-[#229ED9]/10 flex items-center justify-center shrink-0 group-hover:bg-[#229ED9]/20 transition-colors">
                                <Send className="w-6 h-6 text-[#229ED9]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Telegram Profile</h3>
                                <p className="text-gray-400 text-sm mb-2">Fastest response for premium bot access.</p>
                                <a href="#" className="text-white font-medium hover:text-[#229ED9] transition-colors">
                                    @AlgoTradingBotSupport
                                </a>
                            </div>
                        </div>

                        {/* Hours Card */}
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                                <MessageCircle className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Working Hours</h3>
                                <p className="text-gray-400 text-sm">
                                    Mon - Fri: 09:00 - 18:00 UTC <br />
                                    <span className="text-xs text-gray-500">Weekend support variable for critical issues.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact Form */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-blue-600/5 rounded-3xl blur-xl -z-10" />

                    <form className="bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-3xl space-y-6 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-300">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all placeholder:text-gray-600"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all placeholder:text-gray-600"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium text-gray-300">Subject</label>
                            <select
                                id="subject"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all [&>option]:bg-black [&>option]:text-white"
                            >
                                <option>Premium Bot Inquiry</option>
                                <option>Custom Strategy Development</option>
                                <option>Technical Support</option>
                                <option>Partnership Proposal</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                            <textarea
                                id="message"
                                rows={6}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all placeholder:text-gray-600 resize-none"
                                placeholder="Tell us about your strategy or what you need..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-neon-green text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            Send Message
                        </button>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            Protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                        </p>
                    </form>
                </div>

            </div>
        </div>
    );
}
