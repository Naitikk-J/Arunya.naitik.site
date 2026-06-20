import { useState } from "react";
import { RetroButton } from "./ui/retro-button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useResponsive } from "../hooks/use-responsive";
import { useKidcoreSounds } from "./ui/SoundEffects";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { playSound } = useKidcoreSounds();

  const navLinks = ["EVENTS", "TIMELINE", "GALLERY", "CONTACT"];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isMobile ? 'px-2 py-2' : isTablet ? 'px-3 py-3' : 'px-4 py-3'} bg-kidcore-cream/90 backdrop-blur-sm border-b-4 border-kidcore-blue shadow-[0_4px_0px_var(--kidcore-pink)]`}>
      <div className={`max-w-6xl mx-auto flex items-center justify-between ${isMobile ? 'gap-2' : ''}`}>
        {/* Logo */}
        <a href="#" className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
          <img 
            src="/aarunya-logo.svg" 
            alt="Aarunya" 
            className={`pixelated ${isMobile ? 'w-8 h-8' : isTablet ? 'w-9 h-9' : 'w-10 h-10'}`}
            style={{ 
              filter: "drop-shadow(2px 2px 0px var(--kidcore-blue))",
            }}
          />
          <span className={`font-press-start ${isMobile ? 'text-[8px]' : isTablet ? 'text-[9px]' : 'text-[10px]'} text-kidcore-black hidden sm:block tracking-wider`}>
            AARUNYA
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`/${link.toLowerCase()}`}
              onClick={() => playSound('click')}
            >
              <RetroButton variant="white" className={`text-[8px] font-pixel ${isMobile ? 'w-20' : isTablet ? 'w-22' : 'w-24'}`}>
                {link}
              </RetroButton>
            </a>
          ))}
          <RetroButton 
            variant="default" 
            className={`text-[10px] font-pixel ${isMobile ? 'w-24' : isTablet ? 'w-26' : 'w-28'} ${isMobile ? 'ml-2' : 'ml-4'}`}
            onClick={() => playSound('buttonPress')}
          >
            REGISTER
          </RetroButton>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
           <button 
            onClick={() => {
              setIsOpen(!isOpen);
              playSound('buttonPress');
            }}
            className={`kidcore-btn p-2 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center`}
           >
             {isOpen ? <X size={isMobile ? 16 : 20} /> : <Menu size={isMobile ? 16 : 20} />}
           </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-full left-0 right-0 bg-kidcore-cream border-b-4 border-kidcore-blue ${isMobile ? 'p-4' : 'p-6'} md:hidden flex flex-col gap-4 shadow-[0_10px_0px_var(--kidcore-pink)]`}
          >
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`/${link.toLowerCase()}`}
              onClick={() => {
                setIsOpen(false);
                playSound('click');
              }}
            >
              <RetroButton variant="white" className={`w-full font-pixel ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                {link}
              </RetroButton>
            </a>
          ))}
            <RetroButton 
              variant="default" 
              className={`w-full font-pixel ${isMobile ? 'text-[10px]' : 'text-xs'} ${isMobile ? 'mt-1' : 'mt-2'}`}
              onClick={() => playSound('buttonPress')}
            >
              REGISTER NOW
            </RetroButton>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
