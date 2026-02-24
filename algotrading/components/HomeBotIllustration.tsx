"use client";

import { motion } from "framer-motion";

export default function HomeBotIllustration() {
    return (
        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-1000">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-neon-green/10 rounded-full blur-[120px] pointer-events-none" />

            {/* THE FLOATING CHART PANEL (Left Side) */}
            <motion.div
                initial={{ opacity: 0, x: -50, rotateY: 20 }}
                animate={{ opacity: 1, x: -20, y: [-10, 10, -10], rotateY: 15 }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[5%] top-[25%] w-[280px] md:w-[350px] h-[200px] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl z-10 hidden sm:block"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Shiny top rim reflection */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent rounded-t-xl" />

                {/* SVG Chart Line */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Main Curved Line */}
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        d="M 10 90 C 50 90, 80 140, 130 130 C 180 120, 200 40, 250 50 C 270 55, 290 90, 290 90"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2"
                    />

                    {/* Data Points & Tags */}
                    {/* Point 1: Trailing Buy (Start) */}
                    <g transform="translate(10, 90)">
                        <circle cx="0" cy="0" r="4" fill="#fff" filter="url(#glow)" />
                        <rect x="-10" y="-30" width="60" height="18" rx="9" fill="transparent" stroke="#fff" strokeWidth="0.5" />
                        <text x="20" y="-18" fill="#fff" fontSize="9" fontFamily="sans-serif" textAnchor="middle">trailing buy</text>
                    </g>

                    {/* Point 2: Buy */}
                    <g transform="translate(125, 132)">
                        <circle cx="0" cy="0" r="4" fill="#fff" />
                        <rect x="-15" y="-25" width="30" height="18" rx="9" fill="transparent" stroke="#fff" strokeWidth="0.5" />
                        <text x="0" y="-13" fill="#fff" fontSize="9" fontFamily="sans-serif" textAnchor="middle">buy</text>
                        {/* Trailing Sell tag slightly below */}
                        <rect x="25" y="5" width="60" height="18" rx="9" fill="transparent" stroke="#fff" strokeWidth="0.5" />
                        <text x="55" y="17" fill="#fff" fontSize="9" fontFamily="sans-serif" textAnchor="middle">trailing sell</text>
                    </g>

                    {/* Point 3: Sell (Peak) */}
                    <g transform="translate(245, 48)">
                        <circle cx="0" cy="0" r="4" fill="#fff" />
                        <rect x="-15" y="15" width="30" height="18" rx="9" fill="transparent" stroke="#fff" strokeWidth="0.5" />
                        <text x="0" y="27" fill="#fff" fontSize="9" fontFamily="sans-serif" textAnchor="middle">sell</text>
                        {/* Top Trailing Buy tag */}
                        <rect x="15" y="-30" width="60" height="18" rx="9" fill="transparent" stroke="#fff" strokeWidth="0.5" />
                        <text x="45" y="-18" fill="#fff" fontSize="9" fontFamily="sans-serif" textAnchor="middle">trailing buy</text>
                    </g>
                </svg>
            </motion.div>

            {/* THE ROBOT CHARACTER (Right Side) */}
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-[5%] md:right-[15%] top-[10%] w-[250px] md:w-[320px] h-[450px] z-20"
            >
                <svg viewBox="0 0 300 450" className="w-full h-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.9)]">
                    <defs>
                        {/* Metallic Robot Skin */}
                        <linearGradient id="robotBody" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#7B8CA3" />
                            <stop offset="50%" stopColor="#4A5972" />
                            <stop offset="100%" stopColor="#252D3B" />
                        </linearGradient>

                        {/* Dark inner metallic joints */}
                        <linearGradient id="robotJoints" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1C212D" />
                            <stop offset="100%" stopColor="#0B0D13" />
                        </linearGradient>

                        {/* Face Plate */}
                        <linearGradient id="facePlate" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#111" />
                            <stop offset="100%" stopColor="#000" />
                        </linearGradient>

                        {/* Neon Green Glow for Eyes & Core */}
                        <radialGradient id="neonGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#A8FFD3" />
                            <stop offset="20%" stopColor="#39FF14" />
                            <stop offset="100%" stopColor="#0A3A10" stopOpacity="0" />
                        </radialGradient>

                        <filter id="eyeGlow">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Shadow underneath robot hovering */}
                    <ellipse cx="150" cy="420" rx="80" ry="12" fill="#000" opacity="0.6" filter="url(#eyeGlow)" />

                    {/* Floating Base Exhaust */}
                    <path d="M 110 330 C 130 350, 170 350, 190 330 Z" fill="#39FF14" filter="url(#eyeGlow)" opacity="0.4" />

                    {/* Lower Body Cylinder */}
                    <path d="M 100 240 L 200 240 C 210 320, 170 340, 150 340 C 130 340, 90 320, 100 240" fill="url(#robotBody)" />

                    {/* Upper Torso */}
                    <path d="M 90 200 C 90 140, 210 140, 210 200 C 210 240, 200 260, 150 260 C 100 260, 90 240, 90 200" fill="url(#robotBody)" />

                    {/* Small Core / Logo Emblem */}
                    <circle cx="150" cy="210" r="16" fill="#1C212D" stroke="#00d4ff" strokeWidth="1" />
                    <circle cx="150" cy="210" r="8" fill="#39FF14" filter="url(#eyeGlow)" />
                    {/* Connected Nodes Emblem */}
                    <path d="M 145 210 A 3 3 0 1 1 145 209.9 M 155 210 A 3 3 0 1 1 155 209.9" stroke="#fff" strokeWidth="1.5" fill="none" />
                    <path d="M 148 210 L 152 210" stroke="#fff" strokeWidth="1.5" />

                    {/* Left Arm Upper */}
                    <path d="M 90 180 C 60 170, 40 200, 50 240 C 60 270, 80 270, 80 240" fill="url(#robotBody)" />
                    {/* Left Arm Lower Claw */}
                    <circle cx="65" cy="255" r="12" fill="url(#robotJoints)" />
                    <path d="M 55 260 Q 45 290, 65 300 Q 80 250, 65 255" fill="#1C212D" />

                    {/* Right Arm Upper */}
                    <path d="M 210 180 C 240 170, 260 200, 250 240 C 240 270, 220 270, 220 240" fill="url(#robotBody)" />
                    {/* Right Arm Lower Claw */}
                    <circle cx="235" cy="255" r="12" fill="url(#robotJoints)" />
                    <path d="M 245 260 Q 255 290, 235 300 Q 220 250, 235 255" fill="#1C212D" />

                    {/* Neck */}
                    <rect x="135" y="115" width="30" height="30" fill="url(#robotJoints)" />
                    <line x1="135" y1="130" x2="165" y2="130" stroke="#39FF14" strokeWidth="1" opacity="0.3" filter="url(#eyeGlow)" />

                    {/* Head */}
                    <path d="M 60 80 C 60 -10, 240 -10, 240 80 C 240 150, 180 150, 150 150 C 120 150, 60 150, 60 80" fill="url(#robotBody)" />

                    {/* Ears/Side Discs */}
                    <rect x="50" y="60" width="10" height="40" rx="3" fill="#1C212D" />
                    <ellipse cx="55" cy="80" rx="4" ry="12" fill="#3b82f6" />
                    <rect x="240" y="60" width="10" height="40" rx="3" fill="#1C212D" />
                    <ellipse cx="245" cy="80" rx="4" ry="12" fill="#3b82f6" />

                    {/* Black Face Plate Visor */}
                    <path d="M 80 75 C 80 30, 220 30, 220 75 C 220 120, 200 130, 150 130 C 100 130, 80 120, 80 75" fill="url(#facePlate)" stroke="#111" strokeWidth="2" />

                    {/* Screen glare/reflection */}
                    <path d="M 90 55 C 130 40, 180 40, 210 55 Q 150 65, 90 55" fill="#fff" opacity="0.1" />

                    {/* GLOWING GREEN EYES */}
                    {/* Left Eye */}
                    <rect x="110" y="55" width="22" height="40" rx="10" fill="#39FF14" filter="url(#eyeGlow)">
                        <animate attributeName="height" values="40;5;40" dur="5s" repeatCount="indefinite" begin="0s" />
                        <animate attributeName="y" values="55;72.5;55" dur="5s" repeatCount="indefinite" begin="0s" />
                    </rect>
                    {/* Right Eye */}
                    <rect x="168" y="55" width="22" height="40" rx="10" fill="#39FF14" filter="url(#eyeGlow)">
                        <animate attributeName="height" values="40;5;40" dur="5s" repeatCount="indefinite" begin="0.1s" />
                        <animate attributeName="y" values="55;72.5;55" dur="5s" repeatCount="indefinite" begin="0.1s" />
                    </rect>
                </svg>
            </motion.div>

            {/* Floating Top Coin */}
            <motion.div
                animate={{ y: [-10, 10, -10], rotate: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-[5%] top-[5%] z-30"
            >
                <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="20" fill="transparent" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)" />
                    <circle cx="30" cy="30" r="12" fill="#00d4ff" opacity="0.6" />
                    <path d="M 24 30 L 36 30" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 30 24 L 30 36" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                </svg>
            </motion.div>

            {/* Floating Bottom Coin */}
            <motion.div
                animate={{ y: [10, -10, 10], rotate: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute left-[35%] bottom-[15%] z-30"
            >
                <svg width="70" height="70" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r="25" fill="#1a1e29" stroke="#39FF14" strokeWidth="3" filter="url(#glow)" />
                    <path d="M 28 35 A 4 4 0 1 1 28 34.9 M 42 35 A 4 4 0 1 1 42 34.9" stroke="#fff" strokeWidth="2" fill="none" />
                    <path d="M 32 35 L 38 35" stroke="#fff" strokeWidth="2" />
                </svg>
            </motion.div>

        </div>
    );
}
