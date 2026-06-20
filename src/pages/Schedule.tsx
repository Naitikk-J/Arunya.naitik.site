import { useState, useEffect, useRef } from 'react';
import { MainNavigation } from '@/components/ui/MainNavigation';
import { CRTOverlay } from '@/components/CRTOverlay';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Trophy, Star, Gamepad2, Calendar, Clock, MapPin, Zap } from 'lucide-react';
import { useResponsive } from '@/hooks/use-responsive';
import { GlitchText } from '@/components/GlitchText';

// --- Types ---
type Level = {
  id: number;
  title: string;
  date: string; // e.g., "FEB 21"
  description: string;
  color: string;
  icon: React.ReactNode;
  events: Array<{
    time: string;
    title: string;
    location: string;
    type: 'MAIN' | 'BATTLE' | 'WORKSHOP' | 'FUN';
  }>;
};

// --- Data ---
const LEVELS: Level[] = [
  {
    id: 1,
    title: 'LEVEL 1: Opening Events',
    date: 'FEB 21',
    description: 'The journey begins here.',
    color: '#BC13FE',
    icon: <Gamepad2 className="w-8 h-8" />,
    events: [
      { time: '02:00 PM', title: 'RASHTRAAY', location: 'SAC', type: 'MAIN' },
      { time: '02:00 PM', title: 'Code Carnival 2026', location: 'SH 12', type: 'BATTLE' },
      { time: '02:00 PM', title: 'StartUp Shark Tank', location: 'NR 2', type: 'WORKSHOP' },
      { time: '06:00 PM', title: 'Navjot Ahuja Performance', location: 'Stage Ground', type: 'MAIN' },
    ]
  },
  {
    id: 2,
    title: 'LEVEL 2: Band Performance',
    date: 'FEB 22',
    description: 'Insert coin to continue.',
    color: '#BC13FE', // Yellow
    icon: <Star className="w-8 h-8" />,
    events: [
      { time: '09:00 AM', title: 'CASE 001: REOPENED', location: 'SAC', type: 'BATTLE' },
      { time: '10:00 AM', title: 'Beyond the Problems', location: 'SH 2', type: 'BATTLE' },
      { time: '11:00 AM', title: 'Ashubhashan Pratiyogita', location: 'Conclave Center', type: 'FUN' },
      { time: '01:00 PM', title: 'AI Meets Electronic', location: 'SH 12', type: 'WORKSHOP' },
      { time: '01:00 PM', title: 'Logic & Laughs', location: 'SAC', type: 'FUN' },
      { time: '02:00 PM', title: 'Comic Clash', location: 'Colloquium', type: 'FUN' },
      { time: '02:00 PM', title: 'Goblet Of Fire', location: 'SH 1', type: 'BATTLE' },
      { time: '03:00 PM', title: 'IETE Event', location: 'SH 6', type: 'WORKSHOP' },
      { time: '06:00 PM', title: 'Bandish Performance', location: 'Stage Ground', type: 'MAIN' },
    ]
  },
  {
    id: 3,
    title: 'LEVEL 3: DJ Night',
    date: 'FEB 23',
    description: 'Defeat the final challenge.',
    color: '#BC13FE',
    icon: <Trophy className="w-8 h-8" />,
    events: [
      { time: '10:00 AM', title: 'Lafz-e-Bayan', location: 'Conclave Centre', type: 'FUN' },
      { time: '10:00 AM', title: 'Trade Mark', location: 'SH 12', type: 'BATTLE' },
      { time: '10:00 AM', title: 'PlayFit Arena', location: 'SAC', type: 'FUN' },
      { time: '02:00 PM', title: 'Essay Writing', location: 'SH 4', type: 'FUN' },
      { time: '04:00 PM', title: 'CLOSING CEREMONY', location: 'Main Stage', type: 'MAIN' },
      { time: '06:00 PM', title: 'DJ Performance', location: 'Stage Ground', type: 'MAIN' },
    ]
  },
];

