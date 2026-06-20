import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRazorpay, calculateAmountWithFee } from '@/hooks/useRazorpay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { motion, Variants } from 'framer-motion';
import { GlitchText } from '@/components/GlitchText';
import { RetroButton } from '@/components/ui/retro-button';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { eventApi, eventRegistrationApi, authApi, referralApi } from '@/lib/api';
import { User } from '@/hooks/useAuth';

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface Registration {
    eventId: string;
    _id?: string;
    id?: string;
}

interface EventAPIResponse {
    id?: string;
    _id?: string;
    name?: string;
    club?: string;
    description?: string;
    category?: string;
    date?: string;
    venue?: string;
    fee?: number;
    requiresPayment?: boolean;
    maxParticipants?: number;
    currentRegistrations?: number;
    isTeamEvent?: boolean;
    teamSize?: {
        min: number;
        max: number;
    };
    registrationCloseTime?: string;
    isActive?: boolean;
    prizePool?: string;
    contactEmail?: string;
    contactPhone?: string;
    createdBy?: string;
}

interface Event {
    id: string;
    _id?: string;
    name: string;
    club: string;
    description?: string;
    category: string;
    date: string;
    venue: string;
    fee: number;
    requiresPayment: boolean;
    maxParticipants?: number;
    currentRegistrations: number;
    isTeamEvent: boolean;
    teamSize?: {
        min: number;
        max: number;
    };
    registrationCloseTime?: string;
    isActive: boolean;
    prizePool?: string;
    contactEmail?: string;
    contactPhone?: string;
    createdBy: string;
}

