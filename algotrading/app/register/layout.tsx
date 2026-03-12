import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Register - AlgoTradingBot",
    description: "Create your AlgoTradingBot account and start your algorithmic trading journey today.",
    alternates: {
        canonical: "https://algotradingbot.online/register",
    },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
