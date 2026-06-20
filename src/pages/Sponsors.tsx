import { MainNavigation } from '@/components/ui/MainNavigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlitchText } from '@/components/GlitchText';

const Sponsors = () => {
    const tiers = [
        {
            title: 'TITLE SPONSORS',
            description: 'PRIMARY POWER SOURCES FOR THE FESTIVAL GRID.',
            icon: '',
            level: 'PLATINUM',
            sponsors: [
                { name: 'TECH CORP', contribution: '500,000 XP' },
                { name: 'FUTURE INC', contribution: '500,000 XP' },
            ],
        },
        // {
        //     title: 'GOLD SPONSORS',
        //     description: 'BOOSTERS THAT KEEP THE NEON RUNNING ALL NIGHT.',
        //     icon: '⭐',
        //     level: 'GOLD',
        //     sponsors: [
        //         { name: 'INNOVATE LTD', contribution: '250,000 XP' },
        //         { name: 'DIGITAL DYNAMICS', contribution: '250,000 XP' },
        //         { name: 'NEXUS LABS', contribution: '250,000 XP' },
        //     ],
        // },
        // {
        //     title: 'COMMUNITY PARTNERS',
        //     description: 'FRIENDS OF THE FEST AND LOCAL COLLABORATORS.',
        //     icon: '🤝',
        //     level: 'SILVER',
        //     sponsors: [
        //         { name: 'LOCAL CAFE', contribution: '50,000 XP' },
        //         { name: 'CAMPUS STORE', contribution: '50,000 XP' },
        //     ],
        // },
    ];

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'PLATINUM':
                return 'bg-gradient-to-r from-primary to-secondary text-black';
            case 'GOLD':
                return 'bg-secondary text-black';
            case 'SILVER':
                return 'bg-white/20 text-white';
            default:
                return 'bg-primary text-black';
        }
    };

    return (
        <div className="min-h-screen bg-[#05010D] text-white font-orbitron selection:bg-primary selection:text-black">
            <MainNavigation />

            {/* Animated Backgrounds - Glowing Stars */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(188,19,254,0.1),transparent_70%)]" />
                <div className="absolute inset-0 animate-[pulse_4s_infinite]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.1 }} />
            </div>

            <div className="content-scale">



                {/* HEADER */}
                <div className="relative pt-24 md:pt-36 pb-16 md:pb-20 text-center px-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.08)_0%,transparent_70%)] pointer-events-none" />

                    <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <GlitchText text="SPONSORS" />
                    </h1>

                    <div className="h-0.5 w-16 md:w-24 bg-primary mx-auto shadow-[0_0_10px_#BC13FE]" />

                    <p className="mt-6 text-[9px] sm:text-[10px] md:text-xs font-share-tech text-muted-foreground uppercase opacity-60 max-w-3xl mx-auto tracking-[0.25em] sm:tracking-[0.4em]">
            // THE ALLIANCES POWERING AARUNYA 2026
                    </p>
                </div>

                {/* CONTENT */}
                <div className="container mx-auto px-4 sm:px-6 pb-32">
                    <div className="space-y-14">
                        {tiers.map((tier, idx) => (
                            <div key={tier.title} className="group">
                                <div className="relative bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                    <div className="grid grid-cols-1 lg:grid-cols-12">
                                        {/* LEFT */}
                                        <div className="lg:col-span-4 p-6 sm:p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-white/5">
                                            <Badge
                                                className={`${getLevelColor(
                                                    tier.level
                                                )} font-bold tracking-widest text-[11px] sm:text-[12px] rounded-none px-3 py-1 mb-6 inline-block`}
                                            >
                                                TIER_0{idx + 1}
                                            </Badge>

                                            <div className="text-4xl sm:text-5xl mb-6 drop-shadow-[0_0_20px_rgba(188,19,254,0.4)]">
                                                {tier.icon}
                                            </div>

                                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-4">
                                                {tier.title}
                                            </h2>

                                            <p className="font-share-tech text-xs sm:text-sm text-white/40 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                                                {tier.description}
                                            </p>
                                        </div>

                                        {/* RIGHT */}
                                        <div className="lg:col-span-8 p-5 sm:p-8">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {tier.sponsors.map((sponsor) => (
                                                    <div
                                                        key={sponsor.name}
                                                        className="relative p-5 sm:p-6 bg-black/40 border border-white/5 rounded-lg hover:border-primary/40 hover:bg-black/60 transition-all overflow-hidden"
                                                    >
                                                        <div
                                                            className="absolute inset-0 opacity-10"
                                                            style={{
                                                                backgroundImage:
                                                                    'linear-gradient(rgba(188, 19, 254, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(188, 19, 254, 0.2) 1px, transparent 1px)',
                                                                backgroundSize: '20px 20px',
                                                            }}
                                                        />

                                                        <div className="relative z-10 space-y-3">
                                                            <div className="text-lg sm:text-xl font-bold">
                                                                {sponsor.name}
                                                            </div>

                                                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                                                <span className="uppercase tracking-[0.25em] text-white/30">
                                                                    Contribution
                                                                </span>
                                                                <span className="font-share-tech text-secondary font-bold">
                                                                    {sponsor.contribution}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-20 text-center px-4">
                        <div className="relative bg-[#0D0221]/60 backdrop-blur-xl border-2 border-white/5 rounded-xl p-8 sm:p-12 overflow-hidden">
                            <div className="absolute inset-0 opacity-10" />

                            <div className="relative z-10">
                                <div className="text-4xl sm:text-5xl mb-6"></div>

                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-4">
                                    BECOME A SPONSOR
                                </h3>

                                <p className="font-share-tech text-xs sm:text-sm md:text-base text-white/40 uppercase tracking-[0.2em] sm:tracking-[0.3em] max-w-xl mx-auto mb-8">
                                    JOIN THE ALLIANCE AND POWER THE NEXT GENERATION OF INNOVATION
                                </p>

                                <Button className="bg-primary text-black px-8 sm:px-10 py-5 sm:py-6 tracking-[0.25em] font-bold">
                                    CONTACT US
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
        </div>
    );
};

export default Sponsors;
