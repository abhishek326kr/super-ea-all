import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Login - AlgoTradingBot",
    description: "Sign in to access your algorithmic trading dashboard.",
    alternates: {
        canonical: "https://algotradingbot.online/login",
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
