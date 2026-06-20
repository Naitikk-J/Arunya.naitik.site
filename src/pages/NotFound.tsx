import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white font-pixel p-6">
      <div className="max-w-md w-full border-4 border-red-600 bg-black p-10 relative overflow-hidden">
        {/* Glitch Overlay */}
        <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />
        
        <div className="relative z-10 text-center space-y-8">
          <div className="inline-block px-4 py-1 bg-red-600 text-black text-xs font-bold mb-4 animate-bounce">
            ERROR_404
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-red-600 tracking-tighter glow-red">
            LOST_NODE
          </h1>
          
          <div className="space-y-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
              The transmission at <span className="text-red-400">"{location.pathname}"</span> has been intercepted or does not exist in this sector.
            </p>
            
            <div className="h-1 w-full bg-red-600/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-red-600 animate-[scan_1.5s_linear_infinite]" />
            </div>
          </div>

          <Link 
            to="/" 
            className="inline-block w-full py-4 bg-white text-black font-bold text-xs uppercase hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0px_#444] active:translate-y-[2px] active:shadow-none"
          >
            RETURN_TO_BASE
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { left: -33%; }
          100% { left: 100%; }
        }
        .glow-red {
          text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
        }
      `}} />
    </div>
  );
};

export default NotFound;
