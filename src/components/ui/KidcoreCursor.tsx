import React, { useEffect, useRef, useState } from 'react';

export const KidcoreCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isPointer, setIsPointer] = useState(false);
    const [clicks, setClicks] = useState<{ x: number, y: number, id: number, text: string, color: string }[]>([]);

    // Use refs for values that change frequently to avoid effect dependency cycles
    const isPointerRef = useRef(false);

    useEffect(() => {
        // Create global style to hide default cursor
        const style = document.createElement('style');
        style.innerText = `
            * { cursor: none !important; }
            body { overflow-x: hidden; }
        `;
        document.head.appendChild(style);

        const updatePosition = (e: MouseEvent) => {
            if (cursorRef.current) {
                // Direct DOM manipulation for performance
                cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }

            // Optimized hover check
            const target = e.target as HTMLElement;
            // Simple check first
            let clickable = target.tagName === 'BUTTON' || target.tagName === 'A';

            if (!clickable) {
                const closest = target.closest('button, a, [role="button"], input, select, textarea');
                if (closest) clickable = true;
            }

            // Only update state if changed to minimize re-renders
            if (clickable !== isPointerRef.current) {
                isPointerRef.current = clickable;
                setIsPointer(clickable);
            }
        };

        const handleClick = (e: MouseEvent) => {
            const colors = ['#FF0099', '#39FF14', '#FFE737', '#00fff9', '#FF4D00'];
            const texts = ['POW!', 'ZKAP!', 'POP!', 'CLICK!', 'WOW!', 'YAS!'];

            const newClick = {
                x: e.clientX,
                y: e.clientY,
                id: Date.now(),
                text: texts[Math.floor(Math.random() * texts.length)],
                color: colors[Math.floor(Math.random() * colors.length)]
            };

            setClicks(prev => [...prev, newClick]);

            setTimeout(() => {
                setClicks(prev => prev.filter(c => c.id !== newClick.id));
            }, 800);
        };

        window.addEventListener('mousemove', updatePosition, { passive: true });
        window.addEventListener('mousedown', handleClick);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mousedown', handleClick);
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    return (
        <>
            {/* Click Effects Layer */}
            <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
                {clicks.map(click => (
                    <div
                        key={click.id}
                        className="absolute font-bold text-2xl animate-bounce"
                        style={{
                            left: click.x,
                            top: click.y,
                            transform: 'translate(-50%, -50%)',
                            color: click.color,
                            textShadow: '2px 2px 0px #000',
                            fontFamily: "'Press Start 2P', cursive",
                            pointerEvents: 'none'
                        }}
                    >
                        {click.text}
                    </div>
                ))}
            </div>

            {/* The Main Cursor */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[100000] will-change-transform"
                style={{
                    // Initial position off-screen to avoid flash
                    left: 0,
                    top: 0,
                    transform: 'translate(-100px, -100px)'
                }}
            >
                <div
                    className={`transition-all duration-200 ease-out flex items-center justify-center ${isPointer ? 'scale-125 rotate-12' : 'scale-100 rotate-0'}`}
                >
                    {/* Kidcore Cursor SVG */}
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,1))'
                        }}
                    >
                        <path
                            d="M2 2L10.5 27.5L14.5 17.5L24.5 13.5L2 2Z"
                            fill={isPointer ? "#FF0099" : "#00defc"}
                            stroke="black"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                    </svg>

                    {/* Floating Emoji/Icon */}
                    <div className="absolute -bottom-5 -right-5 text-xl animate-pulse filter drop-shadow-md">
                        {isPointer ? '' : ''}
                    </div>
                </div>
            </div>
        </>
    );
};
