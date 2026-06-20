import { useEffect } from 'react';

export const useGlitchEffect = () => {
    useEffect(() => {
        const initializeGlitchEffects = () => {
            // Find all elements with glitch-trigger class
            const glitchTriggers = document.querySelectorAll('.glitch-trigger');

            glitchTriggers.forEach((el: any) => {
                const glitchText = el.querySelector('.glitch-text');

                el.addEventListener('mouseenter', () => {
                    if (glitchText) {
                        glitchText.classList.add('animate-glitch');
                    }
                });

                el.addEventListener('mouseleave', () => {
                    if (glitchText) {
                        glitchText.classList.remove('animate-glitch');
                    }
                });
            });

            // Add glitch effect to elements with glitch-on-click
            const glitchClickElements = document.querySelectorAll('.glitch-on-click');
            glitchClickElements.forEach((el: any) => {
                el.addEventListener('click', () => {
                    el.style.animation = 'none';
                    setTimeout(() => {
                        el.style.animation = '';
                    }, 50);
                });
            });

            // Initialize random glitch effects for decorative elements
            const randomGlitchElements = document.querySelectorAll('.random-glitch');
            randomGlitchElements.forEach((el: any) => {
                const randomDelay = Math.random() * 5000;
                setTimeout(() => {
                    const interval = setInterval(() => {
                        el.style.animation = 'none';
                        setTimeout(() => {
                            el.style.animation = 'glitch 0.4s infinite';
                        }, 50);
                    }, Math.random() * 8000 + 3000);

                    // Cleanup on unmount would be needed in a real app
                    (el as any).__glitchInterval = interval;
                }, randomDelay);
            });
        };

        // Run immediately and on DOM changes
        initializeGlitchEffects();

        // Reinitialize when DOM content loads
        const observer = new MutationObserver(() => {
            initializeGlitchEffects();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
        };
    }, []);
};
