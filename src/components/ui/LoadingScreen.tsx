import { useEffect, useState } from 'react';
import { useKidcoreSounds } from './SoundEffects';

interface LoadingScreenProps {
    isGalleryLoading?: boolean;
    progress?: number;
    loadingText?: string;
}

export function LoadingScreen({ isGalleryLoading = false, progress: externalProgress, loadingText: externalText }: LoadingScreenProps = {}) {
    const [internalProgress, setInternalProgress] = useState(0);
    const [internalText, setInternalText] = useState('Initializing Systems');
    const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

    // Use external props if provided, otherwise use internal state
    const progress = externalProgress !== undefined ? externalProgress : internalProgress;
    const loadingText = externalText !== undefined ? externalText : internalText;

    const { playSound } = useKidcoreSounds();

    useEffect(() => {
        const logs = [
            '> MOUNTING CORE_ENGINE.SYS...',
            '> BUFFERING VIDEO_CACHE...',
            '> CACHING TV_CHANNEL_01...',
            '> OPTIMIZING RENDER_PIPELINE...',
            '> ESTABLISHING NEON_GRID...',
            '> SYNCING EUPHORIA_DRIVE...'
        ];

        const interval = setInterval(() => {
            setTerminalOutput(prev => {
                if (prev.length >= 6) return prev;
                return [...prev, logs[prev.length]];
            });
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const texts = [
            'Initializing Systems',
            'Loading campus data',
            'Generating holographic grid',
            'Caching Video Assets',
            'Entering Euphoria'
        ];

        if (externalProgress !== undefined) return;

        const interval = setInterval(() => {
            setInternalProgress((prev) => {
                const newProgress = Math.min(prev + Math.random() * 15, 95);
                const textIndex = Math.min(Math.floor(newProgress / 25), texts.length - 1);
                setInternalText(texts[textIndex]);
                return newProgress;
            });
        }, 300);

        // Play loading sound effect
        playSound('retroBeep');

        return () => clearInterval(interval);
    }, [playSound, externalProgress]);

    return (
        <div
            className="fixed inset-0 w-full h-full z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: '#05010D',
                position: 'fixed',
                top: isGalleryLoading ? '50vh' : '0',
                left: 0,
                right: 0,
                bottom: isGalleryLoading ? '50vh' : '0',
                zIndex: 9999,
            }}
        >
            {/* Retro Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(#f0f 1px, transparent 1px), linear-gradient(90deg, #f0f 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg) translateY(0)',
                animation: 'grid-scroll 20s linear infinite'
            }} />

            {/* Scanning Line */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-10">
                <div className="w-full h-[2px] bg-[#f0f] shadow-[0_0_15px_#f0f] animate-scanline" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 px-4">
                <div className="relative group">
                    <img
                        src="/aarunya-logo.svg"
                        alt="Aarunya 2026"
                        className="h-32 md:h-44 w-auto drop-shadow-[0_0_20px_#ff00ff]"
                        style={{
                            imageRendering: 'crisp-edges',
                            transform: 'translateZ(0) skew(-5deg)',
                        }}
                    />
                    <div className="absolute -top-4 -right-4 bg-[#f0f] text-black px-2 py-1 text-[10px] font-press-start animate-pulse">
                        V2.0
                    </div>
                </div>

                {/* Progress Stats */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-end gap-3 h-10">
                        <p className="font-press-start text-[10px] md:text-xs text-[#00ffff] mb-1 animate-pulse">
                            {loadingText.toUpperCase()}
                        </p>
                        <p className="font-press-start text-xl md:text-3xl text-[#ff00ff] drop-shadow-[0_0_10px_#ff00ff]">
                            {Math.round(progress)}%
                        </p>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative w-64 md:w-80 h-4 border-2 border-[#ff00ff]/50 bg-black/40 overflow-hidden p-0.5">
                        <div
                            className="h-full transition-all duration-300 relative"
                            style={{
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #ff00ff, #00ffff)',
                                boxShadow: '0 0 15px #ff00ff'
                            }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-shimmer" />
                        </div>
                    </div>
                </div>

                {/* Pseudo-Terminal Output */}
                <div className="w-64 md:w-80 h-24 bg-black/60 border border-white/10 p-2 font-vt323 text-[10px] md:text-xs text-[#39FF14]/80 overflow-hidden">
                    {terminalOutput.map((line, i) => (
                        <div key={i} className="animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${i * 100}ms` }}>
                            {line}
                        </div>
                    ))}
                    <div className="animate-pulse">_</div>
                </div>

                <p className="font-pixel text-[10px] text-white/40 tracking-[0.3em] uppercase mt-2">
                    System Protocol: Active
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes grid-scroll {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 40px; }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                .animate-scanline {
                    animation: scanline 4s linear infinite;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateX(-5px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}} />
        </div>
    );
}
