import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "AlgoTradingBot.online",
        short_name: "AlgoTradingBot",
        description:
            "Advanced algorithmic trading bots and strategies for modern traders. Institutional-grade algorithms for retail & enterprise traders.",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#39ff14",
        icons: [
            {
                src: "/logo.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
