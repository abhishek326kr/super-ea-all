
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy - AlgoTradingBot',
    description: 'Privacy Policy details for AlgoTradingBot use.',
};

export default function PrivacyPolicyPage() {
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

                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Privacy Policy</h1>
                <p className="text-gray-400 text-sm">Last updated: February 19, 2026</p>

                <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                    <p>
                        This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from AlgoTradingBot.online.
                    </p>

                    <h3>1. Personal Information We Collect</h3>
                    <p>
                        When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
                    </p>

                    <h3>2. How We Use Your Personal Information</h3>
                    <p>
                        We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
                    </p>

                    <h3>3. Sharing Your Personal Information</h3>
                    <p>
                        We share your Personal Information with third parties to help us use your Personal Information, as described above. We use Google Analytics to help us understand how our customers use the Site.
                    </p>

                    <h3>4. Data Retention</h3>
                    <p>
                        When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
                    </p>

                    <h3>5. Contact Us</h3>
                    <p>
                        For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:support@algotradingbot.online" className="text-neon-green">support@algotradingbot.online</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
