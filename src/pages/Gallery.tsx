import { Suspense, useState, useEffect } from 'react';
import DomeGallery from '@/components/DomeGallery';
import { MainNavigation } from '@/components/ui/MainNavigation';
import { CRTOverlay } from '@/components/CRTOverlay';
import { useResponsive } from '@/hooks/use-responsive';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { GlitchText } from '@/components/GlitchText';


const Gallery = () => {
    const { isMobile, isTablet, isDesktop } = useResponsive();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Brief delay to let the browser paint the LoadingScreen
        // before the heavy DomeGallery component renders.
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    if (!isReady) {
        return <LoadingScreen isGalleryLoading={true} />;
    }

    return (
        <div className="relative w-full min-h-screen overflow-x-hidden" style={{
            background: 'linear-gradient(to-bottom, #0d0520, #1a0a2e)',
            imageRendering: 'pixelated'
        }}>
            <MainNavigation />

            {/* Scanline effect background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
                backgroundSize: '4px 4px'
            }} />

            {/* Top neon border - Fixed */}
            <div className="fixed top-24 left-0 right-0 h-1 flex z-40 pointer-events-none" style={{
                background: 'repeating-linear-gradient(90deg, #ff00ff, #ff00ff 8px, #00ffff 8px, #00ffff 16px)',
                boxShadow: '0 0 20px #ff00ff, 0 0 40px #00ffff'
            }} />

            {/* Bottom neon border - Fixed */}
            <div className="fixed bottom-0 left-0 right-0 h-1 flex z-40 pointer-events-none">
                {[...Array(60)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 h-full"
                        style={{
                            background: i % 2 === 0
                                ? 'linear-gradient(to-bottom, #ff00ff, #bc13fe)'
                                : 'linear-gradient(to-bottom, #00ffff, #0088ff)',
                            boxShadow: i % 2 === 0
                                ? '0 0 8px #ff00ff'
                                : '0 0 8px #00ffff'
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full min-h-screen pt-28 flex flex-col">

                {/* Title Container - Now Relative */}
                <div className="relative w-full flex justify-center items-center py-10 shrink-0">
                    <div className="relative">
                        {/* Glow effect background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ff] via-[#8338ec] to-[#00ffff] opacity-40 blur-2xl" />

                        {/* Title text with neon theme */}
                        <h1 style={{
                            fontFamily: '"Press Start 2P", "Courier New", monospace',
                            fontSize: isMobile ? '20px' : isTablet ? '28px' : '48px',
                            color: '#ffffff',
                            textShadow: '0 0 10px #ff00ff, 0 0 20px #00ffff, 2px 2px 0 #440044',
                            letterSpacing: '2px',
                            position: 'relative',
                            zIndex: 10,
                        }}>
                            MEMORIES
                        </h1>

                        {/* Accent lines */}
                        <div className={`absolute -bottom-4 left-0 right-0 flex justify-center gap-1 ${isMobile ? 'gap-0.5' : 'gap-1 sm:gap-2'}`}>
                            <div className={`bg-[#ff00ff] ${isMobile ? 'w-6 h-0.5' : isTablet ? 'w-8 h-0.5' : 'w-8 sm:w-16 h-0.5 sm:h-1'}`} style={{ boxShadow: '0 0 10px #ff00ff' }} />
                            <div className={`bg-[#00ffff] ${isMobile ? 'w-6 h-0.5' : isTablet ? 'w-8 h-0.5' : 'w-8 sm:w-16 h-0.5 sm:h-1'}`} style={{ boxShadow: '0 0 10px #00ffff' }} />
                            <div className={`bg-[#ff00ff] ${isMobile ? 'w-6 h-0.5' : isTablet ? 'w-8 h-0.5' : 'w-8 sm:w-16 h-0.5 sm:h-1'}`} style={{ boxShadow: '0 0 10px #ff00ff' }} />
                        </div>
                    </div>
                </div>

                {/* 3D Dome Gallery - Relative Container */}
                <div className="relative w-full h-[70vh] md:h-[80vh] shrink-0">
                    <Suspense fallback={<LoadingScreen isGalleryLoading={true} />}>
                        <DomeGallery
                            fit={1}
                            minRadius={isMobile ? 300 : isTablet ? 500 : 800}
                            maxVerticalRotationDeg={10}
                            segments={isMobile ? 18 : isTablet ? 22 : 25}
                            dragDampening={2}
                            grayscale={false}
                            imageBorderRadius="20px"
                            openedImageBorderRadius="20px"
                            openedImageWidth={isMobile ? '180px' : '250px'}
                            openedImageHeight={isMobile ? '280px' : '350px'}
                            autoRotationSpeed={0.1}
                        />
                    </Suspense>
                </div>

                {/* Extra space at bottom for scrolling feel */}
                <div className="h-16 w-full" />

            </div>

            {/* CRT Effect Overlay */}
            <div className="fixed inset-0 pointer-events-none z-20">
                <CRTOverlay />
            </div>

            {/* Scroll hint with neon styling - Kept fixed but adjusted text */}
            <div className={`fixed ${isMobile ? 'bottom-8' : isTablet ? 'bottom-10' : 'bottom-12 sm:bottom-16'} left-1/2 transform -translate-x-1/2 z-30 pointer-events-none`}>
                <div className="text-center">
                    <p style={{
                        fontFamily: '"Press Start 2P", "Courier New", monospace',
                        fontSize: isMobile ? '6px' : isTablet ? '7px' : '8px',
                        color: '#ff00ff',
                        textShadow: '0 0 10px #ff00ff',
                        marginBottom: '0.5rem',
                        letterSpacing: '1px'
                    }}>
                        DRAG TO ROTATE
                    </p>
                    <div className={`flex justify-center gap-1 ${isMobile ? 'gap-0.5' : ''}`}>
                        <div className={`bg-[#00ffff] ${isMobile ? 'w-0.5 h-2' : isTablet ? 'w-1 h-3' : 'w-1 h-3 sm:h-4'}`} style={{
                            animation: 'bounce 1s ease-in-out infinite',
                            boxShadow: '0 0 8px #00ffff'
                        }} />
                        <div className={`bg-[#ff00ff] ${isMobile ? 'w-0.5 h-2' : isTablet ? 'w-1 h-3' : 'w-1 h-3 sm:h-4'}`} style={{
                            animation: 'bounce 1s ease-in-out infinite',
                            animationDelay: '0.1s',
                            boxShadow: '0 0 8px #ff00ff'
                        }} />
                        <div className={`bg-[#00ffff] ${isMobile ? 'w-0.5 h-2' : isTablet ? 'w-1 h-3' : 'w-1 h-3 sm:h-4'}`} style={{
                            animation: 'bounce 1s ease-in-out infinite',
                            animationDelay: '0.2s',
                            boxShadow: '0 0 8px #00ffff'
                        }} />
                    </div>
                </div>
            </div>

            {/* Pulse animation style */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
};

export default Gallery;
