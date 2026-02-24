
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms & Conditions - AlgoTradingBot',
    description: 'Terms of Service and Agreement for AlgoTradingBot.online.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-neon-green transition-colors mb-6"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Terms of Service</h1>
                <p className="text-gray-400 text-sm">Last updated: February 19, 2026</p>

                <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-4">
                    <h3>1. General</h3>
                    <p>
                        By accessing this website we assume you accept these terms and conditions in full. Do not continue to use AlgoTradingBot.online\'s website if you do not accept all of the terms and conditions stated on this page.
                    </p>

                    <h3>2. License</h3>
                    <p>
                        Unless otherwise stated, AlgoTradingBot.online and/or its licensors own the intellectual property rights for all material on AlgoTradingBot.online. All intellectual property rights are reserved. You may view and/or print pages from https://algotardingbot.online for your own personal use subject to restrictions set in these terms and conditions.
                    </p>
                    <p>
                        You must not:
                        Republish material from https://algotardingbot.online
                        Sell, rent or sub-license material from https://algotardingbot.online
                        Reproduce, duplicate or copy material from https://algotardingbot.online
                    </p>

                    <h3>3. Payments</h3>
                    <p>
                        All major credit cards and PayPal are accepted. Payments must be made in full before access to premium bots or services is granted.
                    </p>

                    <h3>4. Disclaimer</h3>
                    <p>
                        Trading forex, crypto, and other financial instruments carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.
                    </p>
                    <p className="font-bold text-red-500">
                        AlgoTradingBot.online provides software tools for educational and assistance purposes only. We are not financial advisors. Use our bots at your own risk. Past performance is not indicative of future results.
                    </p>

                    <h3>5. Governing Law</h3>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
                    </p>
                </div>
            </div>
        </div>
    );
}
