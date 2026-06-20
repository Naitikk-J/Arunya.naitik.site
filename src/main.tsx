import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import App from "./App.tsx";
import { LoadingScreen } from "./components/ui/LoadingScreen.tsx";
import Lenis from "lenis";
import "./index.css";

function LoadingWrapper() {
    const [isLoading, setIsLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        // After 2 seconds, start fade out
        const fadeTimer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        // After fade completes, remove loading screen completely
        const removeTimer = setTimeout(() => {
            setShowLoading(false);

            // Initialize lenis for smooth scrolling after loading screen is gone
            // Store in global to prevent garbage collection
            (window as any).lenis = new Lenis({
                autoRaf: true,
            });
        }, 2500); // 2s delay + 0.5s fade transition

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    return (
        <>
            <App />
            {showLoading && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        opacity: isLoading ? 1 : 0,
                        transition: 'opacity 0.5s ease-out',
                        pointerEvents: isLoading ? 'auto' : 'none',
                    }}
                >
                    <LoadingScreen />
                </div>
            )}
        </>
    );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Could not find root element to mount the app");
}

const root = createRoot(rootElement);
root.render(<LoadingWrapper />);
