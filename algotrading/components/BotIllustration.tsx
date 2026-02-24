
"use client";

import { motion } from "framer-motion";

export default function BotIllustration() {
    return (
        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-1000">

            {/* Dynamic Background Pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon-green/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-blue-600/20 rounded-full blur-[100px]" />

            {/* Main Floating Container */}
            <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full flex items-center justify-center"
            >
                {/* Outer Orbiting Data Rings */}
                <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
                    viewBox="0 0 200 200"
                >
                    <circle cx="100" cy="100" r="85" stroke="url(#neonGradient)" strokeWidth="0.5" fill="none" strokeDasharray="4 8" />
                    <circle cx="100" cy="100" r="95" stroke="#3b82f6" strokeWidth="0.2" fill="none" strokeDasharray="20 40" />
                </motion.svg>

                {/* THE PREMIUM AI CORE SVG */}
                <svg
                    viewBox="0 0 400 400"
                    className="w-[320px] h-[320px] md:w-[450px] md:h-[450px] z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Premium Dark Glass Gradient */}
                        <linearGradient id="darkGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1a1a24" stopOpacity="0.95" />
                            <stop offset="50%" stopColor="#0f0f13" stopOpacity="0.98" />
                            <stop offset="100%" stopColor="#050505" stopOpacity="1" />
                        </linearGradient>

                        {/* Metallic Edge Highlight */}
                        <linearGradient id="metallicEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#39ff14" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#111" stopOpacity="1" />
                        </linearGradient>

                        {/* Neon Green Core Glow */}
                        <radialGradient id="neonCore" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#39ff14" stopOpacity="1" />
                            <stop offset="40%" stopColor="#39ff14" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#39ff14" stopOpacity="0" />
                        </radialGradient>

                        {/* Blue Energy Lines */}
                        <linearGradient id="blueEnergy" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#00d4ff" stopOpacity="1" />
                        </linearGradient>

                        {/* Blur Filter for extreme glows */}
                        <filter id="hyperGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="blur1" />
                            <feGaussianBlur stdDeviation="15" result="blur2" />
                            <feMerge>
                                <feMergeNode in="blur2" />
                                <feMergeNode in="blur1" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <g transform="translate(200, 200)">

                        {/* Back Armor Plates */}
                        <path d="M-120 -40 L0 -140 L120 -40 L100 100 L0 150 L-100 100 Z" fill="#08080c" stroke="#1f2937" strokeWidth="2" />

                        {/* Inner Hexagon Core Housing */}
                        <polygon points="0,-110 95,-55 95,55 0,110 -95,55 -95,-55" fill="url(#darkGlass)" stroke="url(#metallicEdge)" strokeWidth="3" />

                        {/* Carbon Fiber/Tech lines texture (Simplified via paths) */}
                        <g opacity="0.15" stroke="#ffffff" strokeWidth="0.5">
                            <line x1="-90" y1="-50" x2="90" y2="50" />
                            <line x1="-90" y1="50" x2="90" y2="-50" />
                            <line x1="0" y1="-100" x2="0" y2="100" />
                            <line x1="-80" y1="0" x2="80" y2="0" />
                        </g>

                        {/* Central Processing Node */}
                        <circle cx="0" cy="0" r="45" fill="#000" stroke="#39ff14" strokeWidth="1" strokeDasharray="5 5" />
                        <circle cx="0" cy="0" r="35" fill="#0a0a0f" stroke="#3b82f6" strokeWidth="2" />

                        {/* Pulsing Core */}
                        <motion.circle
                            cx="0" cy="0" r="20"
                            fill="#39ff14"
                            filter="url(#hyperGlow)"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <circle cx="0" cy="0" r="10" fill="#fff" opacity="0.9" />

                        {/* Orbiting Data Particles around Core */}
                        <motion.g animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
                            <circle cx="0" cy="-65" r="4" fill="#3b82f6" filter="url(#hyperGlow)" />
                            <circle cx="56" cy="32" r="3" fill="#39ff14" filter="url(#hyperGlow)" />
                            <circle cx="-56" cy="32" r="5" fill="#00d4ff" filter="url(#hyperGlow)" />
                        </motion.g>

                        {/* Futuristic UI Elements (Side Panels) */}
                        <g opacity="0.8">
                            <rect x="-140" y="-30" width="10" height="60" rx="2" fill="#111" stroke="#39ff14" strokeWidth="1" />
                            <motion.rect
                                x="-139" y="10" width="8" height="15" rx="1" fill="#39ff14" filter="url(#hyperGlow)"
                                animate={{ y: [-35, 10, -35] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            <rect x="130" y="-30" width="10" height="60" rx="2" fill="#111" stroke="#3b82f6" strokeWidth="1" />
                            <motion.rect
                                x="131" y="-20" width="8" height="20" rx="1" fill="#3b82f6" filter="url(#hyperGlow)"
                                animate={{ height: [10, 40, 10], y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </g>

                        {/* Floating Trading Chart Lines inside the housing */}
                        <motion.path
                            d="M-70 0 L-40 -20 L-10 10 L20 -30 L50 -10 L70 -50"
                            fill="none"
                            stroke="url(#blueEnergy)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.8"
                            animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            filter="url(#hyperGlow)"
                        />

                        {/* Top and Bottom Data Nodes */}
                        <path d="M-20 -115 L20 -115 L10 -95 L-10 -95 Z" fill="#39ff14" opacity="0.8" filter="url(#hyperGlow)" />
                        <path d="M-20 115 L20 115 L10 95 L-10 95 Z" fill="#39ff14" opacity="0.8" filter="url(#hyperGlow)" />

                    </g>
                </svg>

                {/* Floating Data Card - Left */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-1/4 left-0 md:left-10 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-neon-green/40 shadow-[0_0_30px_rgba(57,255,20,0.2)] flex items-center gap-4 z-20"
                >
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 w-8 h-8 rounded-full border border-neon-green border-t-transparent animate-spin" />
                        <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse shadow-[0_0_10px_#39ff14]" />
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Engine Status</div>
                        <div className="text-sm font-bold text-white font-mono tracking-tight">OPTIMIZING_</div>
                    </div>
                </motion.div>

                {/* Floating Data Card - Right */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-1/4 right-0 md:right-10 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.2)] flex items-center gap-4 z-20"
                >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-500/30">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Win Rate</div>
                        <div className="text-sm font-bold text-white">99.98% <span className="text-neon-green text-xs">▲</span></div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
