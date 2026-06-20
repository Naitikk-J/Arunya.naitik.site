import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

interface SoundEffect {
    name: string;
    src: string;
    volume?: number;
    loop?: boolean;
}

interface UseSoundEffectsReturn {
    playSound: (soundName: string) => void;
    stopSound: (soundName: string) => void;
    toggleSound: (soundName: string) => void;
    isPlaying: (soundName: string) => boolean;
    setVolume: (soundName: string, volume: number) => void;
    muteAll: () => void;
    unmuteAll: () => void;
}

export const useSoundEffects = (sounds: SoundEffect[]): UseSoundEffectsReturn => {
    const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
    const [playingSounds, setPlayingSounds] = useState<Set<string>>(new Set());
    const [muted, setMuted] = useState(false);

    // Initialize sounds
    useEffect(() => {
        // Only clear if sounds array actually changed materially (though here we depend on ref stability)
        // Preload all sounds
        sounds.forEach(sound => {
            // Check if already exists to avoid recreating
            if (!audioRefs.current.has(sound.name)) {
                const audio = new Audio(sound.src);
                audio.volume = sound.volume ?? 0.5;
                audio.loop = sound.loop ?? false;
                audio.preload = 'auto';
                audioRefs.current.set(sound.name, audio);
            } else {
                // Update volume/loop if changed? (Optional, but good for HMR)
                const audio = audioRefs.current.get(sound.name)!;
                audio.volume = sound.volume ?? 0.5;
            }
        });

        // Request audio context permission on first user interaction
        const handleFirstInteraction = () => {
            // Try to play a silent audio to unlock audio context
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                const context = new AudioContextClass();
                if (context.state === 'suspended') {
                    context.resume();
                }
            }

            // Try to play a silent sound to unlock audio on mobile
            const silentAudio = new Audio();
            silentAudio.volume = 0;
            silentAudio.play().catch(() => { });

            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);

        return () => {
            // Cleanup is tricky because we might want to keep sounds cached? 
            // But standard cleanup is good practice.
            audioRefs.current.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };
    }, [sounds]);

    const playSound = useCallback((soundName: string) => {
        if (muted) return;

        const audio = audioRefs.current.get(soundName);
        if (audio) {
            // Try to resume audio context if suspended
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                const context = new AudioContextClass();
                if (context.state === 'suspended') {
                    context.resume();
                }
            }

            audio.currentTime = 0;
            audio.play().catch(error => {
                console.warn(`Failed to play sound ${soundName}:`, error);
                // Try to unlock audio on mobile devices
                if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
                    // Create a new audio context and try to resume it
                    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                    if (AudioContextClass) {
                        const newContext = new AudioContextClass();
                        newContext.resume().then(() => {
                            audio.play().catch(err => console.warn('Still failed to play sound:', err));
                        });
                    }
                }
            });
            setPlayingSounds(prev => new Set(prev).add(soundName));
        }
    }, [muted]);

    const stopSound = useCallback((soundName: string) => {
        const audio = audioRefs.current.get(soundName);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            setPlayingSounds(prev => {
                const newSet = new Set(prev);
                newSet.delete(soundName);
                return newSet;
            });
        }
    }, []);

    const isPlaying = useCallback((soundName: string): boolean => {
        return playingSounds.has(soundName);
    }, [playingSounds]);

    const toggleSound = useCallback((soundName: string) => {
        if (isPlaying(soundName)) {
            stopSound(soundName);
        } else {
            playSound(soundName);
        }
    }, [isPlaying, playSound, stopSound]);

    const setVolume = useCallback((soundName: string, volume: number) => {
        const audio = audioRefs.current.get(soundName);
        if (audio) {
            audio.volume = Math.max(0, Math.min(1, volume));
        }
    }, []);

    const muteAll = useCallback(() => {
        setMuted(true);
        audioRefs.current.forEach(audio => {
            audio.muted = true;
        });
    }, []);

    const unmuteAll = useCallback(() => {
        setMuted(false);
        audioRefs.current.forEach(audio => {
            audio.muted = false;
        });
    }, []);

    return useMemo(() => ({
        playSound,
        stopSound,
        toggleSound,
        isPlaying,
        setVolume,
        muteAll,
        unmuteAll
    }), [playSound, stopSound, toggleSound, isPlaying, setVolume, muteAll, unmuteAll]);
};

// Kidcore sound effects configuration
export const KIDCORE_SOUNDS = {
    click: { name: 'click', src: '/sounds/click.wav', volume: 0.3 },
    hover: { name: 'hover', src: '/sounds/hover.wav', volume: 0.2 },
    powerOn: { name: 'powerOn', src: '/sounds/power-on.wav', volume: 0.4 },
    powerOff: { name: 'powerOff', src: '/sounds/power-off.wav', volume: 0.4 },
    channelChange: { name: 'channelChange', src: '/sounds/channel-change.wav', volume: 0.3 },
    volumeUp: { name: 'volumeUp', src: '/sounds/volume-up.wav', volume: 0.3 },
    volumeDown: { name: 'volumeDown', src: '/sounds/volume-down.wav', volume: 0.3 },
    tvStatic: { name: 'tvStatic', src: '/sounds/tv-static.wav', volume: 0.2, loop: true },
    easterEgg: { name: 'easterEgg', src: '/sounds/easter-egg.wav', volume: 0.5 },
    buttonPress: { name: 'buttonPress', src: '/sounds/button-press.wav', volume: 0.3 },
    retroBeep: { name: 'retroBeep', src: '/sounds/retro-beep.wav', volume: 0.3 },
    pixelPop: { name: 'pixelPop', src: '/sounds/pixel-pop.wav', volume: 0.3 },
    gameStart: { name: 'gameStart', src: '/sounds/game-start.wav', volume: 0.4 },
    success: { name: 'success', src: '/sounds/success.wav', volume: 0.4 },
    error: { name: 'error', src: '/sounds/error.wav', volume: 0.3 }
};

// Hook for easy access to kidcore sounds
export const useKidcoreSounds = () => {
    const sounds = useMemo(() => Object.values(KIDCORE_SOUNDS), []);
    return useSoundEffects(sounds);
};

// Component for sound effects management
export const SoundEffectsProvider = ({ children }: { children: React.ReactNode }) => {
    const sounds = useKidcoreSounds();

    // Expose sounds to window for easy access in other components
    useEffect(() => {
        (window as any).__SOUND_EFFECTS__ = sounds;

        // Add global click handler to unlock audio on mobile
        const unlockAudio = () => {
            // Try to resume any suspended audio contexts
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                const context = new AudioContextClass();
                if (context.state === 'suspended') {
                    context.resume();
                }
            }

            // Try to play a silent sound to unlock audio
            const silentAudio = new Audio();
            silentAudio.volume = 0;
            silentAudio.play().catch(() => { });

            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };

        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
        document.addEventListener('keydown', unlockAudio);

        return () => {
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };
    }, [sounds]);

    return <>{children}</>;
};

// Utility function to play sounds easily
export const playSound = (soundName: string) => {
    const sounds = (window as any).__SOUND_EFFECTS__;
    if (sounds) {
        sounds.playSound(soundName);
    }
};

// Utility function to stop sounds easily
export const stopSound = (soundName: string) => {
    const sounds = (window as any).__SOUND_EFFECTS__;
    if (sounds) {
        sounds.stopSound(soundName);
    }
};