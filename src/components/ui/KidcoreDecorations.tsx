import React from 'react';

export const KidcoreDecorations = () => {
    return (
        <>
            {/* Floating sticker decorations */}
            <div
                className="fixed top-32 right-10 z-10 floating-sticker animate-float"
                style={{
                    animationDelay: '0s',
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                }}
            >
               
            </div>

            <div
                className="fixed top-1/3 left-4 z-10 floating-sticker animate-float"
                style={{
                    animationDelay: '1s',
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                }}
            >
            
            </div>

            <div
                className="fixed bottom-40 right-12 z-10 floating-sticker animate-float"
                style={{
                    animationDelay: '2s',
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                }}
            >
               
            </div>

            <div
                className="fixed top-1/4 left-1/4 z-10 floating-sticker"
                style={{
                    animationDelay: '0.5s',
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                }}
            >
          
            </div>

            <div
                className="fixed bottom-1/3 left-1/2 z-10 floating-sticker animate-float"
                style={{
                    animationDelay: '1.5s',
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                }}
            >
              
            </div>

            {/* Decorative corner elements */}
            <div className="fixed top-0 left-0 z-5 pointer-events-none">
                <svg width="100" height="100" className="text-kidcore-blue">
                    <polyline
                        points="10,10 90,10 90,90"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                    />
                </svg>
            </div>

            <div className="fixed top-0 right-0 z-5 pointer-events-none">
                <svg width="100" height="100" className="text-kidcore-pink">
                    <polyline
                        points="90,10 10,10 10,90"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                    />
                </svg>
            </div>

            <div className="fixed bottom-0 left-0 z-5 pointer-events-none">
                <svg width="100" height="100" className="text-kidcore-orange">
                    <polyline
                        points="10,90 90,90 90,10"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                    />
                </svg>
            </div>

            <div className="fixed bottom-0 right-0 z-5 pointer-events-none">
                <svg width="100" height="100" className="text-kidcore-green">
                    <polyline
                        points="90,90 10,90 10,10"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                    />
                </svg>
            </div>

            {/* Subtle VHS effect scanlines overlay */}
            <div className="fixed inset-0 z-5 pointer-events-none vhs-filter opacity-20" />

            {/* Gritty texture overlay */}
            <div className="fixed inset-0 z-5 pointer-events-none gritty-texture opacity-20" />
        </>
    );
};
