import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TVFrame from "./TVFrame";
import { useResponsive } from "@/hooks/use-responsive";

interface TVZoomProps {
    children?: React.ReactNode;
}

export const TVZoom: React.FC<TVZoomProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useResponsive();

    // Always call hooks, even for mobile
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // MUCH smoother scaling curve
    const scale = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 1],
        [1, 2.5, 6, 18, 40]
    );

    // Keep visible until late → fade only near exit
    const opacity = useTransform(
        scrollYProgress,
        [0, 0.7, 0.9, 1],
        [1, 1, 0.3, 0]
    );

    // Gentle upward exit
    const y = useTransform(
        scrollYProgress,
        [0.75, 1],
        ["0%", "-100%"]
    );

    /* ------------------ Pointer Events FIX ------------------ */
    const [pointerEvents, setPointerEvents] = useState<"none" | "auto">("auto");

    useEffect(() => {
        return scrollYProgress.on("change", (v) => {
            setPointerEvents(v > 0.95 ? "none" : "auto");
        });
    }, [scrollYProgress]);

    /* ------------------ MOBILE (no zoom) ------------------ */
    if (isMobile) {
        return (
            <div className="relative h-[100vh] w-full">
                <div className="sticky top-16 md:top-24 h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] flex items-center justify-center">
                    <div className="relative w-[92vw] max-w-[850px]">
                        <TVFrame>
                            <div className="absolute inset-0">{children}</div>
                        </TVFrame>
                    </div>
                </div>
            </div>
        );
    }

    /* ------------------ DESKTOP ZOOM ------------------ */
    return (
        <div ref={containerRef} className="relative h-[200vh] w-full">
            <div className="sticky top-16 md:top-24 h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] flex items-center justify-center">
                <motion.div
                    style={{
                        scale,
                        opacity,
                        y,
                        pointerEvents,
                        transformOrigin: "50% 50%",
                    }}
                    className="relative w-[92vw] md:w-[70vw] max-w-[850px]"
                >
                    <TVFrame>
                        <div className="absolute inset-0">{children}</div>
                    </TVFrame>
                </motion.div>
            </div>

            {/* Scroll spacer */}
            <div className="h-[60vh]" />
        </div>
    );
};