// --- Components ---


const RetroCharacter = ({ targetX }: { targetX: number }) => {
  return (
    <motion.div
      className="absolute bottom-[24px] z-20 pointer-events-none"
      initial={{ left: 0 }}
      animate={{ left: targetX }}
      transition={{ type: "spring", stiffness: 120, damping: 12, mass: 0.8 }}
      style={{ translateX: '-50%' }}
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        {/* Simple CSS Pixel Character */}
        <motion.div
          className="w-full h-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{
            y: { duration: 0.6, repeat: Infinity, ease: "easeOut" },
            rotate: { duration: 0.6, repeat: Infinity, ease: "linear" }
          }}
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
            <rect x="20" y="20" width="60" height="60" fill="#BC13FE" stroke="white" strokeWidth="4" />
            {/* Eyes */}
            <rect x="35" y="40" width="10" height="10" fill="black" />
            <rect x="55" y="40" width="10" height="10" fill="black" />
            {/* Mouth */}
            <rect x="35" y="65" width="30" height="5" fill="black" />
            {/* Antennas */}
            <path d="M20 50 L10 40" stroke="white" strokeWidth="4" />
            <path d="M80 50 L90 40" stroke="white" strokeWidth="4" />
            <circle cx="10" cy="40" r="3" fill="#ff00ff" />
            <circle cx="90" cy="40" r="3" fill="#ff00ff" />
          </svg>
        </motion.div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/50 blur-sm rounded-full animate-pulse" />
      </div>
    </motion.div>
  );
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-02-21T00:00:00');

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="text-center font-press-start text-white mt-12 mb-16 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[200%] bg-neon-purple/10 blur-3xl pointer-events-none" />
      <h3 className="text-sm md:text-lg text-neon-pink mb-6 tracking-widest animate-pulse drop-shadow-[0_0_5px_#ff00ff]">
        <GlitchText text="FEST DAY COUNTDOWN:" />
      </h3>
      <div className="flex justify-center gap-2 md:gap-8 text-lg md:text-3xl text-[#BC13FE] drop-shadow-[0_0_10px_#BC13FE]">
        <div className="flex flex-col items-center">
          <span className="bg-black/40 border border-white/10 rounded px-2 py-1 md:px-3 md:py-2">{format(timeLeft.days)}</span>
          <span className="text-white/50 text-[8px] md:text-[10px] mt-2">DAYS</span>
        </div>
        <span className="self-start mt-2">:</span>
        <div className="flex flex-col items-center">
          <span className="bg-black/40 border border-white/10 rounded px-2 py-1 md:px-3 md:py-2">{format(timeLeft.hours)}</span>
          <span className="text-white/50 text-[8px] md:text-[10px] mt-2">HRS</span>
        </div>
        <span className="self-start mt-2">:</span>
        <div className="flex flex-col items-center">
          <span className="bg-black/40 border border-white/10 rounded px-2 py-1 md:px-3 md:py-2">{format(timeLeft.minutes)}</span>
          <span className="text-white/50 text-[8px] md:text-[10px] mt-2">MINS</span>
        </div>
        <span className="self-start mt-2">:</span>
        <div className="flex flex-col items-center">
          <span className="bg-black/40 border border-white/10 rounded px-2 py-1 md:px-3 md:py-2 text-neon-yellow">{format(timeLeft.seconds)}</span>
          <span className="text-white/50 text-[8px] md:text-[10px] mt-2">SECS</span>
        </div>
      </div>
    </div>
  );
};


