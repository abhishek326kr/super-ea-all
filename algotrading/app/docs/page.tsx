
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FileText, Settings, Code, Video } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Documentation - AlgoTradingBot',
    description: 'User guides and documentation for installing and using our trading bots.',
};

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-6xl mx-auto space-y-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-neon-green transition-colors mb-6"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Documentation <span className="text-neon-green">Hub</span></h1>
                    <p className="text-gray-400 mt-4 text-xl">Everything you need to get started with automated trading.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Getting Started Card */}
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                            <BookOpen className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Getting Started</h3>
                        <p className="text-gray-400 mb-4">Learn the basics of MT4/MT5 and how to install your first Expert Advisor.</p>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>• <Link href="#" className="hover:text-neon-green">Installation Guide</Link></li>
                            <li>• <Link href="#" className="hover:text-neon-green"> VPS Setup</Link></li>
                            <li>• <Link href="#" className="hover:text-neon-green"> Account Configuration</Link></li>
                        </ul>
                    </div>

                    {/* Bot Configuration */}
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                            <Settings className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Bot Settings</h3>
                        <p className="text-gray-400 mb-4">Detailed breakdown of input parameters for our Gold & Crypto bots.</p>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>• <Link href="#" className="hover:text-neon-green">Risk Management</Link></li>
                            <li>• <Link href="#" className="hover:text-neon-green"> News Filter Settings</Link></li>
                            <li>• <Link href="#" className="hover:text-neon-green"> Grid Logic Explained</Link></li>
                        </ul>
                    </div>

                    {/* Strategy Guides */}
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                            <Code className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Strategy Codes</h3>
                        <p className="text-gray-400 mb-4">Understanding the logic behind our custom strategies and indicators.</p>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>• <Link href="#" className="hover:text-neon-green">London Breakout Logic</Link></li>
                            <li>• <Link href="#" className="hover:text-neon-green"> Scalping Indicators</Link></li>
                        </ul>
                    </div>

                    {/* Video Tutorials */}
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-green/30 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                            <Video className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Video Tutorials</h3>
                        <p className="text-gray-400 mb-4">Watch step-by-step videos on setting up and optimizing your bots.</p>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>• <Link href="#" className="hover:text-neon-green">Live Trading Setup</Link></li>
                            <li>• <Link href="#" className="hover:text-neon-green"> Backtesting Tutorial</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
