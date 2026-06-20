import { MainNavigation } from '@/components/ui/MainNavigation';
import { motion } from 'framer-motion';
import { GlitchText } from '@/components/GlitchText';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-[#05010D] text-white font-orbitron selection:bg-primary selection:text-black overflow-x-hidden">
            <MainNavigation />

            <div className="content-scale">
                {/* HEADER */}
                <div className="relative pt-32 md:pt-48 pb-12 text-center px-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.08)_0%,transparent_70%)] pointer-events-none" />

                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tight mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            <GlitchText text="TERMS & CONDITIONS" />
                        </h1>

                        <div className="h-0.5 w-16 md:w-24 bg-primary mx-auto shadow-[0_0_10px_#BC13FE]" />

                        <p className="mt-4 text-[9px] sm:text-[10px] md:text-xs font-share-tech text-white/50 uppercase max-w-xl mx-auto tracking-[0.2em]">
                            PARTICIPATION GUIDELINES AND RULES
                        </p>
                    </motion.div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 pb-20 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#0D0221]/60 border border-white/10 rounded-xl p-6 sm:p-10 hover:border-primary/20 transition-colors duration-500 space-y-8"
                    >
                        <div className="font-share-tech text-white/80 leading-relaxed space-y-6 text-sm md:text-base">
                            <p>
                                By registering for or attending Aarunya-26, you agree to the following terms:
                            </p>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">1. Entry & Identification</h3>
                                <ul className="list-none space-y-2 pl-4 border-l-2 border-primary/30">
                                    <li>• Valid college ID is mandatory for all participants.</li>
                                    <li>• External participants must carry both college ID and government-issued ID.</li>
                                    <li>• Entry without valid identification will be denied under all circumstances.</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">2. Pass Validity</h3>
                                <ul className="list-none space-y-2 pl-4 border-l-2 border-primary/30">
                                    <li>• Passes are non-transferable and non-refundable.</li>
                                    <li>• Passes are valid only for the individual whose name appears on the registration.</li>
                                    <li>• Any pass purchased from unauthorized sources is considered invalid.</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">3. Security & Conduct</h3>
                                <ul className="list-none space-y-2 pl-4 border-l-2 border-primary/30">
                                    <li>• All attendees are subject to mandatory security checks.</li>
                                    <li>• Possession of intoxicants, weapons, or prohibited items will result in immediate removal.</li>
                                    <li>• Misconduct or violation of college/event rules may lead to expulsion and legal action.</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">4. Event Modifications</h3>
                                <ul className="list-none space-y-2 pl-4 border-l-2 border-primary/30">
                                    <li>• Event schedules, artist lineups, and timings are subject to change due to unforeseen circumstances.</li>
                                    <li>• Team Aarunya holds the right to modify or cancel events without prior notice.</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">5. Liability</h3>
                                <ul className="list-none space-y-2 pl-4 border-l-2 border-primary/30">
                                    <li>• Team Aarunya is not responsible for loss, theft, or damage of personal belongings.</li>
                                    <li>• Any damage caused to college or event property will be recoverable from the individual involved.</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">6. Right to Admission</h3>
                                <p>
                                    Team Aarunya reserves the right to deny entry or remove any individual found engaging in suspicious, unauthorized, or inappropriate activity.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
        </div>
    );
};

export default TermsAndConditions;