const Schedule = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [characterX, setCharacterX] = useState<number>(0);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const levelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();

  useEffect(() => {
    // Initial position
    updateCharacterPosition(selectedLevel);
    window.addEventListener('resize', () => updateCharacterPosition(selectedLevel));
    return () => window.removeEventListener('resize', () => updateCharacterPosition(selectedLevel));
  }, [selectedLevel]);

  const updateCharacterPosition = (id: number) => {
    if (levelRefs.current[id - 1] && containerRef.current) {
      const rect = levelRefs.current[id - 1]?.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      if (rect) {
        // Position relative to the container
        const relativeX = rect.left - containerRect.left + rect.width / 2;
        setCharacterX(relativeX);
      }
    }
  };

  const currentLevelData = LEVELS.find(l => l.id === selectedLevel);

  return (
    <div className="min-h-screen bg-[#05010D] text-white overflow-hidden relative font-press-start">
      <MainNavigation />
      <CRTOverlay />

      {/* Animated Backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(188,19,254,0.1),transparent_70%)]" />
        {/* Moving Stars */}
        <div className="absolute inset-0 animate-[pulse_4s_infinite]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.1 }} />
      </div>

      {/* Audio Toggle */}
      <button
        onClick={() => setIsAudioOn(!isAudioOn)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-2 bg-black/50 border border-white/20 rounded hover:bg-white/10 transition group backdrop-blur-sm"
      >
        {isAudioOn ? <Volume2 className="w-4 h-4 text-neon-green" /> : <VolumeX className="w-4 h-4 text-white/50 group-hover:text-white" />}
        <span className="text-[10px] text-white/70 group-hover:text-white">RETRO CHIPTUNE</span>
      </button>

      <div className="pt-24 md:pt-36 pb-12 px-2 md:px-4 max-w-7xl mx-auto relative z-10">




        {/* Header */}
        <div className="text-center mb-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.08)_0%,transparent_70%)] pointer-events-none" />

          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <GlitchText text="SCHEDULE" />
          </h1>

          <div className="h-0.5 w-16 md:w-24 bg-primary mx-auto shadow-[0_0_10px_#BC13FE]" />

          <p className="text-[9px] sm:text-[10px] md:text-xs text-neon-blue tracking-[0.3em] mt-4 uppercase opacity-80 font-share-tech">
            // SELECT_LEVEL_TO_START
          </p>
        </div>

        {/* Level Timeline */}
        <div className="mb-16 relative py-10" ref={containerRef}>

          {/* The "Floor" Line - Desktop Only */}
          <div className="hidden md:block absolute top-[138px] left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#BC13FE] to-transparent shadow-[0_0_20px_#BC13FE]" />
          <div className="hidden md:block absolute top-[138px] left-0 w-full h-20 bg-gradient-to-b from-[#BC13FE]/20 to-transparent blur-xl pointer-events-none" />

          {/* Vertical Line - Mobile Only */}
          <div className="md:hidden absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-transparent via-[#BC13FE] to-transparent shadow-[0_0_20px_#BC13FE]" />

          {/* Character - Desktop Only (Horizontal movement logic) */}
          <div className="hidden md:block">
            <RetroCharacter targetX={characterX} />
          </div>

          {/* Level Nodes */}
          <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-16 md:gap-32 relative z-10 py-12 px-4">
            {LEVELS.map((level, index) => (
              <div
                key={level.id}
                ref={el => levelRefs.current[index] = el}
                onClick={() => setSelectedLevel(level.id)}
                className={`group flex flex-col items-center gap-6 cursor-pointer min-w-[120px] transition-all duration-300 relative ${selectedLevel === level.id ? 'scale-110 z-20' : 'opacity-60 hover:opacity-100 grayscale hover:grayscale-0'}`}
              >
                {/* Hover Glow Background */}
                <div className="absolute -inset-4 bg-gradient-to-t from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                {/* Floating Icon/Platform */}
                <div className="relative">
                  <div className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl border-4 bg-[#0D0221] shadow-2xl transition-all duration-300 group-hover:-translate-y-2`}
                    style={{
                      borderColor: level.color,
                      boxShadow: selectedLevel === level.id ? `0 0 30px ${level.color}, inset 0 0 20px ${level.color}40` : `0 0 10px ${level.color}40`
                    }}
                  >
                    <div style={{ color: level.color }} className="group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_currentColor] scale-75 md:scale-100">
                      {level.icon}
                    </div>
                  </div>

                  {/* Platform Base */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[120%] h-4 bg-black/50 blur-sm rounded-full" />

                  {/* Connector line to floor */}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full w-[2px] h-[36px] transition-all duration-500`}
                    style={{
                      background: `linear-gradient(to bottom, ${level.color}, transparent)`,
                      opacity: selectedLevel === level.id ? 1 : 0.3
                    }}
                  />
                </div>

                {/* Text Label */}
                <div className="text-center mt-8 transition-transform duration-300 group-hover:scale-105">
                  <div className="text-[10px] text-white/50 mb-2 tracking-widest uppercase">{level.date}</div>
                  <div className={`text-[10px] md:text-xs font-bold whitespace-nowrap px-4 py-2 rounded-lg bg-black/80 border transition-colors duration-300`}
                    style={{
                      color: selectedLevel === level.id ? level.color : 'white',
                      borderColor: selectedLevel === level.id ? level.color : 'rgba(255,255,255,0.1)',
                      boxShadow: selectedLevel === level.id ? `0 0 15px ${level.color}40` : 'none'
                    }}>
                    {level.title.split(': ')[1]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Level Details */}
        <AnimatePresence mode="wait">
          {currentLevelData && (
            <motion.div
              key={currentLevelData.id}
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-[#120822]/90 border backdrop-blur-xl p-4 md:p-10 rounded-2xl relative overflow-hidden group hover:border-white/30 transition-colors duration-500"
                style={{ borderColor: `${currentLevelData.color}60`, boxShadow: `0 0 50px -20px ${currentLevelData.color}40` }}
              >
                {/* Decorative Corner Effects */}
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <Zap className="w-12 h-12 text-white/5 rotate-12" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10 border-b border-white/10 pb-4 md:pb-8 relative z-10">
                  <div>
                    <h2 className="text-2xl md:text-4xl mb-3 drop-shadow-[0_0_10px_currentColor]" style={{ color: currentLevelData.color }}>
                      {currentLevelData.title}
                    </h2>
                    <p className="text-xs md:text-sm text-white/60 font-share-tech tracking-wider uppercase">
                                    // {currentLevelData.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-neon-yellow border border-neon-yellow/30 px-4 py-2 rounded-lg bg-black/50 shadow-[0_0_15px_rgba(255,231,55,0.1)]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{currentLevelData.date}</span>
                  </div>
                </div>

                <div className="grid gap-4 relative z-10">
                  {currentLevelData.events.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative flex flex-col md:flex-row md:items-center justify-between p-3 md:p-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300 group/item hover:translate-x-2"
                    >
                      {/* Hover bar on left */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />

                      <div className="flex items-start gap-5 mb-3 md:mb-0">
                        <div className="text-sm text-neon-cyan font-bold min-w-[80px] md:min-w-[90px] flex items-center gap-2 py-1 px-2 rounded bg-black/20 border border-white/5">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                        <div>
                          <div className="text-sm md:text-lg font-bold group-hover/item:text-neon-pink transition-colors drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
                            {event.title}
                          </div>
                          <div className="text-[10px] md:text-xs text-white/40 flex items-center gap-1.5 mt-1.5 uppercase tracking-wide">
                            <MapPin className="w-3 h-3 text-white/30" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <div className={`self-start md:self-center text-[10px] font-bold uppercase px-3 py-1.5 rounded border opacity-80 shadow-[0_0_10px_rgba(0,0,0,0.2)]
                                        ${event.type === 'MAIN' ? 'text-neon-purple border-neon-purple bg-neon-purple/10' :
                          event.type === 'BATTLE' ? 'text-neon-red border-neon-red bg-neon-red/10' :
                            event.type === 'FUN' ? 'text-neon-green border-neon-green bg-neon-green/10' : 'text-blue-400 border-blue-400 bg-blue-400/10'}
                                    `}>
                        {event.type}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Countdown />

      </div>
    </div>
  );
};

export default Schedule;
