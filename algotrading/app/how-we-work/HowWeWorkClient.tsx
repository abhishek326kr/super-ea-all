"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Download, FileText, Lock, Settings, Shield, Zap, Presentation, CheckSquare, Rocket } from "lucide-react";

const steps = [
    {
        id: "step-1",
        num: "01",
        title: "Strategy Specification Submission",
        badge: "Initial Phase",
        icon: FileText,
        description: "The client provides a detailed outline of their trading strategy, including entry and exit logic, risk parameters, timeframe preferences, and execution rules. These specifications serve as the foundational blueprint for developing the automated trading bot.",
    },
    {
        id: "step-2",
        num: "02",
        title: "NDA & Invoice Confirmation",
        badge: "Confidentiality",
        icon: Shield,
        description: "To ensure transparency and confidentiality, we provide a standard Non-Disclosure Agreement (NDA) for both parties to sign. This legal document guarantees the protection of your intellectual property and trading strategy before we proceed with the project development.",
    },
    {
        id: "step-3",
        num: "03",
        title: "Project Initiation & Payment Terms",
        badge: "Commitment",
        icon: Zap,
        description: "To formally commence the project, a first installment is collected as a token advance. This initial payment confirms the client’s commitment and allows our team to allocate resources and initiate development without delay.",
    },
    {
        id: "step-4",
        num: "04",
        title: "First Demo Delivery for Client Testing",
        badge: "Testing",
        icon: Presentation,
        description: "Upon completion of initial development, a first demo version is delivered for comprehensive testing. This stage allows the client to review functionality and verify that the system aligns with agreed specifications.",
    },
    {
        id: "step-5",
        num: "05",
        title: "Strategy Enhancement & Refining",
        badge: "Enhancement",
        icon: Settings,
        description: "We review client feedback and live testing results to proceed with refining and enhancing the strategy. This ensures the final version is technically sound and strategically strengthened.",
    },
    {
        id: "step-6",
        num: "06",
        title: "Final Payment",
        badge: "Completion",
        icon: CheckSquare,
        description: "Once enhancements are approved, the remaining balance is processed. Upon confirmation, the fully optimized version is delivered, ensuring it meets all agreed specifications.",
    },
    {
        id: "step-7",
        num: "07",
        title: "Final Project Delivery",
        badge: "Success",
        icon: Rocket,
        description: "The finalized version of the system is officially delivered to the client. At this stage, the client receives the complete deployment package, ensuring a smooth transition from development to live implementation.",
    }
];

