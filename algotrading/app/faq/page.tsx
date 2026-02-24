
import React from 'react';
import { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
    title: 'FAQ - AlgoTradingBot',
    description: 'Frequently Asked Questions about our algorithmic trading bots, payments, and support.',
};

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">Frequently Asked <span className="text-neon-green">Questions</span></h1>
                    <p className="text-gray-400">Everything you need to know about our trading systems.</p>
                </div>

                <div className="space-y-6">
                    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
                        <details className="group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span className="font-semibold text-white">Do I need coding skills to use these bots?</span>
                                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-400">
                                No! Our bots are fully automated. We provide detailed setup guides for MetaTrader 4/5 and other platforms. You just need to install the software and load the bot file.
                            </div>
                        </details>
                    </div>

                    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
                        <details className="group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span className="font-semibold text-white">What is the minimum deposit required?</span>
                                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-400">
                                This depends on the specific strategy. For our Gold Scalper, we recommend at least $500 (or equivalent in cent accounts). For crypto arbitrage, $1000+ is recommended to cover fees.
                            </div>
                        </details>
                    </div>

                    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
                        <details className="group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span className="font-semibold text-white">Can I request a custom strategy?</span>
                                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-400">
                                Yes! Navigate to the "Custom Bots" section or use our Contact page to submit your strategy requirements. Our team will review and provide a quote.
                            </div>
                        </details>
                    </div>

                    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
                        <details className="group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span className="font-semibold text-white">Are there any monthly fees?</span>
                                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-400">
                                Most of our bots are sold with a one-time lifetime license. However, some premium services (like our Cloud Hosting or certain AI signals) may require a subscription. Check the specific product page for details.
                            </div>
                        </details>
                    </div>
                    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
                        <details className="group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span className="font-semibold text-white">Do you offer refunds?</span>
                                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-400">
                                Due to the nature of digital products (source code/software), we generally do not offer refunds once the file has been downloaded. However, if the bot fails to function as described due to a technical error we cannot fix, we will issue a full refund.
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}
