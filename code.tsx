'use client';

/**
 * EXTERNAL PARTICIPANT REGISTRATION - REFERENCE IMPLEMENTATION
 *
 * Flow:
 *   Step 1: Submit personal details → POST /external-participants/onboarding
 *     - If referral code: participant created immediately, done.
 *     - If no referral code: backend returns registrationData (no DB save yet).
 *
 *   Step 2: Create Razorpay order → POST /payments/create-link
 *     - Sends quantity to get the correct bulk price.
 *     - Returns orderId, amount, currency, keyId.
 *
 *   Step 3: Open Razorpay checkout → on success, verify → POST /payments/verify
 *     - Sends registrationData + Razorpay response details.
 *     - Backend creates ExternalParticipant + Payment records only here.
 *     - Returns participant._id and referralCode (if bulk purchase).
 */

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'details' | 'payment' | 'pay' | 'done' | 'referral_done';

interface FormData {
    email: string;
    name: string;
    phone: string;
    college: string;
    city: string;
    state: string;
    enrollmentNumber: string;
    referralCode: string;
    quantity: number;
}

interface OrderDetails {
    orderId: string;
    amount: number;       // in paise (multiply by 100 from backend)
    currency: string;
    keyId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExternalRegistrationPage() {
    const [step, setStep] = useState<Step>('details');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Stored after step 1 (non-referral path)
    const [registrationData, setRegistrationData] = useState<Record<string, string> | null>(null);

    // Stored after step 2
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

    // Final results
    const [participantId, setParticipantId] = useState('');
    const [generatedReferralCode, setGeneratedReferralCode] = useState('');

    const [form, setForm] = useState<FormData>({
        email: '',
        name: '',
        phone: '',
        college: '',
        city: '',
        state: '',
        enrollmentNumber: '',
        referralCode: '',
        quantity: 1,
    });

    const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [field]: field === 'quantity' ? Number(e.target.value) : e.target.value }));

    // ── Step 1: Submit details to onboarding endpoint ──────────────────────────
    const handleSubmitDetails = async () => {
        setError('');
        setLoading(true);
        try {
            const payload: Record<string, any> = {
                email: form.email,
                name: form.name,
                phone: form.phone,
                college: form.college,
                city: form.city,
                state: form.state,
                enrollmentNumber: form.enrollmentNumber,
                // In production: convert the uploaded file to base64 and send here
                collegeIdBase64: 'data:image/png;base64,PLACEHOLDER',
            };

            if (form.referralCode) {
                payload.referralCode = form.referralCode;
            }

            const res = await fetch(`${API_URL}/external-participants/onboarding`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            if (data.data.requiresPayment) {
                // No referral code — store registration data for verify step
                // NOTE: participant is NOT saved to DB yet
                setRegistrationData(data.data.registrationData);
                setStep('payment');
            } else {
                // Referral code used — participant already saved with paymentStatus: completed
                setParticipantId(data.data.participant._id);
                setStep('referral_done');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Create Razorpay order ──────────────────────────────────────────
    const handleCreateOrder = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/payments/create-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentType: 'pass',
                    quantity: form.quantity,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create order');

            setOrderDetails(data.data);
            setStep('pay');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Step 3: Open Razorpay + verify on success ──────────────────────────────
    const handlePay = () => {
        if (!orderDetails) return;

        const options = {
            key: orderDetails.keyId,
            amount: orderDetails.amount,
            currency: orderDetails.currency,
            name: "Aarunya '25",
            description: `${form.quantity} Pass${form.quantity > 1 ? 'es' : ''}`,
            order_id: orderDetails.orderId,
            prefill: {
                name: form.name,
                email: form.email,
                contact: form.phone,
            },
            handler: async (response: any) => {
                // Called by Razorpay on successful payment
                await handleVerifyPayment(response);
            },
            modal: {
                ondismiss: () => setError('Payment cancelled'),
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    const handleVerifyPayment = async (razorpayResponse: any) => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/payments/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_order_id: razorpayResponse.razorpay_order_id,
                    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                    razorpay_signature: razorpayResponse.razorpay_signature,
                    quantity: form.quantity,
                    // This is the key: pass registration data so backend can create the participant
                    registrationData,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Payment verification failed');

            // Participant + Payment records are now saved in DB
            setParticipantId(data.data.participant._id);
            if (data.data.referralCode) {
                setGeneratedReferralCode(data.data.referralCode);
            }
            setStep('done');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>External Participant Registration</h1>
            <p style={{ color: '#666', marginBottom: 24 }}>
                {step === 'details' && 'Step 1 of 3 — Enter your details'}
                {step === 'payment' && 'Step 2 of 3 — Choose quantity & create order'}
                {step === 'pay' && 'Step 3 of 3 — Complete payment'}
                {step === 'done' && '✅ Registration complete!'}
                {step === 'referral_done' && '✅ Registered via referral code!'}
            </p>

            {error && (
                <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#991b1b' }}>
                    {error}
                </div>
            )}

            {/* ── Step 1: Details ── */}
            {step === 'details' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Field label="Full Name *" value={form.name} onChange={set('name')} placeholder="John Doe" />
                    <Field label="Email *" type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" />
                    <Field label="Phone *" value={form.phone} onChange={set('phone')} placeholder="9876543210" />
                    <Field label="College *" value={form.college} onChange={set('college')} placeholder="Example University" />
                    <Field label="City" value={form.city} onChange={set('city')} placeholder="Mumbai" />
                    <Field label="State" value={form.state} onChange={set('state')} placeholder="Maharashtra" />
                    <Field label="Enrollment Number *" value={form.enrollmentNumber} onChange={set('enrollmentNumber')} placeholder="EX123456" />
                    <Field label="Referral Code (optional)" value={form.referralCode} onChange={set('referralCode')} placeholder="TEAM-001" />

                    <Btn onClick={handleSubmitDetails} loading={loading} disabled={!form.name || !form.email || !form.phone || !form.college || !form.enrollmentNumber}>
                        Continue
                    </Btn>
                </div>
            )}

            {/* ── Step 2: Quantity + Create Order ── */}
            {step === 'payment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Number of Passes</label>
                        <select
                            value={form.quantity}
                            onChange={set('quantity')}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                        >
                            <option value={1}>1 Pass — ₹2000</option>
                            <option value={2}>2 Passes — ₹3000 (₹1500 each)</option>
                            <option value={3}>3 Passes — ₹3000 (₹1000 each)</option>
                            <option value={4}>4 Passes — ₹4000 (₹1000 each)</option>
                            <option value={5}>5 Passes — ₹5000 (₹1000 each)</option>
                        </select>
                        {form.quantity > 1 && (
                            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                                You'll receive a referral code to share with {form.quantity - 1} team member{form.quantity > 2 ? 's' : ''}.
                            </p>
                        )}
                    </div>

                    <Btn onClick={handleCreateOrder} loading={loading}>
                        Create Payment Order
                    </Btn>
                </div>
            )}

            {/* ── Step 3: Pay ── */}
            {step === 'pay' && orderDetails && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '12px 16px' }}>
                        <p style={{ fontWeight: 600, marginBottom: 4 }}>Order Summary</p>
                        <p style={{ fontSize: 14, color: '#374151' }}>Amount: ₹{orderDetails.amount / 100}</p>
                        <p style={{ fontSize: 12, color: '#6b7280' }}>Order ID: {orderDetails.orderId}</p>
                    </div>

                    <Btn onClick={handlePay} loading={loading}>
                        Pay Now
                    </Btn>
                </div>
            )}

            {/* ── Done: Payment ── */}
            {step === 'done' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '16px' }}>
                        <p style={{ fontWeight: 700, color: '#166534', marginBottom: 4 }}>Payment Confirmed!</p>
                        <p style={{ fontSize: 13, color: '#374151' }}>Participant ID: <code>{participantId}</code></p>
                        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                            An admin will assign your pass. You'll be notified once it's ready.
                        </p>
                    </div>

                    {generatedReferralCode && (
                        <div style={{ background: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: 8, padding: '16px' }}>
                            <p style={{ fontWeight: 700, color: '#6b21a8', marginBottom: 4 }}>🎉 Your Team Referral Code</p>
                            <p style={{ fontSize: 28, fontFamily: 'monospace', fontWeight: 700, color: '#7c3aed', letterSpacing: 2 }}>
                                {generatedReferralCode}
                            </p>
                            <p style={{ fontSize: 12, color: '#7c3aed', marginTop: 4 }}>
                                Share this with your {form.quantity - 1} team member{form.quantity > 2 ? 's' : ''} — they can register without paying.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Done: Referral ── */}
            {step === 'referral_done' && (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '16px' }}>
                    <p style={{ fontWeight: 700, color: '#166534', marginBottom: 4 }}>Registered via Referral Code!</p>
                    <p style={{ fontSize: 13, color: '#374151' }}>Participant ID: <code>{participantId}</code></p>
                    <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                        Payment was covered by your team leader. An admin will assign your pass.
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = 'text' }: {
    label: string; value: string; onChange: any; placeholder?: string; type?: string;
}) {
    return (
        <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
            />
        </div>
    );
}

function Btn({ children, onClick, loading, disabled }: {
    children: React.ReactNode; onClick: () => void; loading?: boolean; disabled?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            style={{
                padding: '12px 24px',
                background: loading || disabled ? '#9ca3af' : '#1d4ed8',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading || disabled ? 'not-allowed' : 'pointer',
                width: '100%',
            }}
        >
            {loading ? 'Please wait...' : children}
        </button>
    );
}
