import { MainNavigation } from '@/components/ui/MainNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, Variants } from 'framer-motion';
import { GlitchText } from '@/components/GlitchText';
import { RetroButton } from '@/components/ui/retro-button';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { PixelGhost, PixelStar, PixelCoin, PixelHeart, PixelMusicNote } from '@/components/PixelDecorations';
import './ArcadeRegister.css';



interface StudentFormData {
    name: string;
    email: string;
    mobileNumber: string;
    enrollmentNo: string;
    collegeName: string;
    city: string;
    state: string;
    collegeId: string;
    referralCode?: string;
    quantity: number;
}


import { useRazorpay, loadRazorpay } from '@/hooks/useRazorpay';
import { paymentApi } from '@/lib/api';

export default function Register() {
    const [registrationType, setRegistrationType] = useState<'student' | 'event'>('student');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [participantId, setParticipantId] = useState('');
    const [paymentDetails, setPaymentDetails] = useState<any>(null);
    const [generatedReferralCode, setGeneratedReferralCode] = useState('');
    // Stored after step 1 (non-referral path) — passed to verify so backend can create the participant
    const [registrationData, setRegistrationData] = useState<Record<string, any> | null>(null);
    const navigate = useNavigate();

    // Student form state
    const [studentForm, setStudentForm] = useState<StudentFormData>({
        name: '',
        email: '',
        mobileNumber: '',
        enrollmentNo: '',
        collegeName: '',
        city: '',
        state: '',
        collegeId: '',
        referralCode: '',
        quantity: 1
    });

    // HUD fake timer
    const [hudTime, setHudTime] = useState(99);
    useEffect(() => {
        const t = setInterval(() => setHudTime(prev => prev <= 0 ? 99 : prev - 1), 1000);
        return () => clearInterval(t);
    }, []);

    // Confetti on success
    const [showConfetti, setShowConfetti] = useState(false);
    useEffect(() => {
        if (step === 4 || step === 5) {
            setShowConfetti(true);
            const t = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(t);
        }
    }, [step]);

    // Generate confetti pieces
    const confettiPieces = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 0.8}s`,
            color: ['#BC13FE', '#00FFFF', '#FF44CC', '#FFF01F', '#00FF9D'][Math.floor(Math.random() * 5)],
            size: 4 + Math.random() * 8,
        }));
    }, []);

    // Dust particles
    const dustParticles = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${20 + Math.random() * 60}%`,
            delay: `${Math.random() * 8}s`,
            duration: `${4 + Math.random() * 6}s`,
        }));
    }, []);

    // Pixel rain
    const pixelRainParticles = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${3 + Math.random() * 4}s`,
        }));
    }, []);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('File size too large. Maximum size is 2MB.');
            e.target.value = ''; // Reset input
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setStudentForm(prev => ({ ...prev, collegeId: base64String }));
            toast.success('College ID uploaded and processed.');
        };
        reader.readAsDataURL(file);
    };



    const handleStudentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Prepare data from studentForm state
        const payload: any = {
            email: studentForm.email,
            name: studentForm.name,
            phone: studentForm.mobileNumber,
            college: studentForm.collegeName,
            enrollmentNumber: studentForm.enrollmentNo,
            collegeIdBase64: studentForm.collegeId,
            city: studentForm.city,
            state: studentForm.state,
            category: 'external'
        };

        if (studentForm.referralCode) {
            payload.referralCode = studentForm.referralCode;
        }

        try {
            const response = await authApi.onboardExternalParticipant(payload);
            const d = response.data;

            if (d?.data?.requiresPayment) {
                // No referral code — participant NOT saved to DB yet.
                // Store registrationData; it will be sent to /payments/verify to create the participant.
                setRegistrationData(d.data.registrationData);
                toast.success('Details saved! Now select your passes.');
                setStep(2);
            } else {
                // Referral code used — participant already created in DB
                const pId = d?.data?.participant?._id || d?.data?.participant?.id;
                setParticipantId(pId);
                toast.success('Registered via referral code!');
                setStep(5);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Create Razorpay order — sends only paymentType + quantity (no participantId)
    const handleCreatePayment = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentApi.createPaymentLink({
                paymentType: 'pass',
                quantity: studentForm.quantity,
            });

            const paymentData = response.data.data || response.data;
            console.log('[create-link] response:', paymentData);
            setPaymentDetails(paymentData); // contains orderId, amount (paise), currency, keyId
            toast.success('Payment order created!');
            setStep(3);
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Payment creation failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Open Razorpay directly (no useRazorpay hook — use keyId from server)
    const handlePayment = async () => {
        if (!paymentDetails || !registrationData) return;

        try {
            await loadRazorpay();
        } catch (err) {
            toast.error("Failed to load payment gateway. Please check your internet connection.");
            return;
        }

        // Capture locals to avoid stale closure in the async handler
        const capturedRegistrationData = registrationData;
        const capturedQuantity = studentForm.quantity;
        const capturedOrderDetails = paymentDetails;

        const options = {
            key: capturedOrderDetails.keyId, // Use keyId returned by server, not env variable
            amount: capturedOrderDetails.amount, // Already in paise — do NOT multiply
            currency: capturedOrderDetails.currency || 'INR',
            name: "Aarunya '26",
            description: `${capturedQuantity} Pass${capturedQuantity > 1 ? 'es' : ''}`,
            order_id: capturedOrderDetails.orderId,
            prefill: {
                name: studentForm.name,
                email: studentForm.email,
                contact: studentForm.mobileNumber,
            },
            handler: async (response: any) => {
                // Razorpay calls this on successful payment
                setLoading(true);
                try {
                    // Send registrationData so backend can create the ExternalParticipant + Payment records
                    const verifyResponse = await paymentApi.verifyPaymentExternal({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        quantity: capturedQuantity,
                        registrationData: capturedRegistrationData,
                    });

                    console.log('[verify] response:', verifyResponse.data);
                    const vData = verifyResponse.data.data || verifyResponse.data;

                    // Participant is now created in DB
                    const newParticipantId = vData?.participant?._id || vData?.participant?.id;
                    if (newParticipantId) setParticipantId(newParticipantId);

                    if (vData?.referralCode) {
                        setGeneratedReferralCode(vData.referralCode);
                    }

                    toast.success('Payment verified! Registration complete.');
                    setStep(4);
                } catch (error: any) {
                    console.error('[verify] failed:', error.response?.data || error.message);
                    const msg = error.response?.data?.message || 'Payment verification failed';
                    setError(msg);
                    toast.error(msg);
                } finally {
                    setLoading(false);
                }
            },
            modal: {
                ondismiss: () => toast.info('Payment cancelled'),
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };


    return (
        <div className="arcade-page">
            <MainNavigation />

            {/* ── Floating 8-bit Decorations ── */}
            <div className="floating-decorations">
                <PixelGhost className="floating-el ghost-1" color="neon-magenta" />
                <PixelGhost className="floating-el ghost-2" color="cyber-blue" />
                <PixelStar className="floating-el star-1" color="electric-yellow" />
                <PixelStar className="floating-el star-2" color="neon-magenta" />
                <PixelStar className="floating-el star-3" color="cyber-blue" />
                <PixelCoin className="floating-el coin-1" />
                <PixelHeart className="floating-el heart-1" color="radical-red" />
                <PixelMusicNote className="floating-el music-1" color="neon-magenta" />

                {/* Pixel rain */}
                {pixelRainParticles.map(p => (
                    <div
                        key={`rain-${p.id}`}
                        className="pixel-rain-particle"
                        style={{
                            left: p.left,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                        }}
                    />
                ))}

                {/* Dust particles */}
                {dustParticles.map(d => (
                    <div
                        key={`dust-${d.id}`}
                        className="dust-particle"
                        style={{
                            left: d.left,
                            top: d.top,
                            animationDelay: d.delay,
                            animationDuration: d.duration,
                        }}
                    />
                ))}
            </div>

            {/* ── Confetti on Success ── */}
            {showConfetti && (
                <div className="confetti-container">
                    {confettiPieces.map(c => (
                        <div
                            key={`confetti-${c.id}`}
                            className="confetti-piece"
                            style={{
                                left: c.left,
                                animationDelay: c.delay,
                                backgroundColor: c.color,
                                width: c.size,
                                height: c.size,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="content-scale">
                {/* ═══ ARCADE CABINET ═══ */}
                <div className="arcade-cabinet">
                    {/* Neon side strips */}
                    <div className="cabinet-side-left" />
                    <div className="cabinet-side-right" />

                    {/* ── Marquee ── */}
                    <div className="cabinet-marquee">
                        <div className="marquee-title">
                            <GlitchText text="PLAYER REGISTRATION" />
                        </div>
                        <div className="marquee-subtitle">
                            // INSERT COIN TO BEGIN
                        </div>
                    </div>

                    {/* ── CRT Screen ── */}
                    <div className="cabinet-screen crt-effect">
                        <div className="crt-scanline-beam" />
                        <div className="screen-curve" />
                        <div className="screen-reflection" />

                        {/* HUD Overlay */}
                        <div className="hud-overlay">
                            <div className="hud-player">
                                PLAYER 1 <span className="blink-cursor">▮</span>
                            </div>
                            <div className="hud-score">
                                HI-SCORE: 999999
                            </div>
                            <div className="hud-timer">
                                TIME: {String(hudTime).padStart(2, '0')}
                            </div>
                            <div className="hud-coin-slot">
                                <span className="hud-coin-icon" />
                                <span>×3</span>
                            </div>
                        </div>

                        {/* ── Glass Panel (Form Container) ── */}
                        <div className="glass-panel">
                            {/* Pixel corner decorations (SVG squares) */}
                            <svg className="corner-decor top-left" viewBox="0 0 16 16" fill="#BC13FE">
                                <rect x="0" y="0" width="4" height="4" />
                                <rect x="4" y="0" width="4" height="4" opacity="0.6" />
                                <rect x="0" y="4" width="4" height="4" opacity="0.6" />
                                <rect x="0" y="8" width="4" height="4" opacity="0.3" />
                                <rect x="8" y="0" width="4" height="4" opacity="0.3" />
                            </svg>
                            <svg className="corner-decor top-right" viewBox="0 0 16 16" fill="#00FFFF">
                                <rect x="0" y="0" width="4" height="4" />
                                <rect x="4" y="0" width="4" height="4" opacity="0.6" />
                                <rect x="0" y="4" width="4" height="4" opacity="0.6" />
                                <rect x="0" y="8" width="4" height="4" opacity="0.3" />
                                <rect x="8" y="0" width="4" height="4" opacity="0.3" />
                            </svg>
                            <svg className="corner-decor bottom-left" viewBox="0 0 16 16" fill="#FF44CC">
                                <rect x="0" y="0" width="4" height="4" />
                                <rect x="4" y="0" width="4" height="4" opacity="0.6" />
                                <rect x="0" y="4" width="4" height="4" opacity="0.6" />
                                <rect x="0" y="8" width="4" height="4" opacity="0.3" />
                                <rect x="8" y="0" width="4" height="4" opacity="0.3" />
                            </svg>
                            <svg className="corner-decor bottom-right" viewBox="0 0 16 16" fill="#FFF01F">
                                <rect x="0" y="0" width="4" height="4" />
                                <rect x="4" y="0" width="4" height="4" opacity="0.6" />
                                <rect x="0" y="4" width="4" height="4" opacity="0.6" />
                                <rect x="0" y="8" width="4" height="4" opacity="0.3" />
                                <rect x="8" y="0" width="4" height="4" opacity="0.3" />
                            </svg>

                            {/* ── Registration Type Section ── */}
                            <div className="arcade-type-section">
                                <div className="section-label">SELECT MODE</div>
                                <div className="type-subtitle">// CHOOSE YOUR REGISTRATION PATH</div>
                                <div className="flex flex-col gap-3 sm:max-w-xs">
                                    <RetroButton
                                        variant={registrationType === 'student' ? 'default' : 'white'}
                                        onClick={() => setRegistrationType('student')}
                                        className="w-full justify-start text-left"
                                    >
                                        Non-MITS Students
                                    </RetroButton>
                                    <RetroButton
                                        variant="white"
                                        onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScJVxRKU2EBzHgLrhTcMS1d7IqE8UhUGyX_CWCR9gIqSFCDeA/viewform?usp=preview', '_blank')}
                                        className="w-full justify-start text-left"
                                    >
                                        MITS Alumni
                                    </RetroButton>
                                    <RetroButton
                                        variant={registrationType === 'event' ? 'default' : 'white'}
                                        onClick={() => {
                                            navigate('/unified-registration');
                                        }}
                                        className="w-full justify-start text-left"
                                    >
                                        Event/Competition Registrations
                                    </RetroButton>
                                </div>
                            </div>

                            {/* ── Form Title ── */}
                            <div className="arcade-form-title" style={{ marginTop: '24px' }}>
                                <h2><GlitchText text="ENTER CREDENTIALS" /></h2>
                                <div className="title-divider" />
                                <p>Initialize your account to access exclusive features.</p>
                            </div>

                            {/* ── Error Display ── */}
                            {error && (
                                <div className="arcade-error">
                                    {error}
                                </div>
                            )}

                            {/* ═══ STUDENT FORM STEPS ═══ */}
                            {registrationType === 'student' && (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {step === 1 && (
                                        <form onSubmit={handleStudentSubmit}>
                                            <div className="arcade-input-group">
                                                <label className="arcade-label">Full Name</label>
                                                <Input
                                                    name="name"
                                                    value={studentForm.name}
                                                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                                                    className="arcade-input"
                                                    placeholder="Your Full Name"
                                                    required
                                                />
                                            </div>

                                            <div className="arcade-input-group">
                                                <label className="arcade-label">Email Address</label>
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    value={studentForm.email}
                                                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                                                    className="arcade-input"
                                                    placeholder="student@college.com"
                                                    required
                                                />
                                            </div>

                                            <div className="arcade-input-group">
                                                <label className="arcade-label">Mobile Number</label>
                                                <Input
                                                    name="mobileNumber"
                                                    type="tel"
                                                    value={studentForm.mobileNumber}
                                                    onChange={(e) => setStudentForm({ ...studentForm, mobileNumber: e.target.value })}
                                                    className="arcade-input"
                                                    placeholder="+91 1234567890"
                                                    required
                                                />
                                            </div>

                                            <div className="arcade-input-group">
                                                <label className="arcade-label">Enrollment Number</label>
                                                <Input
                                                    name="enrollmentNo"
                                                    value={studentForm.enrollmentNo}
                                                    onChange={(e) => setStudentForm({ ...studentForm, enrollmentNo: e.target.value })}
                                                    className="arcade-input"
                                                    placeholder="Your Enrollment No."
                                                    required
                                                />
                                            </div>

                                            <div className="arcade-input-group">
                                                <label className="arcade-label">College Name</label>
                                                <Input
                                                    name="collegeName"
                                                    value={studentForm.collegeName}
                                                    onChange={(e) => setStudentForm({ ...studentForm, collegeName: e.target.value })}
                                                    className="arcade-input"
                                                    placeholder="Your College Name"
                                                    required
                                                />
                                            </div>

                                            <div className="arcade-grid-row">
                                                <div className="arcade-input-group">
                                                    <label className="arcade-label">City</label>
                                                    <Input
                                                        name="city"
                                                        value={studentForm.city}
                                                        onChange={(e) => setStudentForm({ ...studentForm, city: e.target.value })}
                                                        className="arcade-input"
                                                        placeholder="City"
                                                        required
                                                    />
                                                </div>
                                                <div className="arcade-input-group">
                                                    <label className="arcade-label">State</label>
                                                    <Input
                                                        name="state"
                                                        value={studentForm.state}
                                                        onChange={(e) => setStudentForm({ ...studentForm, state: e.target.value })}
                                                        className="arcade-input"
                                                        placeholder="State"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="arcade-input-group">
                                                <label className="arcade-label">Referral Code (Optional)</label>
                                                <Input
                                                    name="referralCode"
                                                    value={studentForm.referralCode}
                                                    onChange={(e) => setStudentForm({ ...studentForm, referralCode: e.target.value })}
                                                    className="arcade-input"
                                                    placeholder="TEAM-XXXX"
                                                />
                                            </div>

                                            <div className="arcade-input-group">
                                                <label className="arcade-label">Upload College ID (Max 2MB)</label>
                                                <Input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={handleFileChange}
                                                    className="arcade-input"
                                                    required
                                                />
                                                {studentForm.collegeId && (
                                                    <p className="arcade-upload-success">✓ ID UPLOADED — OK!</p>
                                                )}
                                            </div>

                                            <div className="arcade-submit-wrapper">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="arcade-submit-btn"
                                                >
                                                    {loading ? (
                                                        <><span className="pixel-spinner" /> PROCESSING...</>
                                                    ) : (
                                                        '▶ START GAME'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-5 pt-2">
                                            <div className="arcade-step-title">STEP 2: SELECT PASS QUANTITY</div>
                                            <div className="arcade-input-group">
                                                <label className="arcade-label">Quantity (Bulk Purchase)</label>
                                                <select
                                                    className="arcade-select"
                                                    value={studentForm.quantity}
                                                    onChange={(e) => setStudentForm({ ...studentForm, quantity: Number(e.target.value) })}
                                                >
                                                    <option value={1}>1 Pass - ₹{import.meta.env.VITE_EXTERNAL_PASS_PRICE || 2000}</option>
                                                    <option value={2}>2 Passes - ₹{(import.meta.env.VITE_EXTERNAL_PASS_BULK_2_PRICE || 1500) * 2} (₹{import.meta.env.VITE_EXTERNAL_PASS_BULK_2_PRICE || 1500} each)</option>
                                                    <option value={3}>3 Passes - ₹{(import.meta.env.VITE_EXTERNAL_PASS_BULK_3_PLUS_PRICE || 1000) * 3} (₹{import.meta.env.VITE_EXTERNAL_PASS_BULK_3_PLUS_PRICE || 1000} each)</option>
                                                    <option value={4}>4 Passes - ₹{(import.meta.env.VITE_EXTERNAL_PASS_BULK_3_PLUS_PRICE || 1000) * 4} (₹{import.meta.env.VITE_EXTERNAL_PASS_BULK_3_PLUS_PRICE || 1000} each)</option>
                                                    <option value={5}>5 Passes - ₹{(import.meta.env.VITE_EXTERNAL_PASS_BULK_3_PLUS_PRICE || 1000) * 5} (₹{import.meta.env.VITE_EXTERNAL_PASS_BULK_3_PLUS_PRICE || 1000} each)</option>
                                                </select>
                                            </div>
                                            <div className="arcade-submit-wrapper">
                                                <button
                                                    onClick={handleCreatePayment}
                                                    disabled={loading}
                                                    className="arcade-submit-btn"
                                                >
                                                    {loading ? (
                                                        <><span className="pixel-spinner" /> CREATING ORDER...</>
                                                    ) : (
                                                        '▶ CREATE PAYMENT ORDER'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && paymentDetails && (
                                        <div className="space-y-5 pt-2">
                                            <div className="arcade-step-title">STEP 3: COMPLETE PAYMENT</div>
                                            <div className="arcade-order-summary">
                                                <div className="order-label">Order Summary</div>
                                                <div className="order-amount">₹{paymentDetails.amount / 100}</div>
                                                <div className="order-detail">{studentForm.quantity} Pass(es) for {studentForm.name}</div>
                                            </div>
                                            <div className="arcade-submit-wrapper">
                                                <button
                                                    onClick={handlePayment}
                                                    disabled={loading}
                                                    className="arcade-submit-btn arcade-pay-btn"
                                                >
                                                    {loading ? (
                                                        <><span className="pixel-spinner" /> PROCESSING...</>
                                                    ) : (
                                                        '▶ PAY NOW'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {(step === 4 || step === 5) && (
                                        <div className="arcade-success">
                                            <div className="arcade-success-icon">
                                                <span>✓</span>
                                            </div>
                                            <h3>
                                                {step === 5 ? 'REFERRAL SUCCESSFUL!' : 'PAYMENT SUCCESSFUL!'}
                                            </h3>

                                            {generatedReferralCode && (
                                                <div className="arcade-referral-box">
                                                    <div className="referral-label">🎉 Your Referral Code</div>
                                                    <div className="referral-code">{generatedReferralCode}</div>
                                                    <div className="referral-hint">Share this with your team members to skip payment!</div>
                                                </div>
                                            )}

                                            <div className="arcade-id-box">
                                                <div className="id-label">Aarunya ID</div>
                                                <div className="id-value">{participantId}</div>
                                            </div>

                                            <p className="arcade-success-msg">
                                                {step === 5
                                                    ? 'Your registration is confirmed via referral. An admin will verify your details soon.'
                                                    : 'Your payment is confirmed.'}
                                            </p>

                                            <p className="arcade-pass-notice">
                                                YOU WILL GET YOUR PASS AT THE VENUE
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* EVENT REGISTRATION - Redirect Message */}
                            {registrationType === 'event' && (
                                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                    <p style={{
                                        fontFamily: '"VT323", monospace',
                                        fontSize: '16px',
                                        color: 'rgba(255,255,255,0.6)',
                                    }}>
                                        Redirecting to Event Registration...
                                    </p>
                                </div>
                            )}

                            {/* STATUS BAR */}
                            <div className="arcade-status-bar">
                                <span className="status-label">System Status</span>
                                <span className="status-dot" />
                                <span className="status-text">Online</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Control Panel (Decorative) ── */}
                    <div className="control-panel">
                        <div className="joystick" />
                        <div className="control-buttons">
                            <div className="ctrl-btn red" />
                            <div className="ctrl-btn blue" />
                            <div className="ctrl-btn green" />
                            <div className="ctrl-btn yellow" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Neon Line ── */}
            <div className="arcade-bottom-line">
                {[...Array(60)].map((_, i) => (
                    <div key={i} className="segment" />
                ))}
            </div>
        </div>
    );
}
