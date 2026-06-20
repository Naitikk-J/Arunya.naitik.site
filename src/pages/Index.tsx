import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MainNavigation } from '@/components/ui/MainNavigation';
import { TVZoom } from '@/components/TVZoom';
import { TVIntro } from '@/components/TVIntro';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { WelcomeSection } from '@/components/WelcomeSection';
import { useResponsive } from '@/hooks/use-responsive';

import { PacmanTimeline } from '@/components/PacManTimeline';
import { CRTOverlay } from '@/components/CRTOverlay';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
    const mainRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useResponsive();
    const [isLoading, setIsLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing...');

    // This function waits for an actual browser paint via double-rAF
    const waitForPaint = useCallback(() => {
        return new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    resolve();
                });
            });
        });
    }, []);

    useEffect(() => {
        // Initialize Lenis for smooth scrolling
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            window.innerWidth <= 768;

        const lenis = new Lenis({
            duration: isMobileDevice ? 1.5 : 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: isMobileDevice ? 0.8 : 1,
            touchMultiplier: isMobileDevice ? 1.5 : 2,
            infinite: false,
            syncTouch: true,
            lerp: isMobileDevice ? 0.08 : 0.1,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.lagSmoothing(0);

        // ─── COMPREHENSIVE ASSET PRELOADING ───
        const criticalImages = [
            '/bg-phone.avif',
            '/tv-book.avif',
            '/aarunya-logo.svg',
        ];

        const loadingTexts: Record<number, string> = {
            0: 'Initializing...',
            1: 'Loading backgrounds...',
            2: 'Preparing assets...',
            3: 'Loading fonts...',
            4: 'Rendering page...',
            5: 'Almost ready...',
        };

        // Total steps: images + fonts + DOM paint
        const totalSteps = criticalImages.length + 2; // +1 for fonts, +1 for DOM paint
        let completedSteps = 0;
        let dismissed = false;

        const stepComplete = async () => {
            if (dismissed) return;
            completedSteps++;
            const pct = Math.min(Math.round((completedSteps / totalSteps) * 100), 100);
            setLoadingProgress(pct);
            setLoadingText(loadingTexts[completedSteps] || 'Finishing up...');

            if (completedSteps >= totalSteps) {
                dismissed = true;
                setLoadingText('Ready!');
                setLoadingProgress(100);

                // Wait for browser to actually paint the DOM behind the loader
                await waitForPaint();

                // Tiny extra buffer to ensure paint is flushed
                await new Promise(r => setTimeout(r, 100));

                // Refresh scroll positions since everything is now painted
                ScrollTrigger.refresh();

                // Dismiss the loader
                setIsLoading(false);

                // After the CSS fade-out transition (1s), unmount the loader
                setTimeout(() => setShowLoader(false), 1100);
            }
        };

        // Step 1: Load all critical images
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => stepComplete();
            img.onerror = () => stepComplete(); // Don't block on error
        });

        // Step 2: Wait for fonts
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => stepComplete());
        } else {
            // Fallback if fonts API not available
            stepComplete();
        }

        // Step 3: Wait for DOM + first paint
        // Use a slightly delayed rAF to ensure React has committed the render
        const paintTimer = setTimeout(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    stepComplete();
                });
            });
        }, 300);

        // Safety fallback – never keep loading screen for more than 10s
        const safetyTimer = setTimeout(() => {
            if (!dismissed) {
                dismissed = true;
                console.warn('Loading safety timer triggered');
                setLoadingProgress(100);
                setLoadingText('Ready!');
                setIsLoading(false);
                ScrollTrigger.refresh();
                setTimeout(() => setShowLoader(false), 1100);
            }
        }, 10000);

        return () => {
            lenis.destroy();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            clearTimeout(safetyTimer);
            clearTimeout(paintTimer);
        };
    }, [waitForPaint]);

    return (
        <>
            {/* Loading Screen Overlay
                 - covers EVERYTHING with z-index
                 - content renders fully visible BEHIND it (no opacity:0)
                 - when dismissed, fades out revealing already-painted content */}
            {showLoader && (
                <div
                    className={`fixed inset-0 z-[9999] transition-opacity duration-1000 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <LoadingScreen progress={loadingProgress} loadingText={loadingText} />
                </div>
            )}

            {/* Main page content – ALWAYS fully visible (no opacity:0).
                 It renders behind the loading overlay and is already painted
                 when the loader fades out, so there is zero flash. */}
            <div
                ref={mainRef}
                className="relative w-full overflow-x-hidden min-h-screen flex flex-col bg-black"
            >
                {/* 1. Navbar */}
                <MainNavigation className="relative" />

                {/* CRT Overlay */}
                <CRTOverlay />

                {/* 2. Content Area */}
                <div className="relative flex-1 w-full pt-16 md:pt-20 lg:pt-24">

                    {/* Background Image */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: isMobile ? 'url(/tv-bgphone.png)' : 'url(/tv-main.avif)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />

                    {/* Main Content */}
                    <main className="relative z-10">
                        <TVZoom>
                            <TVIntro />
                        </TVZoom>

                        <WelcomeSection />

                        <PacmanTimeline />
                    </main>

                    <Footer />
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                .glitch {
                    position: relative;
                }
                .glitch::before,
                .glitch::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .glitch::before {
                    left: 2px;
                    text-shadow: -2px 0 #ff00c1;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim 5s infinite linear alternate-reverse;
                }
                .glitch::after {
                    left: -2px;
                    text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
                    animation: glitch-anim2 1s infinite linear alternate-reverse;
                }
                @keyframes glitch-anim {
                    0% { clip: rect(31px, 9999px, 94px, 0); transform: skew(0.85deg); }
                    5% { clip: rect(70px, 9999px, 71px, 0); transform: skew(0.85deg); }
                    100% { clip: rect(67px, 9999px, 62px, 0); transform: skew(0.1deg); }
                }
                @keyframes glitch-anim2 {
                    0% { clip: rect(65px, 9999px, 100px, 0); transform: skew(0.15deg); }
                    100% { clip: rect(10px, 9999px, 20px, 0); transform: skew(0.15deg); }
                }
            `}} />
            </div>
        </>
    );
};

export default Index;
