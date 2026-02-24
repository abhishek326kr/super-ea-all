import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const count = await prisma.blog.count()
    if (count > 0) {
        console.log("Database already seeded.")
        return
    }

    console.log("Seeding database...")

    const author = await prisma.user.create({
        data: {
            email: 'admin@algotradingbot.online',
            password: 'hashed_password_here',
            name: 'AlgoTeam',
            role: 'admin'
        }
    })

    const catNames = [
        "Custom Strategies",
        "MT5 & Popular Bots",
        "Gold & Crypto",
        "General Auto-Trading"
    ]

    for (let i = 0; i < catNames.length; i++) {
        await prisma.category.create({
            data: {
                categoryId: i + 1,
                name: catNames[i]
            }
        })
    }

    // Post 1
    await prisma.blog.create({
        data: {
            title: "XAUUSD Gold Scalper Pro: High Accuracy Minute Trading",
            seoSlug: "gold-scalper-pro-xauusd",
            content: "<h2>Dominating the Gold Market</h2><p>Gold (XAUUSD) is known for its volatility and massive liquidity. Our Gold Scalper Pro is designed to harvest small profits repeatedly throughout the London and New York sessions.</p><h3>Key Features:</h3><ul><li><strong>Dynamic Spread Adaptation:</strong> Doesn't trade when spreads widen during news.</li><li><strong>Smart Recovery:</strong> Uses a soft-martingale approach that is mathematically calculated to limit drawdown.</li><li><strong>News Filter:</strong> Connects to ForexFactory API to pause trading 30mins before high-impact news.</li></ul><p><img src=\"https://images.unsplash.com/photo-1610375460993-1a0e94f30d0c?q=80&w=1000&auto=format&fit=crop\" alt=\"Gold Trading Chart\" style=\"width:100%; height:auto; border-radius:12px; margin: 2rem 0;\" /></p><h3>Backtest Results</h3><p>In 2025 backtests, this bot achieved a 92% win rate with a maximum drawdown of 8%. It requires a low-latency VPS for optimal performance.</p>",
            excerpt: "Specialized bot for XAUUSD (Gold) pair. Optimized for M1 and M5 timeframes with news filter integration.",
            author: "AlgoTeam",
            authorId: author.id,
            status: "published",
            featuredImages: "https://images.unsplash.com/photo-1610375460993-1a0e94f30d0c?q=80&w=1000&auto=format&fit=crop",
            categories: {
                create: {
                    category: {
                        connect: { name: "Gold & Crypto" }
                    }
                }
            }
        }
    })

    // Post 2
    await prisma.blog.create({
        data: {
            title: "MT5 Trend Catcher: The Most Popular Trend Following Bot",
            seoSlug: "mt5-trend-catcher-popular",
            content: "<h2>The Trend is Your Friend</h2><p>This is the bot that everyone asks for. A robust, multi-currency trend catcher that works beautifully on EURUSD, GBPUSD, and USDJPY. It uses a combination of ADX and EMA crosses to identify strong momentum.</p><h3>Platform: MetaTrader 5 (MT5)</h3><p>Built specifically for MT5 to leverage its multi-threaded backtesting capabilities and hedging mode.</p>",
            excerpt: "The classic trend-following strategy ported to MetaTrader 5 with advanced trailing stop features.",
            author: "Alex Quant",
            authorId: author.id,
            status: "published",
            downloadLink: "#",
            featuredImages: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=1000&auto=format&fit=crop",
            categories: {
                create: {
                    category: {
                        connect: { name: "MT5 & Popular Bots" }
                    }
                }
            }
        }
    })

    // Post 3
    await prisma.blog.create({
        data: {
            title: "Custom Strategy: 'The London Breakout' Implementation",
            seoSlug: "custom-london-breakout-strategy",
            content: "<h2>From Idea to Code</h2><p>One of our users submitted a strategy based on the range formed between 7:00 AM and 8:00 AM GMT. We converted this manual rule into a fully automated EA.</p><h3>Strategy Logic</h3><p>The bot places buy stop and sell stop orders at the highs and lows of the designated hour. When one triggers, the other is cancelled (OCO).</p><blockquote>\"I had this strategy in my head for years. AlgoTradingBot turned it into reality in 2 days.\" - John D.</blockquote>",
            excerpt: "A client requested a specific variation of the London Breakout strategy. Here is how we automated it.",
            author: "Dev Support",
            authorId: author.id,
            status: "published",
            featuredImages: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
            categories: {
                create: {
                    category: {
                        connect: { name: "Custom Strategies" }
                    }
                }
            }
        }
    })

    console.log("Seeding complete.")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
