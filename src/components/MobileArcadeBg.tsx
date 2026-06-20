import React from 'react';

/**
 * MobileArcadeBg – Lightweight, GPU-friendly kidcore background for mobile.
 * 
 * Performance strategy:
 *  - ZERO canvas (no per-frame JS rendering)
 *  - ZERO framer-motion (no React re-renders for animation)
 *  - Pure CSS animations only (GPU-composited via transform/opacity)
 *  - Minimal DOM nodes
 *  - No JS in the render loop
 */

const MobileArcadeBg: React.FC = () => {
    return (
        <div className="mobile-arcade-bg" aria-hidden="true">
            {/* Base gradient */}
            <div className="mobile-arcade-bg__gradient" />

            {/* Animated grid */}
            <div className="mobile-arcade-bg__grid" />

            {/* Rainbow diagonal stripes */}
            <div className="mobile-arcade-bg__rainbow-stripes" />

            {/* Floating glow orbs — pure CSS animation */}
            <div className="mobile-arcade-bg__orb mobile-arcade-bg__orb--pink" />
            <div className="mobile-arcade-bg__orb mobile-arcade-bg__orb--purple" />
            <div className="mobile-arcade-bg__orb mobile-arcade-bg__orb--cyan" />
            <div className="mobile-arcade-bg__orb mobile-arcade-bg__orb--yellow" />

            {/* Sparse floating CSS-only particles */}
            <div className="mobile-arcade-bg__particles">
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--1" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--2" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--3" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--4" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--5" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--6" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--7" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--8" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--9" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--10" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--11" />
                <span className="mobile-arcade-bg__dot mobile-arcade-bg__dot--12" />
            </div>

            {/* Doodle corners */}
            <div className="mobile-arcade-bg__pixel-corner mobile-arcade-bg__pixel-corner--tl" />
            <div className="mobile-arcade-bg__pixel-corner mobile-arcade-bg__pixel-corner--tr" />
            <div className="mobile-arcade-bg__pixel-corner mobile-arcade-bg__pixel-corner--bl" />
            <div className="mobile-arcade-bg__pixel-corner mobile-arcade-bg__pixel-corner--br" />

            {/* Scanlines */}
            <div className="mobile-arcade-bg__scanlines" />
        </div>
    );
};

export default MobileArcadeBg;
