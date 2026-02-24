"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, ChevronDown, Send } from "lucide-react";
import Logo from "./Logo";

interface DropdownItem {
  name: string;
  href: string;
  desc?: string;
  gray?: boolean;
}

interface NavLink {
  name: string;
  href: string;
  dropdown?: DropdownItem[];
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks: NavLink[] = [
    { name: "Home", href: "/" },
    {
      name: "Services",
      href: "/services",
      dropdown: [
        { name: "Broking Houses & Fintech", href: "/services/broking-houses", desc: "White-labeled infrastructure" },
        { name: "Hedge Funds & Asset Managers", href: "/services/hedge-funds", desc: "Portfolio strategy automation" },
        { name: "Prop & Quant Desks", href: "/services/prop-desks", desc: "Secure institutional infra" },
        { name: "RIAs & RAs", href: "/services/rias", desc: "Compliance-ready deployment" },
        { name: "Quant Developers", href: "/services/quant-devs", desc: "API & developer tools" },
        { name: "Retail Traders", href: "/services/retail-traders", desc: "No-code & AI builders" },
      ],
    },
    {
      name: "EA & Bots",
      href: "#",
      dropdown: [
        { name: "Custom EA Development", href: "/custom-ea", desc: "Bespoke EA built to your strategy" },
        { name: "Pre-Built BOTs & Indicators", href: "/pre-bot-indicators", desc: "Ready-to-deploy trading bots" },
        { name: "Already Developed EA", href: "/already-develop-ea", desc: "Tested EAs ready for download", gray: true },
        { name: "Self-Develop EA", href: "/self-develop-ea", desc: "Build your own with our tools" },
      ],
    },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 9999,
    isolation: "isolate",
    willChange: "backdrop-filter",
    transition: "all 0.3s ease",
    backgroundColor: scrolled ? "rgba(10, 15, 25, 0.55)" : "transparent",
    backdropFilter: scrolled ? "blur(16px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
    borderBottom: scrolled
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid transparent",
    boxShadow: scrolled ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "none",
  };

  return (
    <header style={headerStyle}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" className="group relative" style={{ zIndex: 50 }}>
          <Logo
            className="flex items-center gap-2"
            textClassName="text-xl sm:text-2xl transition-colors group-hover:text-gray-200"
            iconClassName="w-8 h-8 sm:w-10 sm:h-10"
          />
          <div className="absolute -inset-4 bg-neon-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.dropdown && handleDropdownEnter(link.name)}
              onMouseLeave={() => link.dropdown && handleDropdownLeave()}
            >
              {link.dropdown ? (
                <button
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group py-2 flex items-center gap-1"
                >
                  {link.name}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === link.name ? "rotate-180" : ""}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-neon-green transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#39ff14]" />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-neon-green transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#39ff14]" />
                </Link>
              )}

              {/* Dropdown Menu */}
              {link.dropdown && openDropdown === link.name && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 min-w-[280px]">
                  <div className="bg-[#0d1117] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-xl">
                    {/* Dropdown header */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <Link
                        href={link.href !== "#" ? link.href : link.dropdown[0].href}
                        className="text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-neon-green transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        View All {link.name} →
                      </Link>
                    </div>
                    {/* Dropdown items */}
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className={`block px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.03] last:border-0 group/item ${item.gray ? "opacity-50 hover:opacity-100" : ""}`}
                      >
                        <div className="text-sm font-medium text-white group-hover/item:text-neon-green transition-colors">
                          {item.name}
                        </div>
                        {item.desc && (
                          <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Side Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="https://t.me/AlgoTradingBotSupport"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#229ED9] transition-colors"
            aria-label="Telegram"
          >
            <Send className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="group px-6 py-2 text-sm font-bold text-white bg-neon-green rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(57,255,20,0.6)] transition-all duration-300 flex items-center gap-2"
          >
            Get Started
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          style={{ zIndex: 50 }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        style={{ zIndex: 40 }}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#0a0f19] border-l border-white/10 transform transition-transform duration-300 ease-out lg:hidden flex flex-col pt-24 px-6 shadow-2xl overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ zIndex: 50 }}
      >
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.dropdown ? (
                <>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === link.name ? null : link.name)}
                    className="w-full flex items-center justify-between text-lg font-medium text-gray-300 hover:text-neon-green transition-colors py-3 border-b border-white/5"
                  >
                    {link.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === link.name ? "rotate-180" : ""}`} />
                  </button>
                  {mobileExpanded === link.name && (
                    <div className="pl-4 py-2 space-y-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => { setIsOpen(false); setMobileExpanded(null); }}
                          className={`block py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors ${item.gray ? "opacity-50" : ""}`}
                        >
                          <div className="text-sm font-medium text-white">{item.name}</div>
                          {item.desc && <div className="text-xs text-gray-500">{item.desc}</div>}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-gray-300 hover:text-neon-green transition-colors py-3 border-b border-white/5 block"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 text-center text-white border border-white/20 rounded-xl hover:bg-white/5 transition-colors font-semibold"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 text-center text-black bg-neon-green rounded-xl font-bold shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)] transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </header>
  );
}
