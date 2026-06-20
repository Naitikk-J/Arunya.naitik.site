import React from 'react';
import { motion } from 'framer-motion';

export const TVIntro: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
            {/* Neon Purple Perspective Grid */}
            <div className="absolute inset-0 pointer-events-none bg-black/0 select-none z-0">
                <div className="absolute inset-0 bg-black/0 [perspective:500px] [perspective-origin:50%_50%]">
                    <motion.div
                        animate={{
                            backgroundPosition: ['0px 0px', '0px 0px']
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute inset-[-100%] h-[300%] w-[300%] origin-center"
                        style={{
                            backgroundImage: `
                linear-gradient(to right, rgba(184, 23, 253, 0.6) 1.5px, transparent 1.5px),
                linear-gradient(to bottom, rgba(184, 23, 253, 0.6) 1.5px, transparent 1.5px)
              `,
                            backgroundSize: '60px 60px',
                            transform: 'rotateX(75deg)',
                            filter: 'drop-shadow(0 0 0px rgba(184, 23, 253, 0.8))',
                            maskImage: 'radial-gradient(circle at 50% 50%, black 10%, transparent 90%)'
                        }}
                    />
                </div>
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center px-4 flex flex-col items-center relative z-10"
            >

                <img
                    src="/aarunya-logo.svg"
                    alt="Aarunya Logo"
                    width="600"
                    height="240"
                    className="w-[80%] sm:w-[90%] md:w-[600px] h-auto mb-2 sm:mb-4 object-contain"
                />
                <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-kidcore-blue text-[9px] xs:text-[10px] sm:text-sm md:text-2xl font-pixel drop-shadow-[2px_2px_0px_#000] px-2"
                    style={{
                        fontFamily: '"Press Start 2P", monospace',
                        fontSize: 'clamp(8px, 2.5vw, 12px)',
                        color: '#00ffff',
                    }}
                >
                    SCROLL TO ENTER THE MITS CARNIVAL...
                </motion.div>
            </motion.div>


            {/* Decorative scanlines or something inside the TV */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
    );
};
