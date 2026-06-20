import React from 'react';

export const CRTOverlay: React.FC = () => {
  return (
    <>
      {/* CRT Scanlines Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)',
            backgroundSize: '100% 4px',
          }}
        />
        {/* Vignette effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] pointer-events-none" />
        
        {/* Scanline animation overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] animate-scanline" />
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          background: linear-gradient(to bottom, transparent 0%, rgba(188, 19, 254, 0.5) 50%, transparent 100%);
          height: 10px;
          width: 100%;
          animation: scanline 8s linear infinite;
        }
      `}</style>
    </>
  );
};
