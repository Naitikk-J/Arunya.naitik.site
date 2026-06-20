import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { eventRegistrationApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import { GlitchText } from '@/components/GlitchText';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface EventRegistration {
    _id: string;
    eventId: string | {
        _id: string;
        name: string;
        club?: string;
        category?: string;
        date?: string;
        venue?: string;
        fee?: number;
    };
    participantId: string;
    participantType: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    createdAt: string;
    updatedAt: string;
}

export default function MyRegistrations() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchRegistrations(user.email);
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchRegistrations = async (emailToFetch: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await eventRegistrationApi.getMyRegistrationsByEmail({ email: emailToFetch });
            const data = response.data?.data?.registrations || response.data?.registrations || response.data || [];
            setRegistrations(Array.isArray(data) ? data : []);
        } catch (err: unknown) {
            console.error('Error fetching registrations:', err);
            const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
            const msg = axiosErr.response?.data?.message || axiosErr.message || 'Failed to fetch registrations';
            setError(msg);
            toast.error(msg);
            setRegistrations([]);
        } finally {
            setLoading(false);
        }
    };

    const getEventName = (eventId: EventRegistration['eventId']): string => {
        if (typeof eventId === 'object' && eventId?.name) {
            return eventId.name;
        }
        return typeof eventId === 'string' ? eventId : 'Unknown Event';
    };

    const getEventDetails = (eventId: EventRegistration['eventId']) => {
        if (typeof eventId === 'object') {
            return eventId;
        }
        return null;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
            default: return 'text-white/50 bg-white/10 border-white/20';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400';
            case 'pending': return 'text-yellow-400';
            case 'failed': return 'text-red-400';
            case 'refunded': return 'text-blue-400';
            default: return 'text-white/50';
        }
    };

    return (
        <div className="min-h-screen bg-[#05010D] text-white font-vt323 selection:bg-[#ff00ff] selection:text-black overflow-x-hidden">
            <div className="content-scale">
                <main className="min-h-screen flex flex-col items-center pt-20 lg:pt-32 px-4 sm:px-8 pb-20">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-4xl"
                    >
                        {/* Header */}
                        <motion.div variants={itemVariants} className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4" style={{
                                fontFamily: '"Press Start 2P", "Courier New", monospace',
                                color: '#fff5ff',
                                textShadow: '0 0 15px #8a6c8a, 2px 2px 0 #880088'
                            }}>
                                <GlitchText text="MY REGISTRATIONS" />
                            </h1>
                            <div className="h-0.5 w-32 mx-auto mb-6" style={{
                                background: 'linear-gradient(to right, #ff00ff, #00ffff)',
                                boxShadow: '0 0 15px #ff00ff, 0 0 10px #00ffff'
                            }} />
                            <p className="text-sm text-[#00ffff] uppercase tracking-[0.3em]">
                                View your registered events
                            </p>
                        </motion.div>

                        {/* Results */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-6"
                        >
                                {error && (
                                    <div className="p-4 bg-red-900/20 border border-red-500 rounded-xl text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {!loading && registrations.length === 0 && !error && (
                                    <div className="text-center py-16">
                                        <div className="text-6xl mb-4">📭</div>
                                        <p className="text-white/50 text-lg font-vt323 uppercase tracking-widest">
                                            No registrations found
                                        </p>
                                        <p className="text-white/30 text-sm mt-2">
                                            Register for events to see them here
                                        </p>
                                        <Button
                                            onClick={() => navigate('/unified-registration')}
                                            className="mt-6 h-10 px-6 rounded-full font-bold uppercase tracking-wider"
                                            style={{
                                                background: 'linear-gradient(135deg, #00ffff, #0088ff)',
                                                boxShadow: '0 0 15px rgba(0,255,255,0.3)'
                                            }}
                                        >
                                            Browse Events
                                        </Button>
                                    </div>
                                )}

                                {loading && (
                                    <div className="flex flex-col items-center py-16">
                                        <div className="w-16 h-16 border-4 border-[#ff00ff]/20 border-t-[#ff00ff] rounded-full animate-spin mb-4" />
                                        <p className="text-white/40 text-sm font-vt323 tracking-widest uppercase">
                                            Fetching registrations...
                                        </p>
                                    </div>
                                )}

                                {!loading && registrations.length > 0 && (
                                    <div className="grid gap-4">
                                        {registrations.map((reg, index) => {
                                            const eventDetails = getEventDetails(reg.eventId);
                                            return (
                                                <motion.div
                                                    key={reg._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="relative p-6 rounded-2xl border border-white/10 bg-black/40 hover:border-[#ff00ff]/30 transition-all"
                                                    style={{
                                                        background: 'linear-gradient(145deg, #1a0a2e 0%, #120830 50%, #0d0520 100%)'
                                                    }}
                                                >
                                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-black text-white mb-2">
                                                                {getEventName(reg.eventId)}
                                                            </h3>
                                                            {eventDetails && (
                                                                <div className="space-y-1 text-sm text-white/50">
                                                                    {eventDetails.club && (
                                                                        <p className="flex items-center gap-2">
                                                                            <span className="text-[#ff00ff]">●</span>
                                                                            {eventDetails.club}
                                                                        </p>
                                                                    )}
                                                                    {eventDetails.date && (
                                                                        <p className="flex items-center gap-2">
                                                                            <span>📅</span>
                                                                            {eventDetails.date}
                                                                        </p>
                                                                    )}
                                                                    {eventDetails.venue && (
                                                                        <p className="flex items-center gap-2">
                                                                            <span>📍</span>
                                                                            {eventDetails.venue}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                            <p className="text-xs text-white/30 mt-2">
                                                                Registered: {new Date(reg.createdAt).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(reg.status)}`}>
                                                                {reg.status}
                                                            </span>
                                                            <span className={`text-xs font-bold uppercase ${getPaymentStatusColor(reg.paymentStatus)}`}>
                                                                Payment: {reg.paymentStatus}
                                                            </span>
                                                            {eventDetails?.fee !== undefined && eventDetails.fee > 0 && (
                                                                <span className="text-lg font-black text-white">
                                                                    ₹{eventDetails.fee}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}

                                {!loading && registrations.length > 0 && (
                                    <div className="text-center pt-8">
                                        <p className="text-white/30 text-sm">
                                            Found {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                )}
                            </motion.div>

                        {/* Back to Events */}
                        <motion.div variants={itemVariants} className="mt-10 text-center">
                            <Button
                                onClick={() => navigate('/unified-registration')}
                                variant="ghost"
                                className="text-white/40 hover:text-white font-bold uppercase tracking-wider"
                            >
                                ← Back to Events
                            </Button>
                        </motion.div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
