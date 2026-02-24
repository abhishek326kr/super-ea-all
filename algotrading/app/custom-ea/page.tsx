import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, Cpu, Shield, Zap, Terminal, FileCode2, LineChart, FileText, CheckSquare, Presentation, Rocket, HelpCircle, ChevronDown, Settings, Star } from "lucide-react";

// Testimonials Data
const testimonials = [
    { initials: "AP", name: "Angal prashant", text: "I’m happy with the custom algo trading software you built for me. It works exactly the way I wanted and fits my needs perfectly. The team understood my requirements well and delivered a smooth, reliable solution." },
    { initials: "SK", name: "Sandeep Kolhe", text: "My experience with the Algotradingbot team has been excellent. Their prompt support and guidance during the entire software development journey have been highly valuable. Thank you for your consistent commitment." },
    { initials: "SG", name: "Surender Gangwar", text: "I extend my sincere appreciation to Algotradingbot for their outstanding work in the development of cutting-edge crypto software. Your team’s expertise, dedication, and innovative approach have truly made a significant impact. The seamless design and user-friendly interface reflect your deep understanding of the crypto industry." },
    { initials: "VR", name: "Vinay Raskar", text: "Very satisfied with the algo trading system developed. The logic was implemented accurately, and the system performs reliably under live conditions. Communication and support throughout the project were excellent." },
    { initials: "RK", name: "Raj Keshwani", text: "I’ve been working with Algotradingbot for a while now, and the experience has been excellent. Their team is skilled, responsive, and truly understands both the technical and practical aspects of algorithmic trading software." },
    { initials: "RS", name: "Raghu Sangeetha", text: "This is my third project with the Algotradingbot team, and based on my experience, I can confidently say that Algotradingbot is one of the top players in algorithmic trading... A special mention to my project coder, Jigyanshu Sharma-He has been exceptional throughout... I am happy to give a 5-star rating, always!" },
    { initials: "VN", name: "VINAY NAGPURE", text: "The way you break down complex projects into manageable tasks is incredibly helpful. I really appreciate the collaborative culture here Thank You Mayank Sir, Jigyanshu Sir & Shweta Mam" },
    { initials: "AS", name: "Akhil Sharma", text: "It was really great experience with Algotradingbot team.I would like to thanks mr santesh and shubham for develop my algo system... Thank you all and i would recommend Algotradingbot to all the traders who want to develop their software. Thank you" },
    { initials: "AG", name: "Ashish Gaur", text: "Good experience working with them. The automated trading system was built as per my needs and works smoothly. Helped simplify my trading." },
    { initials: "LI", name: "Linsith", text: "Trade Hull and Mr. Bala are highly professional and experienced. Mr. Bala demonstrated great patience in addressing all my doubts... I highly recommend Trade Hull for their exceptional service and professionalism!" },
    { initials: "SJ", name: "Santos Jadhav", text: "Fantastic Experience with Team Algotradingbot! Team Algotradingbot,( Mayank & Bala) thank you for bringing my algo trading strategy to life!... I highly recommend Algotradingbot to anyone looking to build their own algo trading system. If you want to trade efficiently and without emotions, this is the team to trust! Thanks again! Santos" },
    { initials: "SP", name: "Surath panda", text: "I developed a customized algo with the help of Algotradingbot. The service and the support is highly appreciated . The SPOC Mr. Balakumar has done fabolous job for making the algo. I really would like to thank everyone who ever was part of my algo development." },
    { initials: "SR", name: "Subashchandrabose", text: "This is my second project with the team, and I’m once again extremely impressed... A special shout-out to Jigyanshu Sharma and the Algotradingbot team... I’d gladly give Jigyanshu Sharma a 5-star rating for his excellent work... Your assistance has been truly invaluable!" },
    { initials: "VS", name: "VIJAY SINGH", text: "Great experience and support I get every time whenever I need it throught the development of the software. Thanks Algotradingbot team for your kind support continuesly throughout the commitment period." },
    { initials: "UB", name: "uttam bisht", text: "Sathesh and Shubham both are ultimate coder.. .made my trading algo all stretegy perfectly match..." },
    { initials: "DK", name: "Didar Keshvani", text: "I want to express my heartfelt appreciation for the excellent job done by Algotradingbot. Their team was incredibly supportive... I truly admire how they prioritize client satisfaction... Thank you, Algotradingbot, for an outstanding experience!" },
    { initials: "RP", name: "Rajiv Poddar", text: "Extremely professional team, worked with me patiently over several weeks and provided extensive post-project support. Will definitely recommend this to anyone who needs any support on coding." },
    { initials: "AG", name: "Ankit Goel", text: "The experience of working with the Algotradingbot team has been great. The required solution was delivered in a timely manner... Expecting great results in future as well. Thanks." },
    { initials: "AA", name: "Abdul Ahmed", text: "Very professional team." },
    { initials: "GS", name: "Girish surana", text: "I had good experience, ops and support team very cooperative, the software was provided within time with each details check... Thank you Mayank, Shubham and Sathesh all Algotradingbot team" },
    { initials: "RB", name: "Rohit Bali", text: "Review of Algotradingbot Software Development Company: I engaged with the team led by Mayank for the development of a sophisticated software... Overall, I highly recommend them for their exemplary work... Working with them was a pleasure..." },
    { initials: "PR", name: "Pranay", text: "I have previously mentioned about my fantastic experience with Trade Hull. I would further like to add that they are a team of brilliant folks... thank you, you'll are awesome! Also: Wonderful experience interacting and working with Algotradingbot team..." },
    { initials: "PT", name: "Pritam (Rudra Capital)", text: "Very good customer support of trade hull also very experienced coder I am full satisfied." },
    { initials: "JL", name: "Jitendra Lakhani", text: "Working with Algotradingbot was an absolute pleasure from start to finish. Their team's professionalism and attention to detail were exemplary... I highly recommend Algotradingbot for their outstanding service and commitment to excellence." },
    { initials: "RD", name: "Rupesh Dave", text: "Your contribution to this project have been invaluable. Thanku for all your hard work" },
    { initials: "SN", name: "Sunny", text: "Its the best algo trading platform for a beginner. Delivered all the requirements with continued support. All the requirements are taken down to the minutest of details and implementation is a smooth transition for a beginner in this field." },
    { initials: "TM", name: "Tanmay (West Bengal)", text: "Algotradingbot team is highly skillful team and never say it is impossible to develop even though the strategy is logically heavy & complicated... Thanks to developer Ankit Sir, Shweta Madam..." },
    { initials: "SD", name: "Sandip Dangir", text: "Very fast and accurate work by Algotradingbot" },
    { initials: "KG", name: "Ketan Goswami", text: "Service is amazing and software results is 100% working" },
    { initials: "AP", name: "Ashish patel", text: "I would like to express my sincere thanks for the wonderful support and guidance provided during the creation of the algorithm... A very special thanks to Priya Madam for her valuable insights... I look forward to being part of more such meaningful projects in the future." }
];

