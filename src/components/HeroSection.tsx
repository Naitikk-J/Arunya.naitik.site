import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TVFrame from "./TVFrame";
import InsertCoin from "./InsertCoin";
import PixelButton from "./PixelButton";
import { PixelStar, PixelHeart, PixelMusicNote, PixelGhost, PixelController } from "./PixelDecorations";

const AarunyaLogo = "/aarunya-logo.svg";
const retroRoomBg = "/retro-room-bg.avif";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const tvRef = useRef<HTMLDivElement>(null);
    const roomRef = useRef<HTMLDivElement>(null);
    const screenContentRef = useRef<HTMLDivElement>(null);
    const innerScreenRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !tvRef.current || !roomRef.current || !screenContentRef.current || !innerScreenRef.current) return;

        const ctx = gsap.context(() => {
            // Initial entrance flow for inner screen elements
            gsap.from(innerScreenRef.current?.querySelectorAll('img, div'), {
                y: 20,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.5
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%",
                    scrub: true,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    fastScrollEnd: true,
                    preventOverlaps: true,
                    invalidateOnRefresh: true,
                },
            });

            // Clean, direct zoom into TV screen starting immediately
            tl.to(tvRef.current, {
                scale: 6,
                z: 500,
                duration: 1,
                ease: "power1.in",
            })
                .to(innerScreenRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                }, 0)
                .to(roomRef.current, {
                    opacity: 0,
                    scale: 1.2,
                    duration: 0.5,
                }, 0.1);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
            style={{ perspective: '1000px' }}
        >
            {/* Background room with generated image */}
            <div
                ref={roomRef}
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${retroRoomBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    imageRendering: 'pixelated',
                }}
            >
                {/* Pixel art floating decorations */}
                <PixelStar className="absolute top-24 left-12 w-10 h-10 animate-float" color="primary" />
                <PixelHeart className="absolute top-36 right-24 w-8 h-8 animate-float" color="secondary" />
                <PixelMusicNote className="absolute bottom-44 left-24 w-8 h-10 animate-float" color="secondary" />
                <PixelGhost className="absolute bottom-36 right-20 w-10 h-12 animate-float" color="accent" />
                <PixelController className="absolute top-1/3 left-8 w-16 h-10 animate-float hidden lg:block" />
                <PixelStar className="absolute top-1/2 right-8 w-6 h-6 animate-float" color="accent" />
            </div>

            {/* CRT TV Container */}
            <div ref={tvRef} className="relative z-10 w-[90vw] max-w-2xl overflow-visible" style={{ transformOrigin: 'center' }}>
                <TVFrame>
                    {/* Initial Insert Coin screen */}
                    <div
                        ref={screenContentRef}
                        className="w-full h-full relative"
                        style={{
                            backgroundImage: 'url(/Loadingscreen.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: 'hsl(var(--crt-black))',
                        }}
                    >
                        {/* Wrapper for content that SHOULD fade */}
                        <div
                            ref={innerScreenRef}
                            className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden"
                        >
                            {/* Floating collage elements to match reference image */}
                            <div className="absolute top-4 left-4 w-12 h-12 bg-radical-red/20 border border-radical-red rounded flex items-center justify-center font-pixel text-[10px] text-radical-red animate-float">GG</div>
                            <div className="absolute bottom-10 right-10 w-16 h-8 bg-lime-green/20 border border-lime-green rounded flex items-center justify-center font-pixel text-[8px] text-lime-green animate-float" style={{ animationDelay: '0.5s' }}>FESTIVAL</div>
                            <div className="absolute top-1/2 -left-4 w-12 h-12 bg-cyber-blue/20 border border-cyber-blue rounded-full flex items-center justify-center font-pixel text-[10px] text-cyber-blue animate-float" style={{ animationDelay: '1s' }}>PEACE</div>
                            <div className="absolute top-10 right-4 w-10 h-10 bg-electric-yellow/20 border border-electric-yellow transform rotate-12 flex items-center justify-center font-pixel text-[10px] text-electric-yellow animate-float" style={{ animationDelay: '1.5s' }}>2026</div>

                            <img
                                src={AarunyaLogo}
                                alt="Aarunya 2026"
                                className="w-48 md:w-64 mb-8 animate-pulse-glow transition-opacity duration-500 relative z-10"
                                style={{
                                    filter: "drop-shadow(0 0 20px hsl(var(--primary)))",
                                    imageRendering: 'pixelated',
                                } as React.CSSProperties}
                            />
                            <div className="transition-opacity duration-500 relative z-10">
                                <InsertCoin />
                            </div>
                        </div>
                    </div>
                </TVFrame>
            </div>

            {/* Scroll indicator - Mouse style */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20">
                <span className="font-pixel text-[8px] text-gray-400 tracking-[0.2em] mb-1">SCROLL</span>
                <div className="w-5 h-8 border-2 border-primary rounded-full relative p-1 flex justify-center">
                    <div className="w-0.5 h-2 bg-primary rounded-full animate-scroll-mouse" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
