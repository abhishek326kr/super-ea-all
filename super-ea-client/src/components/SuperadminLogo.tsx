import { SvgIcon, SvgIconProps } from '@mui/material';

/**
 * Superadmin premium logo — a stylised "S" constructed from
 * two converging paths that meet at a vertical stem,
 * rendered inside a rounded-square gradient container.
 */
const SuperadminLogo = (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox="0 0 40 40">
        {/* Background rounded rectangle */}
        <defs>
            <linearGradient id="yf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
            <linearGradient id="yf-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
        </defs>
        <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#yf-grad)" />

        {/* Inner glow ring */}
        <rect x="3" y="3" width="34" height="34" rx="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />

        {/* Stylised "Y" — two diagonal strokes merging into a vertical stem */}
        {/* Left diagonal */}
        <path
            d="M11 11 L20 22"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
        />
        {/* Right diagonal */}
        <path
            d="M29 11 L20 22"
            stroke="url(#yf-accent)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
        />
        {/* Vertical stem */}
        <path
            d="M20 22 L20 30"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
        />

        {/* Small accent dot */}
        <circle cx="29" cy="11" r="1.8" fill="#F59E0B" />
    </SvgIcon>
);

export default SuperadminLogo;
