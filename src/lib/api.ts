import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || ''; // Default to localhost if env variable is not set
// Ensure baseURL includes /api if it's a full URL, or just use /api for relative calls (proxy)
const baseURL = API_BASE ? (API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`) : '/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authApi = {
    // Current OTP-based auth flow
    requestOTP: (email: string) =>
        api.post('/auth/otp/request-otp', { email }),

    verifyOTPGeneric: (data: any) =>
        api.post('/auth/otp/verify-otp', data),

    // Onboarding routes
    onboardCollegeStudent: (data: any) =>
        api.post('/college-students/onboarding', data),

    onboardExternalParticipant: (data: any) =>
        api.post('/external-participants/onboarding', data),

    onboardGuestParticipant: (data: any) =>
        api.post('/guest-participants/onboarding', data),

    // Admin auth
    login: (credentials: any) =>
        api.post('/auth/login', credentials),

    logout: () =>
        api.post('/auth/logout'),

    getMe: () =>
        api.get('/auth/me'),

    // Legacy/Old routes (keeping for compatibility if needed, but should be migrated)
    sendRegistrationOTP: (email: string) =>
        api.post('/auth/send-registration-otp', { email }),

    register: (userData: any) =>
        api.post('/auth/register', userData),

    verifyOTP: (userId: string, otp: string) =>
        api.post('/auth/verify-otp', { userId, otp }),

    googleLogin: (googleData: any) =>
        api.post('/auth/google', googleData),
};

export const paymentApi = {
    createOrder: (amount: number, currency: string = 'INR') =>
        api.post('/payments/create-order', { amount, currency }),

    verifyPayment: (paymentData: any) =>
        api.post('/payments/verify', paymentData),

    // External participant pass purchase — no participantId needed, backend uses registrationData
    createPaymentLink: (data: { paymentType: string, quantity: number }) =>
        api.post('/payments/create-link', data),

    // Verify + create participant in one shot — registrationData is the key payload
    verifyPaymentExternal: (data: {
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
        quantity: number,
        registrationData: Record<string, any>,
    }) =>
        api.post('/payments/verify', data),
};

export const eventApi = {
    getEvents: () => api.get('/events'),
    getEventById: (id: string) => api.get(`/events/${id}`),
};

// Validate that participantId is a valid MongoDB ObjectId (24 char hex string)
const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-f]{24}$/i.test(id);
};

export const eventRegistrationApi = {
    registerForEvent: (data: any) => {
        // Validate participantId before making request
        if (data.participantId && !isValidObjectId(data.participantId)) {
            return Promise.reject(new Error(
                `Invalid participant ID. User registration is incomplete. ` +
                `Received: "${data.participantId}"`
            ));
        }
        return api.post('/event-registrations/register', data);
    },

    getMyEventRegistrations: (data: any) => {
        // Validate participantId before making request
        if (data.participantId && !isValidObjectId(data.participantId)) {
            return Promise.reject(new Error(
                `Invalid participant ID. User registration is incomplete. ` +
                `Please complete your registration first.`
            ));
        }
        return api.post('/event-registrations/my-registrations', data);
    },
    getMyRegistrationsByEmail: (data: { email: string; festId?: string }) =>
        api.post('/event-registrations/my-registrations', data),

    getEventRegistrationById: (id: string) =>
        api.get(`/event-registrations/${id}`),

    listEventRegistrations: (params?: any) =>
        api.get('/event-registrations', { params }),

    cancelEventRegistration: (id: string) =>
        api.post(`/event-registrations/${id}/cancel`),

    confirmEventAttendance: (id: string) =>
        api.post(`/event-registrations/${id}/confirm-attendance`),

    verifyPayment: (data: any) =>
        api.post('/event-registrations/verify-payment', data),
};

export const referralApi = {
    getCodeByParticipant: (participantId: string, token?: string) => {
        const config = token ? {
            headers: { Authorization: `Bearer ${token}` }
        } : {};
        return api.get(`/referral-codes/participant/${participantId}`, config);
    },
};

export default api;
