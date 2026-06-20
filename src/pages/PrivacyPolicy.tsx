import { MainNavigation } from '@/components/ui/MainNavigation';
import { motion } from 'framer-motion';
import { GlitchText } from '@/components/GlitchText';
import { useResponsive } from '@/hooks/use-responsive';

const PrivacyPolicy = () => {
    const { isMobile } = useResponsive();
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

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
                            <GlitchText text="PRIVACY POLICY" />
                        </h1>

                        <div className="h-0.5 w-16 md:w-24 bg-primary mx-auto shadow-[0_0_10px_#BC13FE]" />

                        <p className="mt-4 text-[9px] sm:text-[10px] md:text-xs font-share-tech text-white/50 uppercase max-w-xl mx-auto tracking-[0.2em]">
                            Last updated: {currentDate}
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
                                Team Aarunya (“we”, “our”, “us”) respects your privacy and is committed to protecting the personal information of all participants attending Aarunya-26.
                            </p>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">1. Information We Collect</h3>
                                <p>We may collect the following information during registration or participation:</p>
                                <ul className="list-none space-y-2 pl-4 border-l-2 border-primary/30">
                                    <li>• Full name</li>
                                    <li>• Email address and phone number</li>
                                    <li>• College name and ID details</li>
                                    <li>• Government-issued ID details (for external participants and accommodation)</li>
                                    <li>• Payment and transaction details (processed via secure third-party gateways)</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">2. Use of Information</h3>
                                <p>Your information is used strictly for:</p>
                                <ul className="list-none space-y-2 pl-4 border-l-2 border-primary/30">
                                    <li>• Event registration and verification</li>
                                    <li>• Entry validation and security purposes</li>
                                    <li>• Accommodation arrangements</li>
                                    <li>• Event communication and updates</li>
                                    <li>• Promotional documentation (photos/videos taken during the fest)</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">3. Data Protection</h3>
                                <p>
                                    All personal data is stored securely and accessed only by authorized members of Team Aarunya. We do not sell, rent, or share personal information with third parties, except when required by law or necessary for event security and operational protocols.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">4. Media Usage</h3>
                                <p>
                                    By attending Aarunya-26, participants grant consent to be photographed or recorded. These images and videos may be used for promotional and archival purposes by Team Aarunya without any compensation.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-primary">5. Policy Updates</h3>
                                <p>
                                    This privacy policy may be updated at any time without prior notice. Continued participation in Aarunya-26 constitutes acceptance of any revised terms.
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

export default PrivacyPolicy;
