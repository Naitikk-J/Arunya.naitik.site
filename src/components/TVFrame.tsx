import { ReactNode, useRef, useState } from "react";
import { InteractiveTVControls } from "./InteractiveTVControls";
import { useResponsive } from "../hooks/use-responsive";

interface TVFrameProps {
    children: ReactNode;
    className?: string;
}

interface VideoSource {
    src: string;
    type: string;
}

const TVFrame = ({ children, className = "" }: TVFrameProps) => {
    const screenRef = useRef<HTMLDivElement>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<VideoSource | null>(null);
    const [isPowered, setIsPowered] = useState(true);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [volume, setVolume] = useState(5);
    const [userHasInteracted, setUserHasInteracted] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const { isMobile, isTablet, isDesktop } = useResponsive();

    const videoSources: VideoSource[] = [
        { src: "/tv-bg.mp4", type: "video/mp4" },
        { src: "/bg.mov", type: "video/quicktime" },
        { src: "/tv-bg.mov", type: "video/quicktime" },
        { src: "/tv-bg-aarunya.mp4", type: "video/mp4" }
    ];

    const handleChannelChange = (channel: number) => {
        if (channel === 1) {
            // Channel 1: Regular content
            setIsVideoPlaying(false);
            setCurrentVideo(null);
            setIsVideoLoading(false);
        } else if (channel >= 2 && channel <= 5) {
            // Channel 2-5: Video content
            setIsVideoPlaying(true);
            setIsVideoLoading(true);
            setCurrentVideo(videoSources[Math.min(channel - 2, videoSources.length - 1)]);
        }
    };

    const handleVideoLoad = () => {
        setIsVideoLoading(false);
        if (videoRef.current) {
            videoRef.current.volume = volume / 10;
            // Ensure audio is ON by default
            videoRef.current.muted = !isPowered;

            // Explicitly call play to ensure it starts after load
            videoRef.current.play().catch(err => {
                console.log("Autoplay prevented:", err);
            });
        }
    };

    const handlePowerToggle = (powered: boolean) => {
        setIsPowered(powered);

        if (videoRef.current) {
            // When turning on, ensure audio is enabled
            videoRef.current.muted = !powered;
            if (powered) {
                videoRef.current.play().catch(() => { });
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        setUserHasInteracted(true);

        if (videoRef.current) {
            videoRef.current.volume = newVolume / 10;
            if (newVolume > 0 && isPowered) {
                videoRef.current.muted = false;
            } else {
                videoRef.current.muted = true;
            }
        }
    };

    return (
        <div className={`relative ${className} w-full max-w-full overflow-hidden select-none`}>
            {/* TV Body */}
            <div className={`bg-[#1A1A1A] border-t-[8px] border-x-[10px] border-b-[16px] border-[#0A0A0A] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-visible ${isMobile ? 'border-t-[4px] border-x-[5px] border-b-[10px] rounded-lg' : isTablet ? 'border-t-[6px] border-x-[8px] border-b-[12px]' : ''}`}>
                {/* Main Screen Container */}
                <div className="flex">
                    {/* Screen area */}
                    <div
                        ref={screenRef}
                        className={`flex-1 crt-screen aspect-video relative overflow-hidden bg-black rounded-sm ${isMobile ? 'm-0.5' : isTablet ? 'm-1.5' : 'm-3'} shadow-[inset_0_0_20px_rgba(0,0,0,1)] transition-all duration-300`}
                    >
                        {/* Inner glow */}
                        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50 pointer-events-none z-10" />

                        {/* Content */}
                        {isVideoPlaying ? (
                            <div className="w-full h-full relative">
                                {isVideoLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <div className="absolute inset-0 overflow-hidden opacity-20">
                                            <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full animate-shimmer" />
                                        </div>
                                    </div>
                                )}
                                <video
                                    ref={videoRef}
                                    src={currentVideo?.src}
                                    autoPlay
                                    loop
                                    onLoadedData={handleVideoLoad}
                                    muted={!isPowered}
                                    playsInline
                                    preload="auto"
                                    className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
                                />
                            </div>
                        ) : (
                            <div className={`relative z-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${isPowered ? 'opacity-100' : 'opacity-0'}`}>
                                {children}
                            </div>
                        )}

                        {/* Interactive TV Controls Text */}
                        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 text-[10px] sm:text-[14px] font-pixel text-white/40 bg-black/20 px-2 sm:px-3 py-1 rounded z-20 uppercase tracking-tighter">
                            Aarunya Interactive TV-2026
                        </div>

                        {/* Corner vignette */}
                        <div className="absolute inset-0 pointer-events-none z-10" style={{
                            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)'
                        }} />

                        {/* Static/Noise overlay when power is toggled (briefly) */}
                        {!isPowered && (
                            <div className="absolute inset-0 bg-[#050505] z-30 flex items-center justify-center">
                                <div className="w-[1px] h-[1px] bg-white shadow-[0_0_20px_2px_white] scale-0 animate-tv-off" />
                            </div>
                        )}
                    </div>

                    {/* Integrated Control Panel Space (Right Side) */}
                    <div className={`bg-[#111111] border-l-[3px] sm:border-l-4 border-[#0A0A0A] flex flex-col items-center justify-center ${isMobile ? 'w-8 py-1' : isTablet ? 'w-12 py-2' : 'w-24 py-4'} relative`}>
                        <InteractiveTVControls
                            screenRef={screenRef}
                            isPowered={isPowered}
                            volume={volume}
                            onPowerToggle={handlePowerToggle}
                            onChannelChange={handleChannelChange}
                            onVolumeChange={handleVolumeChange}
                        />

                        {/* Small indicator lights at the bottom of panel */}
                        <div className={`absolute bottom-1 sm:bottom-2 flex gap-0.5 sm:gap-1.5 ${isMobile ? 'scale-75' : ''}`}>
                            <div className={`rounded-full bg-lime-green animate-pulse shadow-[0_0_5px_rgba(57,255,20,0.8)] ${isMobile ? 'w-1 h-1' : isTablet ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
                            <div className={`rounded-full bg-radical-red shadow-[0_0_5px_rgba(255,0,153,0.8)] ${isMobile ? 'w-1 h-1' : isTablet ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stand/Bottom Decoration - Optimized for mobile */}
            <div className={`relative mx-auto -mt-1 ${isMobile ? 'w-2/3 h-2' : isTablet ? 'w-1/2 h-3' : 'w-1/2 h-4'} bg-[#050505] rounded-b-xl shadow-lg border-x-4 border-[#0A0A0A]`} />
        </div>
    );
};

export default TVFrame;