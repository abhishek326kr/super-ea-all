import React, { useId } from 'react';

const Logo = ({ className = "h-8 w-auto", iconClassName = "w-8 h-8", textClassName = "text-xl" }: { className?: string, iconClassName?: string, textClassName?: string }) => {
    const uniqueId = useId();
    const gradientId = `neonGradient-${uniqueId}`;
    const filterId = `glow-${uniqueId}`;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Logo Icon */}
            <div className="relative flex items-center justify-center">
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={iconClassName}
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="currentColor" />
                        </linearGradient>
                        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Main Hexagon Shape */}
                    <path
                        d="M50 5 L90 28 V72 L50 95 L10 72 V28 Z"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-gray-500 opacity-50"
                    />

                    {/* Electronic Circuit Path - forming an 'A' or Up trend */}
                    <path
                        d="M30 70 L50 30 L70 70 M40 50 H60"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter={`url(#${filterId})`}
                        className="text-neon-green"
                    />

                    {/* Connection Nodes */}
                    <circle cx="30" cy="70" r="3" fill="currentColor" className="text-neon-green" />
                    <circle cx="70" cy="70" r="3" fill="currentColor" className="text-neon-green" />
                    <circle cx="50" cy="30" r="3" fill="white" />

                    {/* Chart Arrow */}
                    <path
                        d="M75 40 L90 25 M90 25 H78 M90 25 V37"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-neon-green"
                    />
                </svg>
                {/* Glow effect under the logo */}
                <div className="absolute inset-0 bg-neon-green/20 blur-md rounded-full -z-10" />
            </div>

            {/* Logo Text */}
            <span className={`font-bold tracking-tight text-white ${textClassName}`}>
                AlgoTrading<span className="text-neon-green">Bot</span>
            </span>
        </div>
    );
};

export default Logo;
