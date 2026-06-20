import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PixelStar, PixelHeart } from "./PixelDecorations";
import { useResponsive } from "../hooks/use-responsive";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const footerRef = useRef<HTMLElement>(null);
    const { isMobile } = useResponsive();

    useEffect(() => {
        if (!footerRef.current) return;

        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray(".footer-item");

            gsap.from(items, {
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 95%",
                    toggleActions: "play none none none",
                },
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
            });
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const navLinks = [
        { name: 'GALLERY', path: '/gallery' },
        { name: 'MAP', path: '/view-map' },
        { name: 'EVENTS', path: '/events' },
        { name: 'SCHEDULE', path: '/schedule' },
        { name: 'SPONSORS', path: '/sponsors' },
        { name: 'MEET THE TEAM', path: '/about' },
        { name: 'CONTACT', path: '/contact' },
        //   { name: 'REGISTER', path: '/register' },
    ];

    const legalLinks = [
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms & Conditions', path: '/terms-and-conditions' },
        { name: 'Return & Refund', path: '/return-and-refund' },
        { name: 'Contact Us', path: '/contact' },
    ];

    return (
        <footer
            ref={footerRef}
            id="contact"
            className="relative overflow-hidden pt-12 pb-6"
            style={{
                background: 'linear-gradient(180deg, #1a0a2e 0%, #0D001A 100%)',
                borderTop: '1px solid #ff00ff'
            }}
        >
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[80px] animate-pulse" />
                <div className="absolute top-[40%] -right-[10%] w-[30%] h-[50%] rounded-full bg-cyan-500/10 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
                    {/* BRANDING */}
                    <div className="md:col-span-4 footer-item flex flex-col items-center md:items-start text-center md:text-left">
                        <Link to="/" className="group relative block mb-4 transform hover:scale-105 transition-transform duration-300">
                            <img
                                src="/aarunya-logo.svg"
                                alt="Aarunya 2026"
                                width="140"
                                height="56"
                                className="h-14 w-auto filter drop-shadow-[0_0_12px_rgba(255,0,255,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(255,0,255,0.8)] transition-all"
                            />
                        </Link>
                        <p className="font-press-start text-xs text-[#ff00ff] tracking-wider mb-2 drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">
                            MITS GWALIOR
                        </p>
                        <p className="font-pixel text-xs text-[#00ffff] opacity-90 tracking-wide">
                            SYSTEM ACTIVE • V.2.0.26
                        </p>

                        {/* Social Icons - Bigger & Dynamic */}
                        <div className="flex gap-4 mt-6">
                            {["📷", "🐦", "📘", "📺"].map((icon, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/20 rounded-lg hover:border-[#ff00ff] hover:bg-[#ff00ff]/20 cursor-pointer transition-all duration-300 text-lg hover:scale-110 hover:shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:-translate-y-1 group"
                                >
                                    <span className="group-hover:animate-pulse">{icon}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* NAVIGATION */}
                    <div className="md:col-span-5 footer-item">
                        <h3 className="font-press-start text-sm text-[#00ffff] mb-6 text-center md:text-left border-b-2 border-[#00ffff]/30 pb-3 inline-block md:block shadow-[0_2px_10px_rgba(0,255,255,0.1)]">
                            NAVIGATION
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-xs sm:text-sm font-pixel text-gray-300 hover:text-[#ff00ff] hover:translate-x-2 transition-all duration-200 uppercase tracking-wide flex items-center gap-2 group"
                                >
                                    <span className="text-[#00ffff]/70 text-[10px] group-hover:text-[#00ffff] transition-colors">›</span>
                                    <span className="group-hover:drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">{link.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* LEGAL / INFO */}
                    <div className="md:col-span-3 footer-item">
                        <h3 className="font-press-start text-sm text-[#00ffff] mb-6 text-center md:text-left border-b-2 border-[#00ffff]/30 pb-3 inline-block md:block shadow-[0_2px_10px_rgba(0,255,255,0.1)]">
                            POLICIES
                        </h3>
                        <div className="flex flex-col gap-3 items-center md:items-start h-full">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-xs sm:text-sm font-pixel text-gray-300 hover:text-[#ff00ff] hover:pl-2 transition-all duration-200 uppercase tracking-wide w-full border-b border-white/5 pb-2 md:pb-0 md:border-none flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#ff00ff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_5px_#ff00ff]" />
                                    <span className="group-hover:drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">{link.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs font-pixel text-white/50 footer-item hover:text-white/70 transition-colors duration-300">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <div className="w-2.5 h-2.5 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_8px_#39FF14]" />
                        <span className="tracking-widest">ALL SYSTEMS NORMAL</span>
                    </div>

                    <a
                        href="https://drive.google.com/file/d/1RBtRpLFejimU-d12_WxE884_XKZ4tcKm/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer hover:text-[#ff00ff] transition-all duration-300 flex items-center gap-2 bg-[#ff00ff]/10 px-4 py-2 rounded border border-[#ff00ff]/20 hover:border-[#ff00ff] hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] group no-underline"
                    >
                        <span className="text-sm group-hover:scale-110 transition-transform">📖</span>
                        <span className="font-bold tracking-widest group-hover:tracking-[0.2em] transition-all">RULEBOOK</span>
                    </a>

                    <div className="text-center md:text-right tracking-wider">
                        © 2026 AARUNYA FESTIVAL. ALL RIGHTS RESERVED.
                    </div>

                    <div
                        className="cursor-pointer hover:text-[#00ffff] transition-all duration-300 flex items-center gap-2 bg-[#00ffff]/10 px-4 py-2 rounded border border-[#00ffff]/20 hover:border-[#00ffff] hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] group"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <span className="font-bold tracking-widest group-hover:tracking-[0.2em] transition-all">TOP</span>
                        <span className="text-sm group-hover:-translate-y-1 transition-transform">▲</span>
                    </div>
                </div>
            </div>

            {/* Decorations */}
            <PixelStar className="absolute top-10 left-4 w-6 h-6 text-[#00ffff]/40 animate-pulse" />
            <PixelHeart className="absolute bottom-20 right-8 w-6 h-6 text-[#ff00ff]/40 animate-pulse" />
            <div className="absolute bottom-10 left-10 w-2 h-2 bg-[#ff00ff] rounded-none animate-ping" />
            <div className="absolute top-20 right-20 w-1 h-1 bg-[#00ffff] rounded-none animate-ping delay-700" />
        </footer>
    );
};

export default Footer;
