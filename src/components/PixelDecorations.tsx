// 8-bit pixel art decorative elements

export const PixelStar = ({ className = "", color = "electric-yellow" }: { className?: string; color?: string }) => (
  <div className={`relative ${className}`} style={{ imageRendering: 'pixelated' }}>
    <svg viewBox="0 0 16 16" className="w-full h-full" fill={`hsl(var(--${color}))`}>
      <rect x="7" y="0" width="2" height="2" />
      <rect x="7" y="2" width="2" height="2" />
      <rect x="5" y="4" width="2" height="2" />
      <rect x="7" y="4" width="2" height="2" />
      <rect x="9" y="4" width="2" height="2" />
      <rect x="0" y="6" width="2" height="2" />
      <rect x="2" y="6" width="2" height="2" />
      <rect x="4" y="6" width="2" height="2" />
      <rect x="6" y="6" width="2" height="2" />
      <rect x="8" y="6" width="2" height="2" />
      <rect x="10" y="6" width="2" height="2" />
      <rect x="12" y="6" width="2" height="2" />
      <rect x="14" y="6" width="2" height="2" />
      <rect x="5" y="8" width="2" height="2" />
      <rect x="7" y="8" width="2" height="2" />
      <rect x="9" y="8" width="2" height="2" />
      <rect x="3" y="10" width="2" height="2" />
      <rect x="5" y="10" width="2" height="2" />
      <rect x="9" y="10" width="2" height="2" />
      <rect x="11" y="10" width="2" height="2" />
      <rect x="1" y="12" width="2" height="2" />
      <rect x="3" y="12" width="2" height="2" />
      <rect x="11" y="12" width="2" height="2" />
      <rect x="13" y="12" width="2" height="2" />
      <rect x="0" y="14" width="2" height="2" />
      <rect x="14" y="14" width="2" height="2" />
    </svg>
  </div>
);

export const PixelHeart = ({ className = "", color = "radical-red" }: { className?: string; color?: string }) => (
  <div className={`relative ${className}`} style={{ imageRendering: 'pixelated' }}>
    <svg viewBox="0 0 16 14" className="w-full h-full" fill={`hsl(var(--${color}))`}>
      <rect x="2" y="0" width="2" height="2" />
      <rect x="4" y="0" width="2" height="2" />
      <rect x="8" y="0" width="2" height="2" />
      <rect x="10" y="0" width="2" height="2" />
      <rect x="0" y="2" width="2" height="2" />
      <rect x="2" y="2" width="2" height="2" />
      <rect x="4" y="2" width="2" height="2" />
      <rect x="6" y="2" width="2" height="2" />
      <rect x="8" y="2" width="2" height="2" />
      <rect x="10" y="2" width="2" height="2" />
      <rect x="12" y="2" width="2" height="2" />
      <rect x="14" y="2" width="2" height="2" />
      <rect x="0" y="4" width="2" height="2" />
      <rect x="2" y="4" width="2" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="6" y="4" width="2" height="2" />
      <rect x="8" y="4" width="2" height="2" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="12" y="4" width="2" height="2" />
      <rect x="14" y="4" width="2" height="2" />
      <rect x="2" y="6" width="2" height="2" />
      <rect x="4" y="6" width="2" height="2" />
      <rect x="6" y="6" width="2" height="2" />
      <rect x="8" y="6" width="2" height="2" />
      <rect x="10" y="6" width="2" height="2" />
      <rect x="12" y="6" width="2" height="2" />
      <rect x="4" y="8" width="2" height="2" />
      <rect x="6" y="8" width="2" height="2" />
      <rect x="8" y="8" width="2" height="2" />
      <rect x="10" y="8" width="2" height="2" />
      <rect x="6" y="10" width="2" height="2" />
      <rect x="8" y="10" width="2" height="2" />
      <rect x="6" y="12" width="4" height="2" />
    </svg>
  </div>
);