export default function HowWeWorkClient() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="py-24 px-6 relative max-w-7xl mx-auto">
            {/* The Vertical Connecting Line */}
            <div className="absolute top-24 bottom-24 left-6 md:left-1/2 w-1 bg-white/5 rounded-full -translate-x-1/2 hidden md:block" />

            {/* The Animated Active Line */}
            <motion.div
                style={{ height: lineHeight }}
                className="absolute top-24 left-6 md:left-1/2 w-1 bg-gradient-to-b from-neon-green via-blue-500 to-neon-green rounded-full -translate-x-1/2 hidden md:block origin-top z-0 shadow-[0_0_20px_rgba(57,255,20,0.5)]"
            />

            <div className="space-y-32 relative z-10">
                {steps.map((step, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full ${isEven ? "" : "md:flex-row-reverse"}`}
                        >
                            {/* Text Content Area */}
                            <div className={`flex-1 flex flex-col ${isEven ? "md:items-end text-left md:text-right" : "md:items-start text-left"}`}>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">
                                    {step.badge}
                                </div>
                                <h3 className="text-2xl md:text-4xl font-black text-white mb-4">
                                    <span className="text-neon-green/50 mr-3">{step.num}.</span>
                                    {step.title}
                                </h3>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                                    {step.description}
                                </p>
                            </div>

                            {/* Center Node (Number Indicator) */}
                            <div className="hidden md:flex w-16 h-16 rounded-full bg-black border-4 border-neon-green items-center justify-center shrink-0 z-10 shadow-[0_0_30px_rgba(57,255,20,0.3)] text-xl font-black text-white">
                                <step.icon className="w-6 h-6" />
                            </div>

                            {/* Visual Proof Area */}
                            <div className="flex-1 w-full flex justify-center">
                                <ProofVisualizer stepNum={index + 1} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}

// -------------------------------------------------------------------------------- //
// Advanced UI Components replacing static image screenshots 
// -------------------------------------------------------------------------------- //

function ProofVisualizer({ stepNum }: { stepNum: number }) {
    // Dynamic component rendering based on the step number
    switch (stepNum) {
        case 1:
            return <ProofDoc icon={<FileText className="w-8 h-8 text-blue-400" />} title="Strategy_Logic.pdf" type="Blueprint" />;
        case 2:
            return <ProofNDA />;
        case 3:
            return <ProofInvoice />;
        case 4:
            return <ProofChat message="Hi! We have completed the first demo of your strategy. Please test it out." attachment="Robot_v1_Demo.ex4" />;
        case 5:
            return <ProofChat message="Noted. I have updated the trailing stop logic exactly as requested." attachment="Code_Updated" isDeveloper />;
        case 6:
            return <ProofPayment />;
        case 7:
            return <ProofDelivery />;
        default:
            return null;
    }
}

function ProofDoc({ icon, title, type }: { icon: any, title: string, type: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="w-full max-w-[300px] aspect-[3/4] rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-sm perspective-1000"
        >
            <div className="flex justify-between items-start">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">{icon}</div>
                <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">{type}</div>
            </div>

            <div className="space-y-3 mt-auto">
                <div className="h-2 w-full bg-white/10 rounded-full" />
                <div className="h-2 w-5/6 bg-white/10 rounded-full" />
                <div className="h-2 w-4/6 bg-white/10 rounded-full" />
                <h4 className="text-white font-mono font-bold mt-4 border-t border-white/10 pt-4 truncate">{title}</h4>
            </div>
        </motion.div>
    );
}

function ProofNDA() {
    return (
        <div className="w-full max-w-[340px] rounded-xl bg-[#0f0f13] border border-white/10 p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lock className="w-32 h-32" />
            </div>
            <h4 className="text-lg font-black text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Non-Disclosure Agreement</h4>
            <div className="space-y-4 text-xs font-mono text-gray-500 leading-relaxed mb-8">
                <p>This Agreement is entered into to ensure complete confidentiality of the proprietary trading strategy.</p>
                <div className="h-1 w-full bg-white/5 rounded" />
                <div className="h-1 w-3/4 bg-white/5 rounded" />
            </div>
            <div className="flex items-end justify-between mt-8 pt-4 border-t border-white/10">
                <div>
                    <div className="text-[10px] text-gray-400 uppercase">Algotradingbot CEO</div>
                    <div className="font-signature text-2xl text-white mt-1">Mayank</div>
                </div>
                <div className="px-3 py-1 rounded border border-neon-green text-neon-green text-xs font-bold transform -rotate-12">
                    SIGNED & VERIFIED
                </div>
            </div>
        </div>
    );
}

function ProofInvoice() {
    return (
        <div className="w-full max-w-[320px] rounded-2xl bg-white text-black p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-2 hover:rotate-0 transition-transform">
            <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-4">
                <div>
                    <h4 className="font-black text-2xl">INVOICE</h4>
                    <div className="text-xs text-gray-500 font-mono mt-1">#YF-2026-8941</div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold uppercase tracking-widest text-[#0047FF]">Algotradingbot</div>
                    <div className="text-[10px] text-gray-500">Initial Deposit</div>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm border-b border-dashed border-gray-300 pb-2">
                    <span className="font-semibold text-gray-700">Custom EA Dev (Advance)</span>
                    <span className="font-mono font-bold">$400.00</span>
                </div>
                <div className="flex justify-between text-sm border-b border-dashed border-gray-300 pb-2">
                    <span className="font-semibold text-gray-700">NDA Processing</span>
                    <span className="font-mono font-bold">$0.00</span>
                </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span className="font-bold text-sm text-gray-600 uppercase">Amount Paid</span>
                <span className="text-2xl font-black text-green-600">$400.00</span>
            </div>
        </div>
    );
}

function ProofChat({ message, attachment, isDeveloper = false }: { message: string, attachment?: string, isDeveloper?: boolean }) {
    return (
        <div className="w-full max-w-[300px] rounded-3xl bg-[#111B21] border border-[#2A3942] p-4 font-sans shadow-2xl relative overflow-hidden">
            {/* WhatsApp UI Mock */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2A3942]">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold shrink-0">
                    {isDeveloper ? 'Client' : 'YF'}
                </div>
                <div>
                    <div className="text-white font-semibold text-sm">{isDeveloper ? 'Retail Trader' : 'Algotradingbot Dev Team'}</div>
                    <div className="text-gray-400 text-xs text-[#00A884]">online</div>
                </div>
            </div>

            <div className={`p-3 rounded-xl text-sm leading-relaxed max-w-[85%] ${isDeveloper ? 'bg-[#005C4B] text-white ml-auto rounded-tr-none' : 'bg-[#202C33] text-gray-100 rounded-tl-none'}`}>
                {message}
                {attachment && (
                    <div className="mt-3 p-2 rounded-lg bg-black/20 border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-black/30 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                            {attachment.includes('.ex') ? <Download className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                        </div>
                        <div className="font-mono text-xs truncate font-bold text-blue-300">{attachment}</div>
                    </div>
                )}
                <div className="text-[10px] text-gray-400 text-right mt-1 flex items-center justify-end gap-1">
                    10:42 AM <CheckCircle2 className="w-3 h-3 text-[#53bdeb]" />
                </div>
            </div>
        </div>
    );
}

function ProofPayment() {
    return (
        <div className="w-full max-w-[320px] rounded-2xl bg-gradient-to-br from-green-900/40 to-black border border-green-500/30 p-6 shadow-[0_0_40px_rgba(34,197,94,0.15)] text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-[40px]" />

            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>

            <h4 className="text-white font-black text-xl mb-1">Payment Successful</h4>
            <p className="text-green-400/80 text-xs font-mono mb-8">Txn: 0x8f...4a12 • Confirmed</p>

            <div className="bg-black/50 rounded-xl p-4 border border-white/5 font-mono text-left space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Amount Sent</span>
                    <span className="text-white font-bold">$350.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Memo</span>
                    <span className="text-gray-300 text-xs">Final payment for Custom EA</span>
                </div>
            </div>
        </div>
    );
}

function ProofDelivery() {
    return (
        <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-[300px] rounded-2xl bg-[#0a0a0f] border border-[#3b82f6]/40 p-6 shadow-[0_0_50px_rgba(59,130,246,0.2)] text-center"
        >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#3b82f6] to-cyan-400 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30">
                <Rocket className="w-10 h-10 text-white" />
            </div>

            <h4 className="text-white font-black text-xl mb-2">Final Deployment Kit</h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Your custom algorithm is fully optimized and ready to connect to your live broker account.</p>

            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download Package.zip
            </button>
        </motion.div>
    );
}
