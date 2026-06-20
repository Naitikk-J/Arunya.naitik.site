import { MainNavigation } from '@/components/ui/MainNavigation';
import { motion } from 'framer-motion';
import { GlitchText } from '@/components/GlitchText';

const ReturnAndRefund = () => {
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
                            <GlitchText text="RETURN & REFUND POLICY" />
                        </h1>

                        <div className="h-0.5 w-16 md:w-24 bg-primary mx-auto shadow-[0_0_10px_#BC13FE]" />

                        <p className="mt-4 text-[9px] sm:text-[10px] md:text-xs font-share-tech text-white/50 uppercase max-w-xl mx-auto tracking-[0.2em]">
                            REFUND GUIDELINES
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
                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">1. No Refunds</h3>
                                <p>All registrations and pass purchases for Aarunya-26 are final.</p>
                                <p>Passes are non-refundable and non-exchangeable, regardless of:</p>
                                <ul className="list-none space-y-2 pl-4 border-l-2 border-primary/30">
                                    <li>• Non-attendance</li>
                                    <li>• Event rescheduling</li>
                                    <li>• Personal reasons</li>
                                    <li>• Disqualification due to rule violation</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">2. Event Cancellation</h3>
                                <ul className="list-none space-y-2 pl-4 border-l-2 border-primary/30">
                                    <li>• In the unlikely event of complete cancellation of Aarunya-26 by the organizers, refund decisions (if any) will be communicated officially.</li>
                                    <li>• Transaction or platform charges are non-refundable.</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">3. Invalid Purchases</h3>
                                <p>
                                    Purchases made outside official Team Aarunya channels or the Aarunya website are null and void and are not eligible for refund.
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

export default ReturnAndRefund;
