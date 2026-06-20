import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';
import { MainNavigation } from '@/components/ui/MainNavigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Shield, Users, Trophy, BookOpen, AlertCircle, Clock, Smartphone, Info } from 'lucide-react';
import { GlitchText } from '@/components/GlitchText';

export const Guidelines = () => {
    const { isMobile } = useResponsive();
    const [activeSection, setActiveSection] = useState('general');

    const sections = [
        { id: 'general', title: 'GENERAL RULES', icon: <BookOpen className="w-5 h-5 md:w-5 md:h-5" /> },
        { id: 'tech', title: 'MITS-DU STUDENTS', icon: <Users className="w-5 h-5 md:w-5 md:h-5" /> },
        { id: 'creative', title: 'EXTERNAL PARTICIPANTS', icon: <Shield className="w-5 h-5 md:w-5 md:h-5" /> },
        { id: 'conduct', title: 'PRIZE POOL', icon: <Trophy className="w-5 h-5 md:w-5 md:h-5" /> }
    ];

    const guidelines = {
        general: [
            'All kinds of intoxicants, unauthorised objects, and weapons are strictly prohibited on the MITS-DU campus.',
            'Excess items such as handbags, carry bags, etc. must be validated by security.',
            'Team Aarunya may record photos and videos for promotional usage for the fest.',
            'Team Aarunya are not responsible for the loss, theft, or damage of personal belongings under any circumstances.',
            'Team Aarunya reserves the right to deny entry or remove any individual without prior notice on finding them doing anything suspicious or unauthorised activity.',
            'Event schedules, artists performance, and timings are subjected to differ due to unavoidable circumstances.'
        ],
        tech: [
            'For Entry & Identification:\n• A valid college ID card is mandatory for entry and validation by the security.\n• Under any circumstances, Team Aarunya will not permit the entry without a valid ID.',
            'Regarding Pass and Fee:\n• Aarunya-26 is a paid event and the passes would be provided by Team Aarunya and through website.\n• Passes are non-transferable and non-refundable.\n• Discounted pricing may be applicable for MITS-DU students, only if it is announced through official channels.',
            'Regarding Discipline during Aarunya-26:\n• All students must follow the college code of conduct and maintain the integrity of Aarunya-26.\n• Any misconduct may result in immediate removal from the venue and further disciplinary action against the preparator.',
            'Regarding Timings of the festival:\n• Entry is allowed only during the specified entry time.\n• Late entry may not be permitted.\n• The schedule and event timings would be provided by Team Aarunya, prior to the event day.',
            'Regarding Physical Damage to the MITS-DU Campus:\n• Any damage to college or event property will be recoverable from the student.\n• Failure to do so would result in legal action against the preparator.'
        ],
        creative: [
            'Entry & Identification:\n• A valid college ID card and a government-issued ID are mandatory for the identification.\n• Entry is allowed only for registered and verified pass holders.\n• The entry of external students are permitted only from a designated entrance.',
            'Regarding Pass / Fee:\n• Aarunya-26 is a paid event.\n• Passes are non-transferable and non-refundable.\n• Pricing for external participants may differ from internal students.\n• Any purchase made aside from Team Aarunya/Aarunya website are null and void.',
            'Regarding Security:\n• All attendees will be subjected to mandatory security checks.\n• Restricted items are strictly prohibited.',
            'Regarding Discipline:\n• Any misconduct will result in immediate removal from the venue. Failure to do so may result in legal actions against the individual.\n• Team Aarunya holds no responsibility for the actions of other external participants.',
            'Regarding Re-entry:\n• Under any circumstances, re-entry would not be provided once a participant exits the venue.\n• Entry after 6:00 PM would be denied for all participants.',
            'Regarding Accommodations:\n• They would only be provided to the individuals with Accommodation pass\n• The individuals must have their government IDs, college IDs and Guardian permission.\n• Their accommodations would be arranged in the MITS-DU hostel.'
        ],
        conduct: [
            'The total prize pool of Aarunya-26 is ₹1,00,000',
            'It is subjected to change with respect to the minimum participation of 1,000 participants across all competitions.',
            'In case, the minimum required participation is not achieved, the prize pool will be revised proportionately for every event.',
            'The revised prize pool, if applicable, will be decided solely by the Organizing Committee of AARUNYA-26.',
            'The distribution of the prize money across events will be on the closing ceremony, by the respected guest of honour.',
            'All decisions taken by the organizing committee regarding the prize pool and its distribution shall be final and binding.'
        ]
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#05010D] relative overflow-x-hidden">
            {/* Animated Backgrounds - Glowing Stars */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(188,19,254,0.1),transparent_70%)]" />
                {/* Moving Stars */}
                <div className="absolute inset-0 animate-[pulse_4s_infinite]" style={{
                    backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    opacity: 0.1
                }} />
            </div>

            {/* CRT Scanlines Overlay */}
            <div className="fixed inset-0 pointer-events-none z-10" style={{
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05) 1px, transparent 1px, transparent 2px)',
                backgroundSize: '100% 2px'
            }} />

            {/* Content */}
            <div className="relative z-20 pt-24 md:pt-36 pb-12 container mx-auto px-4 max-w-5xl">
                <MainNavigation />

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-xl md:text-3xl lg:text-5xl font-bold mb-4 text-white drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]" style={{ fontFamily: '"Press Start 2P", monospace' }}>
                        <GlitchText text="GUIDELINES" />
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-[#00ffff] font-mono text-xs md:text-sm opactiy-80">
                        <span>RULES_OF_ENGAGEMENT.EXE</span>
                    </div>
                </motion.div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {sections.map((section) => (
                        <motion.button
                            key={section.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "relative px-3 py-2 md:px-5 md:py-3 rounded-lg border transition-all duration-200 flex items-center gap-2 backdrop-blur-sm",
                                activeSection === section.id
                                    ? "bg-[#ff00ff]/20 border-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.3)]"
                                    : "bg-black/40 border-white/10 hover:border-[#00ffff]/50 hover:bg-[#00ffff]/10"
                            )}
                        >
                            <div className={cn(
                                "transition-colors duration-200",
                                activeSection === section.id ? "text-[#ff00ff]" : "text-white/70"
                            )}>
                                {section.icon}
                            </div>
                            <span className={cn(
                                "font-bold text-[10px] md:text-xs tracking-wide",
                                activeSection === section.id ? "text-white" : "text-white/60"
                            )} style={{ fontFamily: '"Press Start 2P", monospace' }}>
                                {section.title}
                            </span>

                            {activeSection === section.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-[#ff00ff]/10 to-transparent rounded-lg"
                                />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -10 }}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        {guidelines[activeSection as keyof typeof guidelines].map((rule, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ backgroundColor: "rgba(0, 255, 255, 0.03)" }}
                                className="group relative bg-[#120822]/60 border border-white/5 p-5 rounded-xl backdrop-blur-sm overflow-hidden hover:border-[#00ffff]/20 transition-colors"
                            >
                                <div className="relative z-10 flex gap-3">
                                    <div className="shrink-0 mt-0.5">
                                        <div className="w-6 h-6 rounded bg-[#00ffff]/5 flex items-center justify-center border border-[#00ffff]/10 group-hover:border-[#00ffff]/50 transition-colors duration-300">
                                            <span className="text-[#00ffff] font-bold font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        {rule.includes('\n') ? (
                                            <>
                                                <h3 className="text-white/90 font-bold text-sm md:text-base mb-1">{rule.split('\n')[0]}</h3>
                                                <div className="space-y-1">
                                                    {rule.split('\n').slice(1).map((line, i) => (
                                                        <p key={i} className="text-white/60 text-xs md:text-sm leading-relaxed pl-3 border-l border-white/5">
                                                            {line.replace('• ', '')}
                                                        </p>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-white/70 text-xs md:text-sm leading-relaxed font-sans">
                                                {rule.replace(/^\d+\.⁠ ⁠/, '')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Quick Tips Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {[
                        { icon: <Clock className="w-5 h-5 text-[#00ffff]" />, title: "TIMING", desc: "Arrive 30 mins early" },
                        { icon: <Smartphone className="w-5 h-5 text-[#ff00ff]" />, title: "DEVICES", desc: "Keep on silent mode" },
                        { icon: <Info className="w-5 h-5 text-[#00ffff]" />, title: "SUPPORT", desc: "Help desk at entrance" },
                    ].map((tip, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center gap-3 hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                                {tip.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-white/80 font-press-start text-[10px] mb-0.5">{tip.title}</h4>
                                <p className="text-white/40 text-[10px]">{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Guidelines;