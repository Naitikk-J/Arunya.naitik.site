import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useKidcoreSounds } from './ui/SoundEffects';

interface InteractiveTVControlsProps {
    screenRef?: React.RefObject<HTMLDivElement>;
    isPowered: boolean;
    volume: number;
    onPowerToggle?: (isPowered: boolean) => void;
    onChannelChange?: (channel: number) => void;
    onVolumeChange?: (volume: number) => void;
}

export const InteractiveTVControls = ({
    screenRef,
    isPowered,
    volume,
    onPowerToggle,
    onChannelChange,
    onVolumeChange,
}: InteractiveTVControlsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [channel, setChannel] = useState(1);
    const [easterEggCounter, setEasterEggCounter] = useState(0);
    const [showEasterEgg, setShowEasterEgg] = useState(false);
    const { playSound } = useKidcoreSounds();

    // Handle POWER button click with glitch effect
    const handlePowerClick = () => {
        if (!containerRef.current || !screenRef?.current) return;

        const newPowered = !isPowered;
        onPowerToggle?.(newPowered);

        if (!newPowered) {
            // Power down effect
            const tl = gsap.timeline();
            tl.to(screenRef.current, {
                opacity: 0.1,
                duration: 0.1,
                repeat: 3,
                yoyo: true,
                ease: 'power2.inOut',
            })
                .to(screenRef.current, {
                    opacity: 0,
                    duration: 0.3,
                }, '-=0.1');

            animateControlButton('power-btn');
            playSound('powerOff');
        } else {
            // Power up effect
            const tl = gsap.timeline();
            tl.to(screenRef.current, {
                opacity: 1,
                duration: 0.2,
                repeat: 2,
                yoyo: true,
                ease: 'power2.inOut',
            });

            animateControlButton('power-btn');
            playSound('powerOn');
        }
    };

    // Handle CHANNEL button
    const handleChannelChange = () => {
        const newChannel = (channel % 4) + 1;
        setChannel(newChannel);
        onChannelChange?.(newChannel);

        if (!screenRef?.current) return;

        const tl = gsap.timeline();
        tl.to(screenRef.current, { opacity: 0, duration: 0.05 })
            .to(screenRef.current, { opacity: 1, duration: 0.05 }, '-=0.03')
            .to(screenRef.current, { opacity: 0, duration: 0.05 }, '-=0.03')
            .to(screenRef.current, { opacity: 1, duration: 0.05 }, '-=0.03');

        gsap.to(screenRef.current, {
            filter: 'none',
            duration: 0.3,
        });

        animateControlButton('channel-btn');
        playSound('channelChange');

        setEasterEggCounter((prev) => prev + 1);
        if (easterEggCounter === 2) {
            triggerEasterEgg();
            setEasterEggCounter(0);
        }
    };

    const handleVolumeUp = () => {
        const newVolume = Math.min(volume + 1, 10);
        onVolumeChange?.(newVolume);
        if (!screenRef?.current) return;
        const intensity = (newVolume / 10) * 2;
        gsap.to(screenRef.current, {
            x: () => gsap.utils.random(-intensity, intensity),
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: 'power2.inOut',
        });
        animateControlButton('volume-btn');
        playSound('volumeUp');
    };

    const handleVolumeDown = () => {
        const newVolume = Math.max(volume - 1, 0);
        onVolumeChange?.(newVolume);
        if (!screenRef?.current) return;
        const intensity = (newVolume / 10) * 2;
        gsap.to(screenRef.current, {
            x: () => gsap.utils.random(-intensity, intensity),
            duration: 0.1,
            repeat: 2,
            yoyo: true,
            ease: 'power2.inOut',
        });
        animateControlButton('volume-btn-down');
        playSound('volumeDown');
    };

    const animateControlButton = (btnId: string) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        gsap.to(btn, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 });
    };

    const triggerEasterEgg = () => {
        if (!screenRef?.current) return;
        gsap.to(screenRef.current, {
            filter: 'hue-rotate(360deg)',
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                setShowEasterEgg(true);
                playSound('easterEgg');
                setTimeout(() => setShowEasterEgg(false), 2000);
            }
        });
    };

    return (
        <div
            ref={containerRef}
            className="h-full flex flex-col items-center justify-around z-20 w-full px-2"
        >
            {showEasterEgg && (
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]">
                    <div className="font-pixel text-2xl text-electric-yellow animate-pulse glow-yellow transform -rotate-12">
                        ✨ SECRET FOUND ✨
                    </div>
                </div>
            )}

            {/* POWER BUTTON */}
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                <button
                    id="power-btn"
                    onClick={handlePowerClick}
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center shadow-lg ${isPowered
                        ? 'border-lime-green bg-[#1A3A1A] text-lime-green shadow-[0_0_15px_rgba(57,255,20,0.6)]'
                        : 'border-gray-700 bg-[#0A0A0A] text-gray-700'
                        } hover:scale-110 active:scale-95`}
                >
                    <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full border-2 ${isPowered ? 'border-lime-green' : 'border-gray-700'} flex items-center justify-center`}>
                        <div className={`w-0.5 h-1.5 sm:h-2 ${isPowered ? 'bg-lime-green' : 'bg-gray-700'} -mt-0.5 sm:-mt-1`} />
                    </div>
                </button>
                <span className="font-pixel text-[5px] sm:text-[6px] text-gray-400 uppercase tracking-tighter">POWER</span>
            </div>

            {/* CHANNEL BUTTON */}
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                <button
                    id="channel-btn"
                    onClick={handleChannelChange}
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-cyber-blue bg-[#0D1A2A] font-pixel text-[10px] sm:text-xs font-bold flex items-center justify-center text-cyber-blue shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                    <span className="mt-0.5">{channel}</span>
                </button>
                <span className="font-pixel text-[5px] sm:text-[6px] text-gray-400 uppercase tracking-tighter">CH</span>
            </div>

            {/* VOLUME BUTTONS */}
            <div className="flex flex-col items-center gap-1 sm:gap-2">
                <button
                    id="volume-btn"
                    onClick={handleVolumeUp}
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md border-2 border-electric-yellow bg-[#2A2A0D] font-pixel text-sm sm:text-base md:text-lg font-bold flex items-center justify-center text-electric-yellow shadow-[0_0_10px_rgba(255,231,55,0.3)] hover:scale-105 active:scale-90 transition-all cursor-pointer"
                >+</button>
                <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-2 border-gray-700 rounded bg-[#0A0A0A] font-pixel text-[7px] sm:text-[8px] text-electric-yellow shadow-inner">
                    {volume}
                </div>
                <button
                    id="volume-btn-down"
                    onClick={handleVolumeDown}
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md border-2 border-radical-red bg-[#2A0D15] font-pixel text-sm sm:text-base md:text-lg font-bold flex items-center justify-center text-radical-red shadow-[0_0_10px_rgba(255,0,153,0.3)] hover:scale-105 active:scale-90 transition-all cursor-pointer"
                >−</button>
                <span className="font-pixel text-[5px] sm:text-[6px] text-gray-400 uppercase tracking-tighter">VOL</span>
            </div>
        </div>
    );
};

export default InteractiveTVControls;