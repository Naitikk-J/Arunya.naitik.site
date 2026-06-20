import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api';

export interface User {
    id: string;
    _id?: string;
    uid?: string;
    name: string;
    email: string;
    aarunyaId?: string;
    category?: string;
    participantType?: string;
    enrollment_no?: string;
    created_at?: string;
}

/** Ensure user always has a top-level `id` field */
const normalizeUser = (u: any): User | null => {
    if (!u) return null;
    // Generate a temporary ID if none exists (for new users during registration)
    const id = u.id || u._id || u.uid || u.participantId || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const category = u.category || u.participantType || u.type || 'CollegeStudent';
    return { ...u, id, category: category || undefined };
};

export const useAuth = () => {
    const [user, setUser] = useState<User | null>((() => {
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser && savedUser !== 'undefined') {
                const parsed = JSON.parse(savedUser);
                const normalized = normalizeUser(parsed);
                // Re-save if we needed to fix the id
                if (normalized && !parsed.id && normalized.id) {
                    localStorage.setItem('user', JSON.stringify(normalized));
                }
                return normalized;
            }
            return null;
        } catch {
            return null;
        }
    })());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tempUserId, setTempUserId] = useState<string | null>(null);

    const signInWithGoogle = async (googleData?: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.googleLogin(googleData);
            const payload = response.data?.data || response.data;
            const userData = payload?.user || payload;
            const token = payload?.token || response.data?.token;
            if (userData) {
                const normalized = normalizeUser(userData);
                setUser(normalized);
                localStorage.setItem('user', JSON.stringify(normalized));
            }
            if (token) {
                localStorage.setItem('authToken', token);
            }
            return userData;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signInWithOTP = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.requestOTP(email);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (email: string, otp: string, onboardingData?: any) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (onboardingData && Object.keys(onboardingData).length > 0) {
                // Determine which onboarding endpoint to use
                const category = onboardingData.category || 'CollegeStudent';
                if (category === 'CollegeStudent') {
                    response = await authApi.onboardCollegeStudent({
                        ...onboardingData,
                        email,
                        otp,
                        // Backend expects enrollmentNumber
                        enrollmentNumber: onboardingData.enrollment_no || onboardingData.enrollmentNumber
                    });
                } else {
                    response = await authApi.onboardExternalParticipant({
                        ...onboardingData,
                        email,
                        otp
                    });
                }
            } else {
                response = await authApi.verifyOTPGeneric({
                    email,
                    otp
                });
            }

            // Handle both response.data.data.user and response.data.user structures
            const payload = response.data?.data || response.data;
            const userDataRes = payload?.user || payload?.participant || payload?.student || payload;
            const token = payload?.token || response.data?.token;

            // Debug logging
            console.log('OTP Verification Response:', {
                hasPayload: !!payload,
                hasUser: !!userDataRes,
                hasToken: !!token,
                tokenValue: token ? 'Token present' : 'No token'
            });

            if (userDataRes) {
                const normalized = normalizeUser(userDataRes);
                setUser(normalized);
                localStorage.setItem('user', JSON.stringify(normalized));
            }
            if (token) {
                localStorage.setItem('authToken', token);
                console.log('Auth token saved to localStorage');
            } else {
                console.warn('No token in response! Token path checked:', {
                    payloadToken: payload?.token,
                    dataToken: response.data?.token
                });
            }
            return { ...userDataRes, token };
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (userData: any) => {
        // This is now legacy since we use verifyOTP with onboardingData
        // But we'll keep it as an alias for onboarding if needed
        return verifyOTP(userData.email, userData.otp, userData);
    };

    const signOut = useCallback(async () => {
        setLoading(true);
        try {
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        user,
        loading,
        error,
        signInWithGoogle,
        signInWithOTP,
        verifyOTP,
        signUp,
        signOut,
        setError
    };
};
