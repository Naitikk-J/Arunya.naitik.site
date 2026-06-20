import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RetroButton } from './ui/retro-button';
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../hooks/use-responsive";

export const WelcomeSection: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    const { isMobile, isTablet, isDesktop } = useResponsive();

    // Enhanced animations for pop out effect
    const popOutVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: [0.8, 1.1, 1],
            opacity: [0, 1, 1],
            transition: {
                duration: 1,
                ease: "easeOut",
                times: [0, 0.5, 1]
            }
        }
    };

    // Zoom effect for the WelcomeSection content - stops zooming after initial scroll
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.3, 1], [0.2, 1, 1, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.8, 0.9, 1], [0, 0.2, 1, 1, 0.2, 0]);

    return (
        <section ref={containerRef} className={`relative min-h-screen w-full flex flex-col items-center justify-start ${isMobile ? 'pt-24' : 'pt-32 md:pt-40'} ${isMobile ? 'pb-16' : 'pb-24'} overflow-hidden ${isMobile ? '-mt-[25vh]' : isTablet ? '-mt-[40vh]' : '-mt-[50vh] md:-mt-[60vh]'} bg-transparent z-0`}>

            {/* Gritty Texture Overlay */}


            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">

                {/* Floating Stickers */}
                <motion.div
                    animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className={`hidden md:absolute ${isMobile ? 'top-28 left-[5%] w-16 h-16' : isTablet ? 'top-16 left-[5%] w-28 h-28' : 'top-20 left-[5%] w-32 h-32'} bg-kidcore-yellow border-4 border-black flex items-center justify-center rotate-[-10deg] z-0 shadow-[4px_4px_0px_#000] md:shadow-[8px_8px_0px_#000]`}
                >
                    <span className={`text-black font-press-start ${isMobile ? 'text-[7px]' : isTablet ? 'text-[9px]' : 'text-[10px]'} text-center`}>
                        AARUNYA<br />2026
                    </span>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 300, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className={`hidden md:absolute ${isMobile ? 'top-[25%] right-[2%] w-20 h-20' : isTablet ? 'top-[20%] right-[6%] w-36 h-36' : 'top-[20%] right-[8%] w-40 h-40'} bg-kidcore-pink border-4 border-black flex items-center justify-center rotate-[15deg] rounded-full z-0 shadow-[5px_5px_0px_#000] md:shadow-[10px_10px_0px_#000]`}
                >
                    <span className={`text-white font-press-start ${isMobile ? 'text-[7px]' : isTablet ? 'text-[9px]' : 'text-xs'} text-center px-2 leading-loose`}>
                        RETRO<br />VIBES<br />
                    </span>
                </motion.div>

                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className={`hidden md:absolute ${isMobile ? 'bottom-[10%] left-[2%] w-12 h-12' : isTablet ? 'bottom-[15%] left-[8%] w-20 h-20' : 'bottom-[15%] left-[10%] w-24 h-24'} bg-kidcore-green border-4 border-black flex items-center justify-center rotate-[-5deg] z-0 shadow-[4px_4px_0px_#000] md:shadow-[6px_6px_0px_#000]`}
                >
                    <span className={`text-black font-press-start ${isMobile ? 'text-[8px]' : isTablet ? 'text-[12px]' : 'text-sm'}`}>MITS</span>
                </motion.div>

                {/* Glow blobs */}
                <div className={`absolute ${isMobile ? '-bottom-10 -right-10 w-40 h-40' : isTablet ? '-bottom-16 -right-16 w-60 h-60' : '-bottom-20 -right-20 w-80 h-80'} bg-kidcore-blue/20 rounded-full blur-3xl`} />
                <div className={`absolute ${isMobile ? '-top-10 -left-10 w-40 h-40' : isTablet ? '-top-16 -left-16 w-60 h-60' : '-top-20 -left-20 w-80 h-80'} bg-kidcore-yellow/20 rounded-full blur-3xl`} />
            </div>

            {/* Content */}
            <motion.div
                style={{ scale, opacity }}
                className="relative z-10 container mx-auto px-4 flex flex-col items-center"
            >

                {/* Heading */}
                <motion.div
                    variants={popOutVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="text-center mb-8 md:mb-12"
                >
                    <h2 className={`${isMobile ? 'text-[4vw]' : isTablet ? 'text-[3vw]' : 'text-[3vw]'} md:text-[2vw] font-press-start text-kidcore-blue mb-4 md:mb-6 drop-shadow-[2px_2px_0px_#000] md:drop-shadow-[4px_4px_0px_#000]`}>
                        WELCOME TO
                    </h2>

                    <h1 className={`${isMobile ? 'text-[12vw]' : isTablet ? 'text-[10vw]' : 'text-[10vw]'} md:text-[8vw] lg:text-[10vw] font-press-start text-white leading-none tracking-tighter`}>
                        <span
                            className="block text-kidcore-pink drop-shadow-[0.4vw_0.4vw_0px_#000] md:drop-shadow-[0.8vw_0.8vw_0px_#000] glitch"
                            data-text="AARUNYA"
                        >
                            AARUNYA
                        </span>
                        <span className="block text-kidcore-green drop-shadow-[0.4vw_0.4vw_0px_#000] md:drop-shadow-[0.8vw_0.8vw_0px_#000] -mt-1 md:-mt-6">
                            2.0
                        </span>
                    </h1>
                </motion.div>

                {/* Description */}
                <motion.div
                    variants={popOutVariants}
                    initial="initial"
                    whileInView="animate"
                    transition={{ delay: 0.3 }}
                    className="max-w-4xl w-full bg-black/10 border-2 md:border-4 border-kidcore-blue p-6 md:p-12 relative shadow-[5px_5px_0px_theme(colors.kidcore.blue)] md:shadow-[10px_10px_0px_theme(colors.kidcore.blue)] mb-8 md:mb-12 rounded-xl md:rounded-none"
                >
                    <div className="absolute -top-1 -left-1 w-4 h-4 md:w-6 md:h-6 border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-kidcore-yellow" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-6 md:h-6 border-b-2 md:border-b-4 border-r-2 md:border-r-4 border-kidcore-yellow" />

                    <p className={`${isMobile ? 'text-base' : isTablet ? 'text-xl' : 'text-2xl'} md:text-xl font-vt323 text-white text-center leading-relaxed `}>
                        Aarunya 2026 is the annual cultural and technical fest of Madhav Institute of Technology & Science (Deemed University), Gwalior:  a celebration where creativity, culture, and technology collide. Blending high-energy performances, competitive events, innovation showcases, and immersive experiences, Aarunya brings together students from diverse backgrounds to celebrate talent, teamwork, and youth spirit. From thought-provoking discussions to electrifying stages and cutting-edge tech events, Aarunya isn't just a fest : it's a shared experience built by the students, for the students.
                    </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    variants={popOutVariants}
                    initial="initial"
                    whileInView="animate"
                    transition={{ delay: 0.5 }}
                    className={`flex flex-wrap justify-center gap-4 sm:gap-8 pointer-events-auto ${isMobile ? 'mt-4' : 'mt-8 md:mt-12'}`}
                >
                    

                    <RetroButton
                        variant="white"
                        className={`${isMobile ? 'scale-90 px-0 py-0' : isTablet ? 'scale-110' : 'scale-110'} sm:scale-125 md:scale-150 ${isMobile ? 'mx-0' : 'mx-0 sm:mx-0'} hover:scale-105 active:scale-95 transition-transform duration-200`}
                        onClick={() => navigate("/about")}
                    >
                        INFO
                    </RetroButton>
                </motion.div>
            </motion.div>

            {/* VHS Overlay - Removed external GIF that may cause issues */}
        </section>
    );
};
