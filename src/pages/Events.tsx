import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainNavigation } from '@/components/ui/MainNavigation';
import { Button } from '@/components/ui/button';
import { events as staticEvents } from '../data/events';
import { Calendar, Clock, MapPin, Trophy, Users, Timer, Info, Lightbulb, Code, Music, Palette, Gamepad2, Mic, PenTool, Brain, Zap, Rocket, Smile, Theater, Loader2 } from 'lucide-react';
import { GlitchText } from '@/components/GlitchText';
import { eventApi } from '@/lib/api';
import { toast } from 'sonner';
import { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const Events = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [dbEvents, setDbEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await eventApi.getEvents();
                // API returns { success, message, data: { events: [...] } }
                // axios wraps body in response.data, so events are at response.data.data.events
                const eventsData = response.data?.data?.events || response.data?.events || response.data || [];
                // Ensure eventsData is highly compatible with the UI
                const finalEvents = Array.isArray(eventsData) && eventsData.length > 0
                    ? eventsData.map((e: any) => ({
                        ...e,
                        
                        title: e.title || e.name || 'Untitled Event',
                        type: e.type || e.category || 'Event',
                        club: e.club || 'Aarunya',
                        tags: e.tags || [],
                        time: e.time || 'TBA',
                        date: e.date || 'TBA',
                        venue: e.venue || 'TBA',
                        description: e.description || '',
                    }))
                    : staticEvents; // Fallback to static if empty or error
                setDbEvents(finalEvents);
            } catch (error) {
                console.error('Fetch events error:', error);
                setDbEvents(staticEvents); // Fallback
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const categories = ['All', 'Technical', 'Cultural', 'Competitions'];

    const getCategory = (type: string) => {
        const lowerType = type.toLowerCase();
        if (['technical', 'coding', 'hackathon', 'technical & research', 'technical competition', 'logic', 'interactive'].some(t => lowerType.includes(t))) {
            return 'Technical';
        }
        if (['cultural', 'poetry', 'shayari', 'wellness', 'literary', 'essay', 'music', 'dance', 'comedy', 'entertainment'].some(t => lowerType.includes(t))) {
            return 'Cultural';
        }
        if (['competition', 'game', 'puzzle', 'sports', 'motorsport', 'drift', 'adventure'].some(t => lowerType.includes(t))) {
            return 'Competitions';
        }
        return 'Technical';
    };

    const getIcon = (type: string, club: string) => {
        const lowerType = type.toLowerCase();
        const lowerClub = club.toLowerCase();

        if (lowerClub.includes('music')) return <Music className="w-12 h-12 text-[#FFE737]" />; // Yellow
        if (lowerClub.includes('dance')) return <Users className="w-12 h-12 text-[#FF0099]" />; // Pink
        if (lowerClub.includes('hackerrank') || lowerType.includes('coding')) return <Code className="w-12 h-12 text-[#00fff9]" />; // Cyan
        if (lowerType.includes('innovation') || lowerType.includes('project')) return <Lightbulb className="w-12 h-12 text-[#FFE737]" />;
        if (lowerType.includes('puzzle') || lowerType.includes('logic')) return <Brain className="w-12 h-12 text-[#BC13FE]" />; // Purple
        if (lowerType.includes('game') || lowerType.includes('drift')) return <Gamepad2 className="w-12 h-12 text-[#39FF14]" />; // Green
        if (lowerType.includes('poetry') || lowerType.includes('essay')) return <PenTool className="w-12 h-12 text-[#FF0099]" />;
        if (lowerClub.includes('comedy')) return <Smile className="w-12 h-12 text-[#FFE737]" />;

        return <Zap className="w-12 h-12 text-primary" />;
    };

    const filteredEvents =
        selectedCategory === 'All'
            ? dbEvents
            : dbEvents.filter((e) => getCategory(e.type || '') === selectedCategory);

    return (
        <div className="min-h-screen bg-[#05010D] text-white">
            <MainNavigation />

            {/* Animated Backgrounds - Glowing Stars */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(188,19,254,0.1),transparent_70%)]" />
                {/* Moving Stars */}
                <div className="absolute inset-0 animate-[pulse_4s_infinite]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.1 }} />
            </div>




            {/* HEADER */}
            <div className="relative pt-24 md:pt-36 pb-12 text-center px-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.08)_0%,transparent_70%)] pointer-events-none" />

                <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    <GlitchText text="EVENTS SCHEDULE" />
                </h1>

                <div className="h-0.5 w-16 md:w-24 bg-primary mx-auto shadow-[0_0_10px_#BC13FE]" />

                <p className="mt-4 text-[9px] sm:text-[10px] md:text-xs font-share-tech text-white/50 uppercase max-w-xl mx-auto tracking-[0.2em]">
          // EXPLORE TECHNICAL, CULTURAL & COMPETITIVE EVENTS
                </p>
            </div>

            {/* CATEGORY FILTER */}
            <div className="relative z-10 py-6 mb-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <div className="flex flex-wrap justify-center gap-2 md:gap-4 bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(188,19,254,0.1)]">
                            {categories.map((c) => {
                                const isActive = selectedCategory === c;
                                return (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedCategory(c)}
                                        className={`relative px-6 py-2 md:px-8 md:py-3 text-sm md:text-base tracking-widest font-mono transition-colors duration-300 z-[1] ${isActive ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeCategory"
                                                className="absolute inset-0 bg-[#BC13FE] rounded-xl z-[-1]"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 drop-shadow-md">{c.toUpperCase()}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-24">
                {/* EVENTS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 text-[#BC13FE] animate-spin" />
                            <p className="font-mono text-[#BC13FE] animate-pulse">SYNCING WITH DATABASE...</p>
                        </div>
                    ) : filteredEvents.map((e, index) => (
                        <motion.div
                            key={e.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-500 overflow-hidden"
                        >
                            {/* Icon */}
                            <div className="mb-6 relative z-10 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                                {getIcon(e.type, e.club)}
                            </div>

                            {/* Title */}
                            <h3 className="relative z-10 text-3xl sm:text-4xl font-sans mb-4 leading-none text-white tracking-wide transition-colors duration-300">
                                {e.title}
                            </h3>

                            {/* Meta Info */}
                            <div className="relative z-10 text-sm font-mono text-[#BC13FE] mb-6 tracking-wider uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                {e.date} • {e.time.split('-')[0]}
                            </div>

                            {/* Description */}
                            <p className="relative z-10 text-white/60 text-sm mb-8 leading-relaxed font-mono line-clamp-3 max-w-[90%]">
                                {e.description}
                            </p>

                            {/* Details Button */}
                            <div className="mt-auto w-full relative z-10">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-[#BC13FE]/20 hover:bg-[#BC13FE] text-white border border-[#BC13FE]/50 hover:border-[#BC13FE] font-sans text-xl py-6 rounded-xl tracking-wider shadow-[0_0_15px_rgba(188,19,254,0.1)] hover:shadow-[0_0_25px_rgba(188,19,254,0.6)] transition-all duration-300 group-hover:scale-[1.02]">
                                            DETAILS
                                        </Button>
                                    </DialogTrigger>

                                    {/* DIALOG CONTENT */}
                                    <DialogContent className="bg-[#0D001A]/95 backdrop-blur-xl border-2 border-[#BC13FE]/30 text-white w-[90%] sm:max-w-md rounded-2xl shadow-[0_0_50px_rgba(188,19,254,0.2)] p-6">
                                        <DialogHeader className="text-left space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Badge className="bg-[#00fff9]/10 text-[#00fff9] border border-[#00fff9]/50 font-sans text-[10px] rounded-sm px-2 py-0.5">{e.type}</Badge>
                                                <span className="text-[#BC13FE] font-mono text-[10px]">{e.id}</span>
                                            </div>
                                            <DialogTitle className="text-3xl font-sans text-white leading-none tracking-wide pt-2">
                                                {e.title}
                                            </DialogTitle>
                                            <DialogDescription className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                                                Organized by <span className="text-[#00fff9]">{e.club}</span>
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4 py-4">
                                            {/* Meta Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2 hover:border-[#00fff9]/30 transition-colors">
                                                    <h4 className="text-[10px] font-mono text-[#BC13FE] uppercase tracking-widest">When</h4>
                                                    <div className="space-y-1 font-mono text-[11px]">
                                                        <div className="flex items-center gap-2 text-white/90">
                                                            <Calendar className="w-3 h-3 text-[#00fff9]" />
                                                            <span>{e.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-white/90">
                                                            <Clock className="w-3 h-3 text-[#00fff9]" />
                                                            <span>{e.time}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2 hover:border-[#00fff9]/30 transition-colors">
                                                    <h4 className="text-[10px] font-mono text-[#BC13FE] uppercase tracking-widest">Where</h4>
                                                    <div className="font-mono text-[11px] flex items-center gap-2 text-white/90">
                                                        <MapPin className="w-3 h-3 text-[#00fff9]" />
                                                        <span>{e.venue}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {e.prizePool && (
                                                <div className="bg-[#FFE737]/10 border border-[#FFE737]/30 p-3 rounded-xl flex items-center justify-between">
                                                    <h4 className="text-[10px] font-mono text-[#FFE737] uppercase tracking-widest flex items-center gap-2">
                                                        <Trophy className="w-3 h-3" />
                                                        Prize Pool
                                                    </h4>
                                                    <p className="text-lg font-sans text-white font-bold">₹{e.prizePool}</p>
                                                </div>
                                            )}

                                            <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                                                <h4 className="text-[10px] font-mono text-[#BC13FE] uppercase tracking-widest">Description</h4>
                                                <p className="text-[11px] text-white/70 leading-relaxed font-mono max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                                                    {e.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {e.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#00fff9] border border-[#00fff9]/20">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            {/* <Button onClick={() => navigate('/register')} className="w-full bg-gradient-to-r from-[#00fff9] to-[#00fff9]/80 text-black hover:brightness-110 font-sans text-base py-6 rounded-xl tracking-widest shadow-[0_0_20px_rgba(0,255,249,0.3)] hover:shadow-[0_0_30px_rgba(0,255,249,0.5)] transition-all transform hover:scale-[1.02] border-0">
                        REGISTER NOW
                      </Button> */}
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-2xl font-sans text-white/30">NO EVENTS FOUND</p>
                        <Button onClick={() => setSelectedCategory('All')} variant="link" className="text-[#BC13FE] mt-4 font-mono">
                            Reset Filters
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Events;
