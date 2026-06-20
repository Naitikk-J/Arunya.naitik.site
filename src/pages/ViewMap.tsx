import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainNavigation } from '@/components/ui/MainNavigation';
import { Button } from '@/components/ui/button';

// Lazy load MapboxMap to reduce initial bundle size
const MapboxMap = lazy(() => import('@/components/3d/MapboxMap'));

const ViewMap = () => {
    const navigate = useNavigate();
    const [showExploreButton, setShowExploreButton] = useState(false);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Show the explore campus button after the map animation completes
        // Animation sequence: 2s wait + 3s (India) + 3s (Gwalior) + 3s (MITS) = 11s total
        animationTimeoutRef.current = setTimeout(() => {
            setShowExploreButton(true);
        }, 4000);

        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, []);

    const handleExploreCampus = () => {
        navigate('/campus-explorer');
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-background">
            <MainNavigation />

            {/* Mapbox Map Container */}
            <div className="absolute inset-0 pt-16">
                <Suspense
                    fallback={
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-4 border-4 border-kidcore-cyan border-t-kidcore-pink rounded-full animate-spin" />
                                <p className="text-kidcore-cyan font-orbitron text-sm tracking-wider">Loading map...</p>
                            </div>
                        </div>
                    }
                >
                    <MapboxMap />
                </Suspense>
            </div>

            {/* Explore Campus Button */}
            {showExploreButton && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 animate-fade-in">
                    <Button
                        onClick={handleExploreCampus}
                        className="px-4 py-3 md:px-8 md:py-6 text-base md:text-3xl font-orbitron font-bold tracking-wider bg-gradient-to-r from-kidcore-pink via-kidcore-blue to-kidcore-cyan text-white rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-100 hover:scale-105 active:scale-95 w-[90vw] md:w-auto"
                    >
                        CLICK ME TO EXPLORE CAMPUS
                    </Button>
                </div>
            )}

            {/* Decorative corner elements */}
            <div className="fixed top-20 left-6 w-20 h-0.5 bg-gradient-to-r from-primary to-transparent" />
            <div className="fixed top-20 left-6 w-0.5 h-20 bg-gradient-to-b from-primary to-transparent" />
            <div className="fixed top-20 right-6 w-20 h-0.5 bg-gradient-to-l from-secondary to-transparent" />
            <div className="fixed top-20 right-6 w-0.5 h-20 bg-gradient-to-b from-secondary to-transparent" />
        </div>
    );
};

export default ViewMap;
