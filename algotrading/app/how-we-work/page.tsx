import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import HowWeWorkClient from "./HowWeWorkClient";

export const metadata: Metadata = {
    title: "How We Work | Step-by-Step Algo Development Process",
    description: "Learn how we build your custom trading algorithm in 7 transparent steps. From strategy specification to final delivery, see real proofs of our workflow.",
};

export default function HowWeWorkPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-neon-green/30 selection:text-neon-green">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center text-center">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-neon-green/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

                <div className="max-w-4xl mx-auto z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-gray-300 text-sm font-medium mb-8">
                        <CheckCircle2 className="w-4 h-4 text-neon-green" /> 100% Transparent Process
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
                        How We Build Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-neon-green">
                            Trading Algorithm
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        Join 459+ traders who have successfully automated their strategies. Discover our proven, 7-step development lifecycle from idea to deployment.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact" className="px-8 py-4 bg-neon-green text-black font-extrabold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                            Start Your Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Interactive Timeline Section (Client Component) */}
            <HowWeWorkClient />

            {/* CTA Section */}
            <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-t from-gray-900/40 to-black text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-5xl font-black text-white">Ready to automate your strategy?</h2>
                    <p className="text-xl text-gray-400">Our expert developers are standing by to discuss your custom requirements.</p>
                    <Link href="/contact" className="inline-flex px-10 py-5 bg-white text-black font-black text-xl rounded-xl hover:bg-gray-200 transition-colors shadow-xl">
                        Get Started Today
                    </Link>
                </div>
            </section>
        </div>
    );
}