export const metadata: Metadata = {
    title: "Custom EA Development - AlgoTradingBot",
    description: "Get a fully custom Expert Advisor built to your exact trading strategy. Professional MT4/MT5 EA development with backtesting and optimization.",
};

export default function CustomEAPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-sm font-medium w-fit">
                                <Code2 className="w-4 h-4" /> Trusted by Institutional & Retail Traders
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                                Custom Algo <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400">Development Solutions</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed font-medium">
                                "459 trades in 1.2 hrs & zero trading errors - an algo made for a client, by our developers."
                            </p>
                            <p className="text-gray-400 max-w-2xl leading-relaxed text-sm md:text-base">
                                We transform your manual trading strategy into a fully automated, lightning-fast algorithm. Execute trades with absolute precision, zero emotion, and 24/5 market coverage.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/contact" className="px-8 py-4 bg-neon-green text-black font-extrabold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                                    Discuss Your Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/how-we-work" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center">
                                    See How It Works
                                </Link>
                            </div>
                        </div>

                        {/* Supported Platforms Grid */}
                        <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { name: "Python", icon: FileCode2 },
                                { name: "C++", icon: Terminal },
                                { name: "ChartInk", icon: LineChart },
                                { name: "MetaTrader (MT4/MT5)", icon: Cpu },
                                { name: "AmiBroker", icon: BarChartIcon },
                                { name: "TradingView", icon: ActivityIcon },
                            ].map((platform, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center text-center hover:border-neon-green/30 transition-all group min-h-[140px]">
                                    <platform.icon className="w-8 h-8 text-gray-400 mb-3 group-hover:text-neon-green transition-colors" />
                                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-neon-green transition-colors">{platform.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Development Process (7 Steps) */}
            <section id="process" className="py-24 px-6 bg-gradient-to-b from-black to-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Development <span className="text-neon-green">Process</span></h2>
                        <p className="text-gray-400 text-lg">A transparent, 7-step journey from idea to deployment.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[50%] left-[5%] right-[5%] h-0.5 bg-white/10 -translate-y-1/2 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 relative z-10">
                            {[
                                { num: "01", title: "Strategy Spec", icon: FileText, desc: "Detailed outline of entry/exit logic and risk parameters." },
                                { num: "02", title: "NDA & Invoice", icon: Shield, desc: "Ensuring complete transparency and confidentiality." },
                                { num: "03", title: "Initiation", icon: Zap, desc: "Resource allocation after initial payment." },
                                { num: "04", title: "First Demo", icon: Presentation, desc: "Review functionality and verify alignment with specs." },
                                { num: "05", title: "Enhancement", icon: Settings, desc: "Refining the strategy based on your demo feedback." },
                                { num: "06", title: "Final Payment", icon: CheckSquare, desc: "Processed only after enhancement approval." },
                                { num: "07", title: "Delivery", icon: Rocket, desc: "Official delivery of the deployment package." },
                            ].map((step, idx) => (
                                <div key={step.num} className="flex flex-col items-center text-center relative">
                                    <div className="w-16 h-16 rounded-2xl bg-black border-2 border-white/10 flex items-center justify-center mb-6 relative z-10 hover:border-neon-green hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all group">
                                        <step.icon className="w-6 h-6 text-gray-400 group-hover:text-neon-green transition-colors" />
                                        <span className="absolute -top-3 -right-3 w-7 h-7 bg-neon-green text-black text-xs font-black rounded-full flex items-center justify-center border-2 border-black">
                                            {idx + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-bold text-sm mb-2">{step.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed max-w-[150px]">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className="py-24 px-6 bg-black flex flex-col items-center">
                <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center">

                    {/* Top WhatsApp Button */}
                    <a
                        href="https://wa.me/917449454349"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex mb-8 px-6 py-2.5 bg-[#0047FF] text-white font-bold rounded-full hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(0,71,255,0.4)] transition-all"
                    >
                        Whatsapp +917449454349
                    </a>

                    <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">Pricing Plan</div>

                    <h2 className="text-xl md:text-3xl font-bold text-white mb-6 max-w-3xl leading-snug">
                        If you have a trading strategy and you want our team to automate your trading strategy, talk to us!
                    </h2>

                    <h3 className="text-3xl md:text-5xl font-black text-[#0047FF] mb-4">Approximate Price Band</h3>

                    <p className="text-gray-400 text-sm md:text-base mb-16">
                        Every trading strategy is different, so as estimates, let's connect for exact estimates
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                        {[
                            {
                                name: "SMALL",
                                timeframe: "(Upto 6 weeks)",
                                price: "$750 - $1,100",
                            },
                            {
                                name: "MEDIUM",
                                timeframe: "(6 - 10 weeks)",
                                price: "$1,100 - $1,850",
                            },
                            {
                                name: "LARGE",
                                timeframe: "(Depends On The Size)",
                                price: "GET ESTIMATES",
                            },
                        ].map((plan, idx) => (
                            <div key={idx} className="p-8 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col items-center text-center shadow-xl hover:border-[#0047FF]/50 transition-colors h-full">
                                <h4 className="text-xl font-black text-white mb-1">{plan.name}</h4>
                                <div className="text-gray-400 text-sm mb-6">{plan.timeframe}</div>

                                <div className="text-2xl font-bold text-[#0047FF] mb-8">
                                    {plan.price}
                                </div>

                                <p className="text-gray-500 text-xs italic mb-8 mt-auto px-4">
                                    # Depending upon your strategy rule-set, price may go UP/ DOWN.
                                </p>

                                <Link
                                    href="/contact"
                                    className="w-full py-2.5 text-sm font-bold text-[#0047FF] border border-[#0047FF] rounded hover:bg-[#0047FF]/10 transition-colors"
                                >
                                    Get Details
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Bottom WhatsApp Button */}
                    <a
                        href="https://wa.me/917449454349"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex mt-16 px-6 py-2.5 bg-[#0047FF] text-white font-bold rounded-full hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(0,71,255,0.4)] transition-all"
                    >
                        Whatsapp +917449454349
                    </a>

                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900/40">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Clients <span className="text-neon-green">Trust Us</span></h2>
                        <p className="text-gray-400 text-lg">Hear what algorithmic traders have to say about our custom development.</p>
                    </div>

                    {/* Masonry CSS grid for testimonials */}
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="break-inside-avoid bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-neon-green/30 transition-colors">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-neon-green/20 text-neon-green flex items-center justify-center font-bold text-sm shrink-0">
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">{t.name}</div>
                                        <div className="flex text-yellow-500 mt-1">
                                            {[...Array(5)].map((_, index) => (
                                                <Star key={index} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed italic">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6 bg-gradient-to-t from-gray-900/40 to-black">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked <span className="text-neon-green">Questions</span></h2>
                        <p className="text-gray-400 text-lg">Everything you need to know about our custom development services.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "What is Custom EA or Algo Development?",
                                a: "Custom EA (Expert Advisor) or Algorithmic development is the process of translating your manual trading rules and strategies into computer code. This allows trading platforms like MetaTrader, AmiBroker, or custom Python setups to execute trades automatically based on your specific conditions without any manual intervention."
                            },
                            {
                                q: "Do you provide strategy assistance?",
                                a: "Yes, our team of experienced quantitative developers can help refine your logical conditions. While we don't provide the core 'secret recipe' or financial advice, we can optimize your defined parameters, suggest risk management enhancements, and ensure the logic is mathematically sound for automation."
                            },
                            {
                                q: "What is the difference between Robotic and Algo trading?",
                                a: "While often used interchangeably, Robotic Trading usually refers to 'out-of-the-box' pre-built bots (like EAs you buy online) that run with fixed parameters. Algo Trading is a broader term encompassing custom-built algorithms, often utilizing advanced technologies like Python, machine learning, and direct API integrations for specific institutional or highly customized retail strategies."
                            },
                            {
                                q: "Do you provide post-development support?",
                                a: "Absolutely. Depending on the plan you choose, we provide 30 to 60+ days of post-deployment support. This covers bug fixes, minor parameter adjustments, and ensuring your algorithm runs smoothly on your VPS or local machine."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors group">
                                <h4 className="text-lg font-bold text-white mb-3 flex items-start gap-4">
                                    <HelpCircle className="w-6 h-6 text-neon-green flex-shrink-0 mt-0.5" />
                                    {faq.q}
                                </h4>
                                <p className="text-gray-400 leading-relaxed pl-10">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Details (SEO Content) */}
            <section className="py-24 px-6 bg-black border-t border-white/5">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Products Details</h2>
                        <h3 className="text-xl font-bold text-neon-green">Custom Algo Development for Trading: Tailored Strategies with Algotradingbot</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Custom algo trading could be the secret to keeping ahead of your competitors in the fast-paced trading field. At Algotradingbot, we specialize in custom algorithm development specifically designed to satisfy the specific needs of your trading. Whether you're seeking an advanced Algo Trading Strategy or an automated and fully automated strategy, our expert team of designers can design strategies that meet the goals you have set and will maximize the potential of your trading.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Why Choose Algotradingbot for Custom Algo Development?</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Algotradingbot is an industry pioneer in custom Algo Development, offering services that aren't just technically advanced but also strategically well-thought-out. We recognize that each trader's needs are unique, so our strategy focuses on creating custom solutions that yield outcomes. By focusing on the latest technology and efficiency, Algotradingbot guarantees that trading strategy is executed flawlessly.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">How Algotradingbot Can Help You with Custom Algo Development?</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Our experience developing custom algorithms enables us to provide an extensive range of products for new and skilled traders. Let us show you how Algotradingbot will enhance the quality of your trading experience.
                        </p>
                        <ul className="list-disc pl-5 space-y-3 text-gray-300 mt-4">
                            <li><strong className="text-white">Custom Algo Trading Strategy:</strong> At Algotradingbot, we create algorithms explicitly designed for your preferred trading style. Suppose you're interested in scalping, trend-following, or another method. In that case, we will collaborate with you to develop a Custom algorithm development Strategy that is compatible with your needs and can adapt to changing market conditions.</li>
                            <li><strong className="text-white">Algorithmic Trading</strong> allows you to streamline your strategy, reducing the need for manual interventions. These robots are created to perform trades accurately and quickly, ensuring you maximize every market opportunity.</li>
                            <li><strong className="text-white">Professional Trading Software Development:</strong> Algotradingbot's experienced Trade Software Developers are committed to creating reliable, durable software that enhances trading abilities. We offer complete development solutions incorporating tests, optimization, and continuous service from the initial idea to the final implementation.</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Why Algotradingbot's Custom Algo Development Stands Out?</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Regarding Custom Algo Development, Algotradingbot stands out for its dedication to excellence and the latest technology. What sets us apart:
                        </p>
                        <ul className="list-disc pl-5 space-y-3 text-gray-300 mt-4">
                            <li><strong className="text-white">Experts in the field:</strong> The team comprises skilled Algo developers who are trading with years of knowledge and extensive knowledge of markets for each project.</li>
                            <li><strong className="text-white">Innovative Solutions:</strong> We use the latest technology to design efficient algorithms that adapt to changing market trends.</li>
                            <li><strong className="text-white">Comprehensive Strategy Development:</strong> The company doesn't simply create algorithms. We help refine and improve your Strategy for Trading Strategy Development to ensure your algorithm aligns with your trading goals.</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Our Commitment to Customer Satisfaction.</h3>
                        <p className="text-gray-300 leading-relaxed">
                            We at Algotradingbot place the success of our customers before all else. The Algotradingbot Custom Algo Development solutions are created to be highly responsive, flexible and adapted to meet your specific needs. We’re dedicated to providing solutions that surpass your expectations and regular support to ensure your algorithms operate optimally. We make your satisfaction our primary goal, striving relentlessly to attain this.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Temporary Icon Components for missing ones
function BarChartIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
        </svg>
    )
}

function ActivityIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
