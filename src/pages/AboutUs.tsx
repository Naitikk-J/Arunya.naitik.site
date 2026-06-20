import { MainNavigation } from '@/components/ui/MainNavigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import { GlitchText } from '@/components/GlitchText';

const teamGroups = [
    {
        role: 'TEAM LEAD',
        icon: '👑',
        members: [
            { name: 'Viraj Gupta', link: 'https://www.linkedin.com/in/viraj-gupta-ok/' }
        ]
    },
    {
        role: 'FRONTEND DEVELOPERS',
        icon: '⚡',
        members: [
            { name: 'Naitik Jain', link: 'https://www.linkedin.com/in/naitik-jain-9290b8324' },
            { name: 'Nihari Shrivastava', link: 'https://www.linkedin.com/in/nihari-shrivastava-878739279' },
            { name: 'Nemish Nagaria', link: 'https://www.linkedin.com/in/nemish-nagaria-555198313' }
        ]
    },
    {
        role: 'UI/UX DESIGNERS',
        icon: '🎨',
        members: [
            { name: 'Shruti Gupta', link: 'https://in.linkedin.com/in/shruti-gupta-200734340' }
        ]
    },
    {
        role: 'BACKEND DEVELOPERS',
        icon: '🔧',
        members: [
            { name: 'Sanchit Jain', link: 'https://linkedin.com/in/lnSanchit' },
            { name: 'Pulastya Bhagwat', link: 'https://www.linkedin.com/in/pulastya-bhagwat/' },
        ]
    }
];

const technologies = [
    'REACT',
    'TYPESCRIPT',
    'TAILWIND',
    'VITE',
    'GSAP',
    'FRAMER_MOTION',
    'PIXEL_FONTS',
    'THREE.JS',
];


const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#05010D] text-white font-orbitron selection:bg-primary selection:text-black overflow-x-hidden">
            <MainNavigation />

            {/* Animated Backgrounds - Glowing Stars */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(188,19,254,0.1),transparent_70%)]" />
                <div className="absolute inset-0 animate-[pulse_4s_infinite]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.1 }} />
            </div>

            <div className="content-scale">
                {/* HEADER */}
                <div className="relative pt-24 md:pt-36 pb-0 text-center px-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.08)_0%,transparent_70%)] pointer-events-none" />

                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            <GlitchText text="MEET THE TEAM" />
                        </h1>

                        <div className="h-0.5 w-16 md:w-24 bg-primary mx-auto shadow-[0_0_10px_#BC13FE]" />

                        <p className="mt-1 text-[9px] sm:text-[10px] md:text-xs font-share-tech text-white/50 uppercase max-w-xl mx-auto tracking-[0.2em]">
                // DOCUMENTATION ON THE CREATORS AND THE FEST
                        </p>
                    </motion.div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 pb-10 max-w-5xl">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2"
                    >
                        {/* {stats.map((stat) => (
                            <motion.div
                                key={stat.label}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(188, 19, 254, 0.05)" }}
                                className="bg-[#0D0221]/60 border border-white/10 rounded-lg p-4 text-center hover:border-primary/40 transition-all duration-300"
                            >
                                <div className="text-xl sm:text-2xl font-black text-primary mb-1 drop-shadow-[0_0_8px_rgba(188,19,254,0.4)]">
                                    {stat.value}
                                </div>
                                <div className="font-share-tech text-[9px] sm:text-[10px] tracking-[0.2em] text-white/40">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))} */}
                    </motion.div>

                    {/* TEAM */}
                    <div className="mb-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-0"
                        >
                            <Badge className="bg-primary/90 text-black text-[9px] tracking-widest px-2 py-0.5 mb-2">
                                THE_ARCHITECTS
                            </Badge>

                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-10px" }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {teamGroups.map((group) => (
                                <motion.div
                                    key={group.role}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="bg-[#0D0221]/60 border border-white/10 rounded-xl p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group flex flex-col h-full"
                                >
                                    <div className="relative w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
                                        <div className="text-2xl sm:text-3xl grayscale group-hover:grayscale-0 transition-all">{group.icon}</div>
                                    </div>

                                    <h3 className="text-sm font-black mb-4 text-primary tracking-widest uppercase border-b border-white/10 pb-2">
                                        {group.role}
                                    </h3>

                                    <div className="flex flex-col gap-3 flex-grow justify-center">
                                        {group.members.map((member) => (
                                            <a
                                                key={member.name}
                                                href={member.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white hover:text-[#00ffff] font-bold text-sm sm:text-base tracking-wider transition-colors flex items-center justify-center gap-2 group/member"
                                            >
                                                <span className="opacity-0 group-hover/member:opacity-100 transition-opacity text-primary">›</span>
                                                {member.name}
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* MARQUEE - Full Width */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="w-full relative bg-black/40 border-y border-white/10 py-6 mb-12 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#05010D] via-transparent to-[#05010D] z-10 pointer-events-none" />
                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex gap-8 md:gap-16 px-4 md:px-8">
                                {technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="text-base sm:text-lg text-white/30 font-black tracking-widest hover:text-primary transition-colors duration-300 cursor-default"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </motion.div>



                <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                <style
                    dangerouslySetInnerHTML={{
                        __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
          `,
                    }}
                />
            </div>
        </div>
    );
};

export default AboutUs;
