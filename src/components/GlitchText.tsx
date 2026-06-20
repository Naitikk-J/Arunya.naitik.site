import React from 'react';

export const GlitchText = ({ text }: { text: string }) => {
    return (
        <span className="relative inline-block group">
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-[#ff00ff] opacity-0 group-hover:opacity-100 group-hover:translate-x-[2px] group-hover:animate-pulse transition-all duration-100 select-none">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-[#00ffff] opacity-0 group-hover:opacity-100 group-hover:-translate-x-[2px] group-hover:animate-pulse transition-all duration-100 select-none" style={{ animationDelay: '0.1s' }}>
                {text}
            </span>
        </span>
    );
};