export const PixelCoin = ({ className = "", collected = false }: { className?: string; collected?: boolean }) => (
  <div className={`relative ${className} ${collected ? 'opacity-30' : 'animate-pulse-glow'}`} style={{ imageRendering: 'pixelated' }}>
    <svg viewBox="0 0 12 12" className="w-full h-full">
      <rect x="4" y="0" width="4" height="2" fill="hsl(var(--electric-yellow))" />
      <rect x="2" y="2" width="2" height="2" fill="hsl(var(--electric-yellow))" />
      <rect x="4" y="2" width="4" height="2" fill="hsl(var(--arcade-orange))" />
      <rect x="8" y="2" width="2" height="2" fill="hsl(var(--electric-yellow))" />
      <rect x="0" y="4" width="2" height="4" fill="hsl(var(--electric-yellow))" />
      <rect x="2" y="4" width="2" height="4" fill="hsl(var(--arcade-orange))" />
      <rect x="4" y="4" width="4" height="4" fill="hsl(var(--electric-yellow))" />
      <rect x="8" y="4" width="2" height="4" fill="hsl(var(--arcade-orange))" />
      <rect x="10" y="4" width="2" height="4" fill="hsl(var(--electric-yellow))" />
      <rect x="2" y="8" width="2" height="2" fill="hsl(var(--electric-yellow))" />
      <rect x="4" y="8" width="4" height="2" fill="hsl(var(--arcade-orange))" />
      <rect x="8" y="8" width="2" height="2" fill="hsl(var(--electric-yellow))" />
      <rect x="4" y="10" width="4" height="2" fill="hsl(var(--electric-yellow))" />
    </svg>
  </div>
);

export const PixelGhost = ({ className = "", color = "cyber-blue" }: { className?: string; color?: string }) => (
  <div className={`relative ${className}`} style={{ imageRendering: 'pixelated' }}>
    <svg viewBox="0 0 14 16" className="w-full h-full" fill={`hsl(var(--${color}))`}>
      <rect x="4" y="0" width="6" height="2" />
      <rect x="2" y="2" width="10" height="2" />
      <rect x="0" y="4" width="14" height="2" />
      <rect x="0" y="6" width="14" height="2" />
      {/* Eyes */}
      <rect x="2" y="6" width="2" height="2" fill="white" />
      <rect x="8" y="6" width="2" height="2" fill="white" />
      <rect x="3" y="7" width="1" height="1" fill="hsl(var(--crt-black))" />
      <rect x="9" y="7" width="1" height="1" fill="hsl(var(--crt-black))" />
      <rect x="0" y="8" width="14" height="2" fill={`hsl(var(--${color}))`} />
      <rect x="0" y="10" width="14" height="2" />
      <rect x="0" y="12" width="14" height="2" />
      <rect x="0" y="14" width="2" height="2" />
      <rect x="4" y="14" width="2" height="2" />
      <rect x="8" y="14" width="2" height="2" />
      <rect x="12" y="14" width="2" height="2" />
    </svg>
  </div>
);

export const PixelController = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`} style={{ imageRendering: 'pixelated' }}>
    <svg viewBox="0 0 24 16" className="w-full h-full">
      {/* Body */}
      <rect x="2" y="4" width="20" height="10" fill="hsl(var(--muted))" />
      <rect x="0" y="6" width="2" height="6" fill="hsl(var(--muted))" />
      <rect x="22" y="6" width="2" height="6" fill="hsl(var(--muted))" />
      {/* D-pad */}
      <rect x="4" y="7" width="2" height="4" fill="hsl(var(--crt-black))" />
      <rect x="3" y="8" width="4" height="2" fill="hsl(var(--crt-black))" />
      {/* Buttons */}
      <rect x="16" y="7" width="2" height="2" fill="hsl(var(--radical-red))" />
      <rect x="18" y="9" width="2" height="2" fill="hsl(var(--lime-green))" />
      {/* Start/Select */}
      <rect x="10" y="10" width="2" height="1" fill="hsl(var(--crt-black))" />
      <rect x="12" y="10" width="2" height="1" fill="hsl(var(--crt-black))" />
    </svg>
  </div>
);

export const PixelMusicNote = ({ className = "", color = "neon-magenta" }: { className?: string; color?: string }) => (
  <div className={`relative ${className}`} style={{ imageRendering: 'pixelated' }}>
    <svg viewBox="0 0 12 16" className="w-full h-full" fill={`hsl(var(--${color}))`}>
      <rect x="8" y="0" width="4" height="2" />
      <rect x="10" y="2" width="2" height="8" />
      <rect x="6" y="10" width="4" height="2" />
      <rect x="4" y="12" width="4" height="2" />
      <rect x="4" y="14" width="4" height="2" />
      <rect x="2" y="12" width="2" height="4" />
    </svg>
  </div>
);

export const PixelDivider = ({ className = "" }: { className?: string }) => (
  <div className={`w-full h-4 ${className}`} style={{ imageRendering: 'pixelated' }}>
    <div className="flex justify-center items-center gap-2">
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i} 
          className="w-4 h-4"
          style={{ 
            backgroundColor: `hsl(var(--${['radical-red', 'arcade-orange', 'electric-yellow', 'lime-green', 'cyber-blue', 'neon-magenta'][i % 6]}))` 
          }} 
        />
      ))}
    </div>
  </div>
);
