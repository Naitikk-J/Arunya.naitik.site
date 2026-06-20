import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function PageTransition({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Reset scroll position to top when navigating to a new page
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [location.pathname]);

    return (
        <div
            ref={containerRef}
            className="relative w-full transition-opacity"
            style={{
                perspective: '1200px',
                transformStyle: 'preserve-3d'
            }}
        >
            {children}
        </div>
    );
}
