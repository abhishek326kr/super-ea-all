import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const SITE_URL = process.env.SITE_URL || "https://algotradingbot.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AlgoTradingBot.online - Intelligent Algorithmic Trading",
    template: "%s | AlgoTradingBot",
  },
  description: "Advanced algorithmic trading bots and strategies for modern traders. Institutional-grade algorithms for retail & enterprise traders.",
  keywords: ["algorithmic trading", "trading bots", "expert advisor", "EA development", "MT4", "MT5", "forex trading", "algo trading", "automated trading"],
  authors: [{ name: "AlgoTradingBot" }],
  creator: "AlgoTradingBot",
  publisher: "AlgoTradingBot",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "AlgoTradingBot.online",
    title: "AlgoTradingBot.online - Intelligent Algorithmic Trading",
    description: "Advanced algorithmic trading bots and strategies for modern traders. Institutional-grade algorithms for retail & enterprise traders.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "AlgoTradingBot Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoTradingBot.online - Intelligent Algorithmic Trading",
    description: "Advanced algorithmic trading bots and strategies for modern traders.",
    images: ["/logo.png"],
    creator: "@AlgoTradingBot",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here when available
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} font-sans`}>
      <body className="antialiased bg-black text-white min-h-screen flex flex-col">
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-6QJ6559J4F`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-6QJ6559J4F');
          `}
        </Script>

        {/* Organization Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AlgoTradingBot",
              url: "https://algotradingbot.online",
              logo: "https://algotradingbot.online/logo.png",
              description: "Advanced algorithmic trading bots and strategies for modern traders.",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                url: "https://algotradingbot.online/contact",
              },
              sameAs: [
                "https://t.me/AlgoTradingBotSupport",
              ],
            }),
          }}
        />

        <Header />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}