export default function UnifiedRegistration() {
    const { user, loading: authLoading, signInWithGoogle, signInWithOTP, verifyOTP, signUp, signOut, error: authError } = useAuth();
    const { createOrder, verifyPayment, openPaymentModal, loading: paymentLoading } = useRazorpay();
    const navigate = useNavigate();
    const location = useLocation();

    // State management
    const [step, setStep] = useState<'auth' | 'otp' | 'dashboard' | 'payment' | 'success'>('auth');
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [otpEmail, setOtpEmail] = useState('');
    const [otpToken, setOtpToken] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [signUpData, setSignUpData] = useState({
        enrollment_no: '',
        name: '',
        email: '',
        phone: '',
        branch: '',
        year: ''
    });
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
    const [result, setResult] = useState<unknown>(null);
    const [registration, setRegistration] = useState<any>(null);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [otpCooldown, setOtpCooldown] = useState(0);
    const [referralCode, setReferralCode] = useState<string | null>(null);

    // Persist critical state to sessionStorage to survive page reloads (mobile app switching)
    useEffect(() => {
        const savedState = sessionStorage.getItem('unified_registration_state');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.step) setStep(parsed.step);
                if (parsed.authMode) setAuthMode(parsed.authMode);
                if (parsed.otpEmail) setOtpEmail(parsed.otpEmail);
                if (parsed.otpSent) setOtpSent(parsed.otpSent);
                if (parsed.signUpData) setSignUpData(parsed.signUpData);
                // Don't restore OTP token as it might be expired or user might want to enter fresh
            } catch (e) {
                console.error('Failed to restore state', e);
            }
        }
    }, []);

    useEffect(() => {
        // Only save state if we are in auth/otp flow to avoid clutter/stale data after login
        if (step === 'auth' || step === 'otp') {
            const stateToSave = {
                step,
                authMode,
                otpEmail,
                otpSent,
                signUpData
            };
            sessionStorage.setItem('unified_registration_state', JSON.stringify(stateToSave));
        } else {
            // If we moved past auth, clear the temporary state
            sessionStorage.removeItem('unified_registration_state');
        }
    }, [step, authMode, otpEmail, otpSent, signUpData]);

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

    const inputStyle = {
        backgroundColor: '#120830',
        borderColor: '#44ddff',
        boxShadow: '0 0 6px rgba(0,255,255,0.15)',
        color: '#ffffff'
    };

    // Load events on component mount with retry logic
    useEffect(() => {
        const fetchEvents = async (retries = 3) => {
            try {
                setLoading(true);
                const response = await eventApi.getEvents();
                // API returns { success, message, data: { events: [...] } }
                // axios wraps body in response.data, so events are at response.data.data.events
                const eventsData = response.data?.data?.events || response.data?.events || response.data || [];
                const mappedEvents = Array.isArray(eventsData) ? eventsData.map((e: EventAPIResponse) => ({
                    ...e,
                    id: e.id || e._id || 'unknown',
                    name: e.name || 'Untitled Event',
                    club: e.club || 'Aarunya',
                    description: e.description || '',
                    category: e.category || 'Event',
                    date: e.date || 'TBA',
                    venue: e.venue || 'TBA',
                    fee: typeof e.fee === 'number' ? e.fee : 0,
                    requiresPayment: e.requiresPayment || false,
                    currentRegistrations: e.currentRegistrations || 0,
                    isTeamEvent: e.isTeamEvent || false,
                    teamSize: e.teamSize || { min: 1, max: 1 },
                    isActive: e.isActive !== undefined ? e.isActive : true,
                    maxParticipants: e.maxParticipants || 100,
                    prizePool: e.prizePool || '',
                    contactEmail: e.contactEmail || '',
                    contactPhone: e.contactPhone || '',
                    createdBy: e.createdBy || '',
                    registrationCloseTime: e.registrationCloseTime || '',
                })) : [];
                setEvents(mappedEvents);
                if (mappedEvents.length === 0 && retries > 0) {
                    setTimeout(() => fetchEvents(retries - 1), 1500);
                }
            } catch (error: unknown) {
                console.error('Error fetching events:', error);
                if (retries > 0) {
                    setTimeout(() => fetchEvents(retries - 1), 1500);
                } else {
                    toast.error('Failed to fetch events. Please refresh the page.');
                    setEvents([]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Handle OTP cooldown timer
    useEffect(() => {
        if (otpCooldown <= 0) return;
        const timer = setInterval(() => {
            setOtpCooldown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [otpCooldown]);

    // Handle post-authentication redirect
    useEffect(() => {
        if (user) {
            if (step === 'auth' || step === 'otp') {
                toast.success('Sign in successful!');
                setStep('dashboard');
            }
            // Load user data from DB (only if user has a real ID, not temporary)
            const loadUserData = async () => {
                if (!user?.id) return;

                // Skip loading registrations for users with temporary IDs
                if (user.id.startsWith('temp-')) {
                    return;
                }

                try {
                    const response = await eventRegistrationApi.getMyEventRegistrations({
                        participantId: user.id,
                        participantType: user.category || 'CollegeStudent'
                    });
                    const registrations = response.data?.data?.registrations || response.data?.registrations || response.data || [];
                    setRegisteredEventIds(Array.isArray(registrations) ? registrations.map((r: Registration) => r.eventId) : []);
                } catch (err) {
                    // Error loading user data - silently continue
                    console.debug('Could not load user registrations:', err);
                }

                // Fetch referral code only if not already loaded (e.g., on page reload)
                if (referralCode === null) {
                    try {
                        // Check if we have an auth token before making the request
                        const authToken = localStorage.getItem('authToken');
                        if (!authToken) {
                            console.debug('No auth token found in localStorage, skipping referral code fetch');
                            return;
                        }

                        const refResponse = await referralApi.getCodeByParticipant(user.id, authToken);
                        console.log('Referral code response (from useEffect):', refResponse);
                        const code = refResponse.data?.data?.code || refResponse.data?.code;
                        setReferralCode(code || null);
                    } catch (err) {
                        console.debug('Could not load referral code from useEffect:', err);
                        // Log more details if it's a 401
                        if (err && typeof err === 'object' && 'response' in err) {
                            const axiosErr = err as any;
                            if (axiosErr.response?.status === 401) {
                                console.warn('Unauthorized: Auth token may be missing or invalid');
                            }
                        }
                    }
                }
            };
            loadUserData();
        }
    }, [user, step, referralCode]);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSendOTP = async () => {
        setLoading(true);
        setError(null);
        const emailToUse = authMode === 'register' ? signUpData.email : otpEmail;
        if (!emailToUse || !isValidEmail(emailToUse)) {
            toast.error('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const data = await signInWithOTP(emailToUse);
            toast.success('OTP Sent Successfully');
            setOtpSent(true);
            setOtpEmail(emailToUse);
            setResult(data);
        } catch (err: unknown) {
            console.error('Error sending OTP:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
            const status = (err instanceof Error && 'response' in err) ? (err as any).response?.status : null;
            const msg = (err instanceof Error && 'response' in err) ? (err as any).response?.data?.message || errorMessage : errorMessage;

            // Handle rate limiting (429)
            if (status === 429) {
                setOtpCooldown(60); // 60 second cooldown
                setError('Too many attempts. Please wait before trying again.');
                toast.error('Too many attempts. Please wait 60 seconds before trying again.');
            } else {
                setError(msg);
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndRegister = async () => {
        if (!otpToken || otpToken.length < 4) {
            toast.error('Please enter a valid OTP');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const userData = await verifyOTP(
                otpEmail,
                otpToken,
                authMode === 'register' ? signUpData : {}
            );

            // Construct a complete user object for use in the component
            const normalizeUserData = (data: any): User => {
                const userObj = data?.student || data?.participant || data?.user || data;
                const id = userObj?.id || userObj?._id || userObj?.uid || userObj?.participantId || data?.id || data?._id || `temp-${Date.now()}`;
                const category = userObj?.category || userObj?.participantType || (authMode === 'register' ? 'CollegeStudent' : userObj?.type || 'User');

                return {
                    id,
                    _id: userObj?._id || id,
                    uid: userObj?.uid || id,
                    name: userObj?.name || signUpData?.name || '',
                    email: userObj?.email || otpEmail,
                    aarunyaId: userObj?.aarunyaId,
                    category: category as any,
                    participantType: category,
                    enrollment_no: userObj?.enrollment_no || userObj?.enrollmentNumber || signUpData?.enrollment_no,
                    created_at: userObj?.created_at || userObj?.createdAt
                };
            };

            // If requiresOnboarding, user has no participant record yet
            if (userData?.requiresOnboarding) {
                if (authMode === 'register') {
                    toast.success('Account verified! You can now register for events.');
                    const normalizedUser = normalizeUserData(userData);
                    setResult(normalizedUser);
                    setStep('dashboard');
                } else {
                    // Login mode but user doesn't have a participant record
                    toast.error('No account found. Please switch to REGISTER to create your account.');
                    setError('No account found for this email. Please register first.');
                    return;
                }
            } else {
                toast.success('Access Granted');
                const normalizedUser = normalizeUserData(userData);
                setResult(normalizedUser);

                // Extract token from userData response
                const token = userData?.token;
                console.log('Token from verifyOTP:', token ? 'Present' : 'Missing');

                setStep('dashboard');

                // Fetch referral code with token directly from response
                if (token && normalizedUser?.id && !normalizedUser.id.startsWith('temp-')) {
                    try {
                        const refResponse = await referralApi.getCodeByParticipant(normalizedUser.id, token);
                        console.log('Referral code response:', refResponse);
                        const code = refResponse.data?.data?.code || refResponse.data?.code;
                        setReferralCode(code || null);
                    } catch (err) {
                        console.debug('Could not load referral code:', err);
                        setReferralCode(null);
                    }
                }
            }
        } catch (err: unknown) {
            console.error('Error verifying OTP:', err);
            const errorMessage = err instanceof Error ? err.message : 'Verification failed';
            const msg = (err instanceof Error && 'response' in err) ? (err as any).response?.data?.message || errorMessage : errorMessage;
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);
        try {
            await signUp(signUpData);
            toast.success('Sign up successful!');
            setStep('dashboard');
        } catch (err: unknown) {
            console.error('Error signing up:', err);
            const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
            setError(errorMessage);
            toast.error('Sign up failed: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEventSelection = (eventId: string) => {
        setSelectedEventId(prev => prev === eventId ? null : eventId);
    };

    const handleProceedToPayment = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!user) throw new Error('User not authenticated');
            if (!user.id) {
                toast.error('Your account is incomplete. Please log out and register again.');
                throw new Error('No participant ID found. Please log out and re-register with all your details.');
            }

            // Check if user has a temporary ID (meaning they haven't completed registration yet)
            if (user.id.startsWith('temp-')) {
                const msg = 'Your registration is not complete. Please complete your profile setup first.';
                setError(msg);
                toast.error(msg);
                setLoading(false);
                return;
            }

            if (!selectedEventId) throw new Error('No event selected');
            const selectedEventData = events.find(e => e.id === selectedEventId);
            if (!selectedEventData) throw new Error('Event not found');

            const totalAmount = selectedEventData.fee;

            if (totalAmount === 0) {
                // Free events - register directly
                await handleRegistration(selectedEventId);
                toast.success('Registration successful!');
                setStep('success');
            } else {
                // Paid events - Register and get payment details from backend
                const participantType = user.category || 'CollegeStudent';

                // Log the payload for debugging
                console.log('Sending registration payload:', {
                    eventId: selectedEventId,
                    participantId: user.id,
                    participantType
                });

                const regResponse = await eventRegistrationApi.registerForEvent({
                    eventId: selectedEventId,
                    participantId: user.id,
                    participantType
                });

                const responseData = regResponse.data?.data || regResponse.data;
                const regData = responseData?.registration;
                const paymentDetails = responseData?.payment;

                setRegistration(regData);
                setPaymentData(paymentDetails);

                if (paymentDetails?.orderId) {
                    // Logic matching Register.tsx: show summary before modal
                    setStep('payment');
                } else {
                    // No payment details returned, registration is already confirmed
                    toast.success('Registration successful!');
                    setStep('success');
                }
            }
        } catch (err: unknown) {
            console.error('Error processing payment/registration:', err);
            let backendMsg = 'Process failed';

            if (err instanceof Error) {
                // Check if it's our validation error about invalid ObjectId
                if (err.message.includes('Invalid participant ID')) {
                    backendMsg = 'Your registration is incomplete. Please log out and complete your registration with all required information.';
                    console.warn('Validation error - invalid participant ID:', err.message);
                } else if ('response' in err) {
                    const axiosErr = err as any;
                    // Try multiple paths to get the error message
                    backendMsg = axiosErr.response?.data?.message ||
                        axiosErr.response?.data?.error ||
                        axiosErr.response?.data?.details ||
                        (typeof axiosErr.response?.data === 'string' ? axiosErr.response.data : null) ||
                        axiosErr.message;

                    // Log full error for debugging
                    console.error('Backend error details:', {
                        status: axiosErr.response?.status,
                        data: axiosErr.response?.data,
                        message: backendMsg
                    });
                } else {
                    backendMsg = err.message;
                }
            }

            setError(backendMsg);
            toast.error('Process failed: ' + backendMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleExecutePayment = async () => {
        if (!paymentData || !paymentData.orderId) {
            toast.error('Payment information is missing');
            return;
        }

        setLoading(true);
        try {
            const selectedEventData = events.find(e => e.id === selectedEventId);
            const totalAmount = selectedEventData?.fee || (paymentData.amount / 100);

            // Capture all required values in local variables BEFORE the async callback
            // to avoid React state closure staleness issues
            const capturedEventId = selectedEventId;
            const capturedParticipantId = user?.id;
            const capturedParticipantType = user?.category || 'CollegeStudent';
            const capturedEmail = user?.email;
            const capturedRegId = registration?._id || registration?.id;

            console.log('Payment verification will use:', {
                capturedEventId,
                capturedParticipantId,
                capturedParticipantType,
                capturedEmail,
                capturedRegId,
            });

            await openPaymentModal(
                paymentData.orderId,
                totalAmount,
                paymentData.currency || 'INR',
                'Aarunya MITS',
                `Payment for ${selectedEventData?.name || 'Event'}`,
                async (response: RazorpayResponse) => {
                    try {
                        const verifyResponse = await eventRegistrationApi.verifyPayment({
                            registrationId: capturedRegId,
                            eventId: capturedEventId,
                            participantId: capturedParticipantId,
                            participantType: capturedParticipantType,
                            email: capturedEmail,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        const finalReg = verifyResponse.data?.data?.registration || verifyResponse.data?.registration || verifyResponse.data;
                        setRegistration(finalReg);
                        setRegisteredEventIds(prev => [...new Set([...prev, selectedEventId!])]);

                        toast.success('Payment verified! Registration confirmed.');
                        setStep('success');
                    } catch (err: unknown) {
                        console.error('Error verifying payment:', err);
                        const errMsg = (err instanceof Error && 'response' in err) ? (err as any).response?.data?.message : (err instanceof Error ? err.message : 'Payment verification failed');
                        setError(errMsg);
                        toast.error(errMsg);
                    }
                }
            );
        } catch (err: unknown) {
            console.error('Error initiating payment:', err);
            toast.error('Failed to open payment gateway');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistration = async (eventId: string) => {
        if (!user) throw new Error('User not authenticated');

        // Check if user has a temporary ID (meaning they haven't completed registration yet)
        if (user.id.startsWith('temp-')) {
            throw new Error('Your registration is not complete. Please complete your profile setup first.');
        }

        try {
            const participantType = user.category || 'CollegeStudent';

            console.log('Sending free event registration:', {
                eventId,
                participantId: user.id,
                participantType,
                userId: user
            });

            // Register for event in DB
            await eventRegistrationApi.registerForEvent({
                eventId,
                participantId: user.id,
                participantType
            });

            // Refresh registered events list locally for UI
            setRegisteredEventIds(prev => [...new Set([...prev, eventId])]);

            toast.success('Registration completed!');
        }
        catch (err: unknown) {
            console.error('Error registering for event:', err);
            let msg = 'Registration failed';

            if (err instanceof Error) {
                if (err.message.includes('Invalid participant ID')) {
                    msg = 'Your registration is incomplete. Please log out and complete your registration.';
                } else if ('response' in err) {
                    msg = (err as any).response?.data?.message || err.message;
                } else {
                    msg = err.message;
                }
            }

            toast.error(msg);
            throw err;
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut();
            setStep('auth');
            setAuthMode('login');
            toast.success('Logged out successfully');
        } catch (err: unknown) {
            console.error('Error logging out:', err);
            const errorMessage = err instanceof Error ? err.message : 'Logout failed';
            setError(errorMessage);
            toast.error('Logout failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <div className="min-h-screen bg-[#05010D] flex items-center justify-center">
            <div className="text-white">Loading...</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#05010D] text-white font-vt323 selection:bg-[#ff00ff] selection:text-black overflow-x-hidden">
            <div className="content-scale">
                <main className="min-h-screen flex flex-col lg:flex-row relative">
                    {/* LEFT SIDEBAR - NAVIGATION/STATUS */}
                    <div className="lg:w-1/4 xl:w-1/5 flex flex-col justify-start items-center lg:items-start pt-24 lg:pt-32 px-4 sm:px-8 bg-black/40 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-white/10 lg:sticky lg:top-0 lg:h-screen z-30">
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="w-full h-full flex flex-col gap-6"
                        >
                            <div className="text-center lg:text-left">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4" style={{
                                    fontFamily: '"Press Start 2P", "Courier New", monospace',
                                    color: '#fff5ff',
                                    textShadow: '0 0 15px #8a6c8a, 2px 2px 0 #880088'
                                }}>
                                    <GlitchText text="EVENTS" />
                                </h1>
                                <div className="h-0.5 w-16 mb-6 mx-auto lg:mx-0" style={{
                                    background: 'linear-gradient(to right, #ff00ff, #00ffff)',
                                    boxShadow: '0 0 15px #ff00ff, 0 0 10px #00ffff'
                                }} />

                                {user ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/5 border border-[#ff00ff]/30 rounded-2xl flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#ff00ff] flex items-center justify-center text-xl shadow-[0_0_10px_#ff00ff]">👤</div>
                                            <div>
                                                <div className="text-xs text-white/50 uppercase tracking-widest">Explorer</div>
                                                <div className="text-base font-bold text-[#00ffff]">{user.name}</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <RetroButton
                                                variant={step === 'dashboard' ? 'default' : 'white'}
                                                onClick={() => setStep('dashboard')}
                                                className="w-full justify-start text-sm"
                                            >
                                                Event Catalog
                                            </RetroButton>
                                            <RetroButton
                                                variant="white"
                                                onClick={() => navigate('/my-registrations')}
                                                className="w-full justify-start text-sm"
                                            >
                                                My Registrations
                                            </RetroButton>
                                            <RetroButton
                                                variant="white"
                                                onClick={handleLogout}
                                                className="w-full justify-start text-sm opacity-70 hover:opacity-100"
                                            >
                                                Sign Out
                                            </RetroButton>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm sm:text-base font-vt323 leading-relaxed tracking-wider text-[#00ffff]">
                                        // LOGIN TO REGISTER FOR COMPETITIONS
                                    </p>
                                )}
                            </div>

                            {/* System Status */}
                            <div className="hidden lg:block mt-auto pb-10 w-full pt-8 border-t border-white/10">
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-[#00ff00]/30 transition-all">
                                    <span className="font-vt323 text-[10px] uppercase tracking-[0.2em] text-white/40">Network Status:</span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse shadow-[0_0_8px_#00ff00]" />
                                        <span className="font-vt323 text-[10px] font-bold tracking-widest text-[#00ff00] group-hover:block transition-all">ENCRYPTED_LINK</span>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="flex-1 flex items-start justify-center pt-8 lg:pt-24 px-4 sm:px-10 pb-48 relative overflow-visible">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="w-full max-w-6xl"
                        >
                            {step === 'auth' && (
                                <motion.div
                                    variants={itemVariants}
                                    className="relative p-6 sm:p-8 w-full rounded-2xl"
                                    style={{
                                        background: 'linear-gradient(145deg, #1a0a2e 0%, #120830 50%, #0d0520 100%)',
                                        border: '1.5px solid rgba(255,0,255,0.5)',
                                        boxShadow: '0 0 30px rgba(255,0,255,0.15), 0 0 60px rgba(0,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
                                    }}
                                >
                                    {/* Corner indicators */}
                                    <span className="absolute top-0 left-0 w-4 h-[1.5px] bg-[#00ffff] rounded-full" style={{ boxShadow: '0 0 8px #00ffff' }} />
                                    <span className="absolute top-0 left-0 w-[1.5px] h-4 bg-[#00ffff] rounded-full" style={{ boxShadow: '0 0 8px #00ffff' }} />
                                    <span className="absolute top-0 right-0 w-4 h-[1.5px] bg-[#ff00ff] rounded-full" style={{ boxShadow: '0 0 8px #ff00ff' }} />
                                    <span className="absolute top-0 right-0 w-[1.5px] h-4 bg-[#ff00ff] rounded-full" style={{ boxShadow: '0 0 8px #ff00ff' }} />
                                    <span className="absolute bottom-0 left-0 w-4 h-[1.5px] bg-[#ff00ff] rounded-full" style={{ boxShadow: '0 0 8px #ff00ff' }} />
                                    <span className="absolute bottom-0 left-0 w-[1.5px] h-4 bg-[#ff00ff] rounded-full" style={{ boxShadow: '0 0 8px #ff00ff' }} />
                                    <span className="absolute bottom-0 right-0 w-4 h-[1.5px] bg-[#00ffff] rounded-full" style={{ boxShadow: '0 0 8px #00ffff' }} />
                                    <span className="absolute bottom-0 right-0 w-[1.5px] h-4 bg-[#00ffff] rounded-full" style={{ boxShadow: '0 0 8px #00ffff' }} />

                                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)',
                                        backgroundSize: '4px 4px'
                                    }} />

                                    <div className="relative z-10">
                                        <div className="text-center mb-6">
                                            <h1 className="text-2xl md:text-3xl font-black tracking-tighter mb-4" style={{
                                                fontFamily: '"Press Start 2P", "Courier New", monospace',
                                                color: '#fff5ff',
                                                textShadow: '0 0 15px #8a6c8a, 2px 2px 0 #880088'
                                            }}>
                                                <GlitchText text="AARUNYA 2.0" />
                                            </h1>
                                            <div className="flex justify-center mb-6">
                                                <div className="inline-flex border-2 border-[#ff00ff] rounded-full p-1 bg-black/40">
                                                    <button
                                                        onClick={() => { setAuthMode('login'); setOtpSent(false); }}
                                                        className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${authMode === 'login' ? 'bg-[#ff00ff] text-white shadow-[0_0_10px_#ff00ff]' : 'text-white/50 hover:text-white'}`}
                                                    >
                                                        LOGIN
                                                    </button>
                                                    <button
                                                        onClick={() => { setAuthMode('register'); setOtpSent(false); }}
                                                        className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${authMode === 'register' ? 'bg-[#ff00ff] text-white shadow-[0_0_10px_#ff00ff]' : 'text-white/50 hover:text-white'}`}
                                                    >
                                                        REGISTER
                                                    </button>
                                                </div>
                                            </div>
                                            <h2 className="mb-2 tracking-tight uppercase" style={{
                                                fontFamily: '"Press Start 2P", "Courier New", monospace',
                                                fontSize: '14px',
                                                color: '#ff00ff',
                                                textShadow: '0 0 10px #ff00ff, 2px 2px 0 #880088'
                                            }}>
                                                {authMode === 'login' ? 'ACCESS DASHBOARD' : 'SIGN UP FOR AARUNYA'}
                                            </h2>
                                            <div className="h-0.5 w-full relative overflow-hidden rounded-full" style={{
                                                background: 'linear-gradient(to right, #ff00ff, #00ffff)',
                                                boxShadow: 'inset 0 0 4px #ff00ff, 0 0 8px #00ffff'
                                            }} />
                                        </div>

                                        {error && (
                                            <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm font-vt323">
                                                {error}
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {authMode === 'login' ? (
                                                <div className="space-y-1">
                                                    <div className="flex gap-2 items-center">
                                                        <Input
                                                            type="email"
                                                            value={otpEmail}
                                                            onChange={(e) => setOtpEmail(e.target.value)}
                                                            placeholder="Enter your email"
                                                            className="border-2 font-vt323 text-base h-12 transition-all placeholder:text-white/30 rounded-full px-5 flex-1"
                                                            style={inputStyle}
                                                            required
                                                        />
                                                        <Button
                                                            type="button"
                                                            onClick={handleSendOTP}
                                                            disabled={loading || !isValidEmail(otpEmail) || otpCooldown > 0}
                                                            className="h-12 px-6 rounded-full text-xs font-bold whitespace-nowrap shrink-0 uppercase tracking-widest"
                                                            style={{
                                                                background: (otpCooldown > 0) ? '#666' : isValidEmail(otpEmail) ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#333',
                                                                boxShadow: isValidEmail(otpEmail) && otpCooldown <= 0 ? '0 0 12px rgba(59,130,246,0.5)' : 'none',
                                                                border: 'none',
                                                                fontFamily: '"Press Start 2P", cursive',
                                                                fontSize: '10px'
                                                            }}
                                                        >
                                                            {loading ? '...' : otpCooldown > 0 ? `${otpCooldown}s` : otpSent ? 'RESEND' : 'GET OTP'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex gap-3">
                                                        <Input
                                                            value={signUpData.enrollment_no}
                                                            onChange={(e) => setSignUpData({ ...signUpData, enrollment_no: e.target.value })}
                                                            placeholder="Enrollment No."
                                                            className="border-2 font-vt323 text-base h-12 transition-all placeholder:text-white/30 rounded-full px-5 flex-1"
                                                            style={inputStyle}
                                                            required
                                                        />
                                                        <Input
                                                            value={signUpData.name}
                                                            onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                                                            placeholder="Full Name"
                                                            className="border-2 font-vt323 text-base h-12 transition-all placeholder:text-white/30 rounded-full px-5 flex-1"
                                                            style={inputStyle}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex gap-2 items-center">
                                                            <Input
                                                                type="email"
                                                                value={signUpData.email}
                                                                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                                                placeholder="MITS Email"
                                                                className="border-2 font-vt323 text-base h-12 transition-all placeholder:text-white/30 rounded-full px-5 flex-1"
                                                                style={inputStyle}
                                                                required
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={handleSendOTP}
                                                                disabled={loading || !isValidEmail(signUpData.email) || otpCooldown > 0}
                                                                className="h-12 px-6 rounded-full text-xs font-bold whitespace-nowrap shrink-0"
                                                                style={{
                                                                    background: (otpCooldown > 0) ? '#666' : isValidEmail(signUpData.email) ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#333',
                                                                    boxShadow: isValidEmail(signUpData.email) && otpCooldown <= 0 ? '0 0 12px rgba(59,130,246,0.5)' : 'none',
                                                                    border: 'none'
                                                                }}
                                                            >
                                                                {loading ? '...' : otpCooldown > 0 ? `${otpCooldown}s` : otpSent ? 'RESEND' : 'SEND OTP'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <Input
                                                            type="tel"
                                                            value={signUpData.phone}
                                                            onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                                                            placeholder="Phone"
                                                            className="border-2 font-vt323 text-base h-12 transition-all placeholder:text-white/30 rounded-full px-5 flex-1"
                                                            style={inputStyle}
                                                            required
                                                        />
                                                        <Input
                                                            value={signUpData.branch}
                                                            onChange={(e) => setSignUpData({ ...signUpData, branch: e.target.value })}
                                                            placeholder="Branch"
                                                            className="border-2 font-vt323 text-base h-12 transition-all placeholder:text-white/30 rounded-full px-5 flex-1"
                                                            style={inputStyle}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <Input
                                                    value={otpToken}
                                                    onChange={(e) => setOtpToken(e.target.value)}
                                                    placeholder="Enter 6-digit OTP"
                                                    className="border-2 font-vt323 text-base h-12 transition-all text-center tracking-[1em] placeholder:tracking-normal placeholder:text-white/30 rounded-full px-5"
                                                    style={inputStyle}
                                                    disabled={!otpSent}
                                                    maxLength={6}
                                                />
                                            </div>

                                            <Button
                                                onClick={handleVerifyAndRegister}
                                                disabled={loading || !otpSent || otpToken.length < 4}
                                                className="relative w-full border border-[#ff00ff]/60 text-white font-bold mt-2 uppercase tracking-wider disabled:opacity-50 h-12 rounded-full hover:scale-[1.02] active:scale-95 transition-all"
                                                style={{
                                                    background: 'linear-gradient(135deg, #e600e6, #b300b3)',
                                                    boxShadow: '0 0 20px rgba(255,0,255,0.3)',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {loading ? 'VERIFYING...' : authMode === 'login' ? 'VERIFY & LOGIN' : 'VERIFY & SIGN UP'}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'dashboard' && (
                                <motion.div
                                    variants={itemVariants}
                                    className="relative p-6 sm:p-8 rounded-2xl"
                                    style={{
                                        background: 'linear-gradient(145deg, #1a0a2e 0%, #120830 50%, #0d0520 100%)',
                                        border: '1.5px solid rgba(255,0,255,0.5)',
                                        boxShadow: '0 0 30px rgba(255,0,255,0.15), 0 0 60px rgba(0,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div className="relative z-10">
                                        {/* Corner indicators */}
                                        <span className="absolute top-0 left-0 w-4 h-[1.5px] bg-[#00ffff] rounded-full" style={{ boxShadow: '0 0 8px #00ffff' }} />
                                        <span className="absolute top-0 left-0 w-[1.5px] h-4 bg-[#00ffff] rounded-full" style={{ boxShadow: '0 0 8px #00ffff' }} />
                                        <span className="absolute top-0 right-0 w-4 h-[1.5px] bg-[#ff00ff] rounded-full" style={{ boxShadow: '0 0 8px #ff00ff' }} />
                                        <span className="absolute top-0 right-0 w-[1.5px] h-4 bg-[#ff00ff] rounded-full" style={{ boxShadow: '0 0 8px #ff00ff' }} />
                                        <span className="absolute bottom-0 left-0 w-4 h-[1.5px] bg-[#ff00ff] rounded-full" style={{ boxShadow: '0 0 8px #ff00ff' }} />
                                        <span className="absolute bottom-0 left-0 w-[1.5px] h-4 bg-[#ff00ff] rounded-full" style={{ boxShadow: '0 0 8px #ff00ff' }} />
                                        <span className="absolute bottom-0 right-0 w-4 h-[1.5px] bg-[#00ffff] rounded-full" style={{ boxShadow: '0 0 8px #00ffff' }} />
                                        <span className="absolute bottom-0 right-0 w-[1.5px] h-4 bg-[#00ffff] rounded-full" style={{ boxShadow: '0 0 8px #00ffff' }} />

                                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                                            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)',
                                            backgroundSize: '4px 4px'
                                        }} />

                                        {/* User Info Header */}


                                        <div className="text-center mb-12 relative">
                                            <div className="inline-block relative">
                                                <h2 className="mb-4 tracking-tighter uppercase px-12 py-4" style={{
                                                    fontFamily: '"Press Start 2P", "Courier New", monospace',
                                                    fontSize: 'clamp(16px, 5vw, 24px)',
                                                    color: '#fff',
                                                    textShadow: '0 0 20px rgba(255,0,255,0.8), 0 0 40px rgba(138,43,226,0.4)',
                                                    letterSpacing: '-1px'
                                                }}>
                                                    COMMAND CENTER
                                                </h2>
                                                {/* Decorative elements for header */}
                                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ff00ff]" />
                                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff00ff]" />
                                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ffff]" />
                                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ffff]" />

                                                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ffff] to-transparent shadow-[0_0_15px_#00ffff]" />
                                            </div>
                                            <div className="flex justify-center items-center gap-4 mt-8">
                                                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#ff00ff]/50" />
                                                <p className="text-[10px] text-[#00ffff] uppercase tracking-[0.6em] font-black opacity-90">PROTOCOL INITIALIZED: SELECT EVENT</p>
                                                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#ff00ff]/50" />
                                            </div>
                                        </div>

                                        {!user && (
                                            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl">
                                                <p className="text-yellow-500 text-sm mb-2 font-vt323">Session incomplete. Please re-authenticate for full access.</p>
                                                <Button onClick={handleLogout} size="sm" variant="outline" className="h-8 text-[10px] border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                                                    RE-LOGIN
                                                </Button>
                                            </div>
                                        )}

                                        {user && user.id?.startsWith('temp-') && (
                                            <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/50 rounded-xl">
                                                <p className="text-orange-400 text-sm font-vt323 mb-2">
                                                    <span className="font-black">⚠ Registration Incomplete:</span> Your profile needs to be completed before you can register for events. Please log out and ensure you enter all required information during registration.
                                                </p>
                                                <Button onClick={handleLogout} size="sm" variant="outline" className="h-8 text-[10px] border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-black">
                                                    LOGOUT & RE-REGISTER
                                                </Button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 p-2">
                                            {events.length === 0 && (
                                                <div className="col-span-full text-center py-16 flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 border-4 border-[#ff00ff]/20 border-t-[#ff00ff] rounded-full animate-spin" />
                                                    <p className="text-white/40 text-sm font-vt323 tracking-widest uppercase">{loading ? 'Accessing Secure Database...' : 'No active events found.'}</p>
                                                </div>
                                            )}
                                            {events.map((event) => {
                                                const isRegistered = registeredEventIds.includes(event.id);
                                                const isSelected = selectedEventId === event.id;
                                                return (
                                                    <motion.div
                                                        key={event.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                                        className={`group relative overflow-hidden border-2 rounded-[2.5rem] p-4 sm:p-6 cursor-pointer transition-all duration-300 h-full flex flex-col ${isRegistered
                                                            ? 'border-green-500/30 bg-green-500/5 cursor-not-allowed grayscale-[0.6] opacity-80'
                                                            : isSelected
                                                                ? 'border-[#00ffff] bg-gradient-to-br from-[#00ffff]/15 via-indigo-950/60 to-purple-950/40 shadow-[0_0_50px_rgba(0,255,255,0.25)] ring-1 ring-[#00ffff]/50'
                                                                : 'border-white/10 bg-black/60 hover:border-[#ff00ff]/60 hover:bg-white/[0.03] hover:shadow-[0_0_30px_rgba(255,0,255,0.15)] backdrop-blur-sm'
                                                            }`}
                                                        onClick={() => !isRegistered && handleEventSelection(event.id)}
                                                    >
                                                        {/* Modern glass shine effect on hover */}
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                                                        {isRegistered && (
                                                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px] pointer-events-none">
                                                                <div className="bg-green-500 text-black font-black text-[10px] py-1 px-4 rounded-full uppercase tracking-widest shadow-[0_0_15px_#22c55e]">
                                                                    Already Registered
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="absolute top-0 right-0 px-4 py-1.5 sm:px-5 sm:py-2 rounded-bl-3xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 text-white/40 border-l border-b border-white/10">
                                                            {event.category}
                                                        </div>

                                                        <div className="flex flex-col gap-3 sm:gap-4 h-full relative z-0 mt-2 sm:mt-0">
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-start gap-2 sm:gap-4">
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="text-sm sm:text-lg font-black tracking-tighter text-white leading-tight mb-1 group-hover:text-[#00ffff] transition-colors break-words pr-1 line-clamp-3">
                                                                            {event.name}
                                                                        </h3>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff00ff] shadow-[0_0_5px_#ff00ff] shrink-0" />
                                                                            <p className="text-[10px] sm:text-xs text-[#ff00ff]/80 font-black uppercase tracking-widest truncate">{event.club}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right shrink-0 max-w-[45%]">
                                                                        <div className={`text-lg sm:text-xl font-black ${event.fee === 0 ? 'text-green-400' : 'text-white'}`}>
                                                                            {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
                                                                        </div>
                                                                        {event.prizePool && (
                                                                            <div className="text-[9px] sm:text-[10px] bg-yellow-400/20 text-yellow-400 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-black border border-yellow-400/30 mt-1 inline-block text-right break-words max-w-full">
                                                                                🏆 {event.prizePool}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs sm:text-sm text-white/50 line-clamp-2 leading-relaxed font-medium">
                                                                    {event.description}
                                                                </p>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-auto pt-3 sm:pt-4 border-t border-white/5">
                                                                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-wider overflow-hidden">
                                                                    <span className="text-sm opacity-60 shrink-0">📅</span>
                                                                    <span className="truncate">{event.date}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-wider overflow-hidden">
                                                                    <span className="text-sm opacity-60 shrink-0">📍</span>
                                                                    <span className="truncate">{event.venue}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-wider overflow-hidden">
                                                                    <span className="text-sm opacity-60 shrink-0">👥</span>
                                                                    <span className="truncate">{event.isTeamEvent ? `TEAM (${event.teamSize?.min}-${event.teamSize?.max})` : 'SOLO'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-wider overflow-hidden">
                                                                    <span className="text-sm opacity-60 shrink-0">🎫</span>
                                                                    <span className="truncate">{event.currentRegistrations}/{event.maxParticipants}</span>
                                                                </div>
                                                            </div>

                                                            <div className="mt-2">
                                                                {isRegistered ? (
                                                                    <div className="w-full py-2.5 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-black uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2">
                                                                        <span className="text-sm">✓</span> ENROLLED SUCCESS
                                                                    </div>
                                                                ) : (
                                                                    <div className={`w-full py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-center transition-all ${isSelected ? 'bg-gradient-to-r from-[#00ffff] to-[#0088ff] text-black shadow-[0_0_20px_rgba(0,255,255,0.4)]' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/10'}`}>
                                                                        {isSelected ? 'ACCESS GRANTED' : 'SELECT PROTOCOL'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>


                                    </div>
                                </motion.div>
                            )}

                            {step === 'payment' && paymentData && (
                                <motion.div
                                    variants={itemVariants}
                                    className="relative p-6 sm:p-8 rounded-2xl w-full max-w-lg mx-auto"
                                    style={{
                                        background: 'linear-gradient(145deg, #1a0a2e 0%, #120830 50%, #0d0520 100%)',
                                        border: '1.5px solid rgba(255,0,255,0.5)',
                                        boxShadow: '0 0 30px rgba(255,0,255,0.15), 0 0 60px rgba(0,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div className="relative z-10">
                                        <div className="text-center mb-8">
                                            <div className="text-3xl sm:text-4xl mb-4" style={{
                                                color: '#00ffff',
                                                textShadow: '0 0 10px #00ffff'
                                            }}>
                                                💳
                                            </div>
                                            <h2 className="mb-4 tracking-tighter uppercase" style={{
                                                fontFamily: '"Press Start 2P", "Courier New", monospace',
                                                fontSize: '14px',
                                                color: '#ff00ff',
                                                textShadow: '0 0 10px #ff00ff, 2px 2px 0 #880088'
                                            }}>
                                                VALIDATE TRANSACTION
                                            </h2>
                                            <div className="h-0.5 w-full relative overflow-hidden rounded-full" style={{
                                                background: 'linear-gradient(to right, #ff00ff, #00ffff)',
                                                boxShadow: 'inset 0 0 4px #ff00ff, 0 0 8px #00ffff'
                                            }} />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-6 bg-white/5 border border-[#ff00ff]/30 rounded-3xl backdrop-blur-md space-y-4">
                                                <div className="text-center">
                                                    <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black mb-1">Total Payload</p>
                                                    <p className="text-4xl font-black text-white" style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                                                        ₹{calculateAmountWithFee(events.find(e => e.id === selectedEventId)?.fee || (paymentData.amount / 100))}
                                                    </p>
                                                    <p className="text-[8px] text-white/30 mt-2">(includes 2.42% payment gateway fee)</p>
                                                </div>

                                                <div className="pt-4 border-t border-white/10 space-y-2">
                                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                                        <span className="text-white/40">Event</span>
                                                        <span className="text-[#00ffff]">{events.find(e => e.id === selectedEventId)?.name}</span>
                                                    </div>
                                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                                        <span className="text-white/40">Participant</span>
                                                        <span className="text-[#ff00ff]">{user?.name}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handleExecutePayment}
                                                disabled={loading}
                                                className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(0,255,0,0.3)] transition-all hover:scale-[1.02] active:scale-95 border-2 border-[#00ff00]"
                                                style={{
                                                    background: 'linear-gradient(135deg, #00e600, #00aa00)',
                                                    color: 'white'
                                                }}
                                            >
                                                {loading ? 'EXECUTING SECURE LINK...' : 'INITIATE PAYMENT GATEWAY'}
                                            </Button>

                                            <button
                                                onClick={() => setStep('dashboard')}
                                                className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
                                            >
                                                Abort Transaction
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'success' && user && (
                                <motion.div
                                    variants={itemVariants}
                                    className="relative p-6 sm:p-8 rounded-2xl w-full max-w-2xl mx-auto"
                                    style={{
                                        background: 'linear-gradient(145deg, #1a0a2e 0%, #120830 50%, #0d0520 100%)',
                                        border: '2px solid rgba(0,255,0,0.5)',
                                        boxShadow: '0 0 50px rgba(0,255,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div className="relative z-10">
                                        <div className="text-center mb-8">
                                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500 shadow-[0_0_30px_#22c55e]">
                                                <span className="text-4xl text-green-500">✓</span>
                                            </div>
                                            <h2 className="mb-4 tracking-tighter uppercase" style={{
                                                fontFamily: '"Press Start 2P", "Courier New", monospace',
                                                fontSize: 'clamp(12px, 3vw, 18px)',
                                                color: '#22c55e',
                                                textShadow: '0 0 10px rgba(34,197,94,0.5)'
                                            }}>
                                                REGISTRATION CONFIRMED
                                            </h2>
                                            <div className="h-1 w-full relative overflow-hidden rounded-full bg-green-950/30">
                                                <motion.div
                                                    initial={{ x: '-100%' }}
                                                    animate={{ x: '100%' }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                    className="absolute inset-0 w-1/3 bg-green-500 shadow-[0_0_15px_#22c55e]"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="text-center mt-6">
                                                <p className="text-sm font-black uppercase tracking-[0.2em]" style={{
                                                    color: '#00ffff',
                                                    textShadow: '0 0 10px rgba(0,255,255,0.5)'
                                                }}>
                                                    REGISTRATION SUCCESS
                                                </p>
                                            </div>

                                            <div className="flex justify-center mt-8">
                                                <Button
                                                    onClick={handleLogout}
                                                    variant="ghost"
                                                    className="h-12 px-8 rounded-2xl text-white/40 font-black uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
                                                >
                                                    TERMINATE SESSION
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </main>
            </div>

            {/* Payment Bar - Rendered via Portal to escape Framer Motion transforms */}
            {step === 'dashboard' && ReactDOM.createPortal(
                <div
                    className={`font-vt323 p-4 sm:p-6 bg-black/95 border-t-2 border-[#ff00ff]/30 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] transition-all duration-500 ${!selectedEventId ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 99999,
                        overflow: 'hidden',
                    }}
                >
                    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 lg:pl-[25%] xl:pl-[20%]">
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#ff00ff] to-[#8a2be2] flex items-center justify-center text-lg sm:text-xl shadow-[0_0_15px_rgba(255,0,255,0.4)] shrink-0">
                                💳
                            </div>
                            <div>
                                <h3 className="text-xs sm:text-sm font-black text-[#00ffff] uppercase tracking-widest">
                                    {selectedEventId ? 'Payment Strategy Ready' : 'Select Protocol'}
                                </h3>
                                <p className="text-[9px] sm:text-[10px] text-white/50 uppercase line-clamp-1">
                                    {selectedEventId ? events.find(e => e.id === selectedEventId)?.name : 'Awaiting event selection...'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                            <div className="text-center sm:text-right flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-0 justify-between w-full sm:w-auto">
                                <div className="text-[10px] text-[#ff00ff] font-bold uppercase tracking-widest sm:hidden">
                                    Total Payload:
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-black text-white leading-none">
                                        ₹{calculateAmountWithFee(events.find(e => e.id === selectedEventId)?.fee || 0)}
                                    </div>
                                    <div className="hidden sm:block text-[8px] text-[#ff00ff] font-bold uppercase tracking-widest mt-1">
                                        Total Payload (incl. fee)
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleProceedToPayment}
                                disabled={loading || !selectedEventId}
                                className="h-10 sm:h-12 w-full sm:w-auto px-6 sm:px-10 rounded-full font-black text-[10px] sm:text-[11px] uppercase tracking-widest border-2 border-[#ff00ff] shadow-[0_0_20px_rgba(255,0,255,0.3)] transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group relative overflow-hidden shrink-0"
                                style={{
                                    background: 'linear-gradient(to right, #ff00ff, #8a2be2)',
                                }}
                            >
                                <span className="relative z-10">
                                    {loading ? 'PROCESSING...' : 'INITIALIZE REGISTRATION'}
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
                            </Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
