import { useState, useCallback } from 'react';
import { paymentApi } from '@/lib/api';

const RAZORPAY_FEE_PERCENTAGE = 2.42;

export const calculateAmountWithFee = (amount: number): number => {
    return Math.round(amount * (1 + RAZORPAY_FEE_PERCENTAGE / 100));
};

export const loadRazorpay = () => {
    return new Promise((resolve, reject) => {
        if ((window as any).Razorpay) {
            resolve((window as any).Razorpay);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve((window as any).Razorpay);
        script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
        document.head.appendChild(script);
    });
};

export const useRazorpay = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createOrder = useCallback(async (amount: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await paymentApi.createOrder(amount);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const verifyPayment = useCallback(async (paymentId: string, orderId: string, signature: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await paymentApi.verifyPayment({
                razorpay_payment_id: paymentId,
                razorpay_order_id: orderId,
                razorpay_signature: signature
            });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const openPaymentModal = useCallback(async (
        orderId: string,
        amount: number,
        currency: string,
        name: string,
        description: string,
        handler: (response: any) => void
    ) => {
        try {
            await loadRazorpay();

            const amountWithFee = calculateAmountWithFee(amount);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SGtEGQ3DXeoXIE',
                amount: amountWithFee * 100, // Razorpay expects amount in paise
                currency,
                name,
                description,
                order_id: orderId,
                handler,
                prefill: {
                    // Add user details if available
                },
                theme: {
                    color: '#ff00ff'
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        }
    }, []);

    return {
        loading,
        error,
        createOrder,
        verifyPayment,
        openPaymentModal,
        setError
    };
};