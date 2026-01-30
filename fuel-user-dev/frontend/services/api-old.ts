import axios from 'axios';
import { networkHandler } from './networkHandler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Use fetch instead of axios for better mobile compatibility
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await networkHandler.makeRequest(url, options);
  return response.json();
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// ==========================================
// AUTHENTICATION
// ==========================================

export const apiRegister = async (userData: any) => {
  try {
    const data = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return data;
  } catch (error) {
    // Fallback for mobile
    const { data } = await api.post('/api/auth/register', userData);
    return data;
  }
};

export const apiLogin = async (email: string, password: string) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  if (!data.success) throw new Error(data.error);
  return data.user;
};

export const apiLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const apiLoginWithGoogleCredential = async () => {
  // Simulate Google login for now
  return {
    id: `user-${Date.now()}`,
    fullName: 'Google User',
    email: 'google.user@example.com',
    phone: '',
    city: '',
    avatarUrl: 'https://ui-avatars.com/api/?name=Google+User&background=random',
    vehicles: []
  };
};

// ==========================================
// FUEL STATIONS
// ==========================================

export const apiGetStations = async (lat: number, lng: number, radius = 10000) => {
  const { data } = await api.get(`/api/stations?lat=${lat}&lng=${lng}&radius=${radius}`);
  return data.data;
};

export const apiGetStationDetails = async (id: string) => {
  const { data } = await api.get(`/api/station/${id}`);
  return data.data;
};

// ==========================================
// OTP VERIFICATION
// ==========================================

export const apiSendWhatsAppOTP = async (phoneNumber: string) => {
  const { data } = await api.post('/api/otp/whatsapp/send', { phoneNumber });
  return data;
};

export const apiSendEmailOTP = async (email: string) => {
  const { data } = await api.post('/api/otp/email/send', { email });
  return data;
};

export const apiVerifyOTP = async (identifier: string, otp: string) => {
  const { data } = await api.post('/api/otp/verify', { identifier, otp });
  return data;
};

export const apiResetPassword = async (email: string, newPassword: string) => {
  const { data } = await api.post('/api/auth/reset-password', { email, newPassword });
  return data;
};

// ==========================================
// ORDERS
// ==========================================

export const apiCreateOrder = async (orderData: any) => {
  const { data } = await api.post('/api/orders', orderData);
  return data.data;
};

export const apiGetOrders = async (customerId?: string) => {
  const url = customerId ? `/api/orders?customerId=${customerId}` : '/api/orders';
  const { data } = await api.get(url);
  return data.data;
};

export const apiCreateOrderFromPayment = async (orderData: any) => {
  const { data } = await api.post('/api/orders', orderData);
  return data;
};

export const apiUpdateOrderStatus = async (id: string, status: string) => {
  const { data } = await api.patch(`/api/orders/${id}/status`, { status });
  return data;
};

// ==========================================
// PAYMENTS (STRIPE)
// ==========================================

export const apiCreatePaymentIntent = async (amount: number, orderId: string, currency = 'gbp') => {
  const { data } = await api.post('/api/stripe/create-payment-intent', {
    amount,
    orderId,
    currency
  });
  return data;
};

// ==========================================
// USER PROFILE
// ==========================================

export const apiUpdateUserProfile = async (userData: any) => {
  const { data } = await api.patch('/api/user/profile', userData);
  return data;
};

export const apiRegisterPushToken = async (email: string, token: string) => {
  const { data } = await api.post('/api/notifications/register', { email, token });
  return data;
};

export const apiSendTestPush = async (token?: string) => {
  const { data } = await api.post('/api/notifications/test', { token });
  return data;
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export const apiHealthCheck = async () => {
  const { data } = await api.get('/api/health');
  return data;
};

export const apiSeedDatabase = async () => {
  const { data } = await api.post('/api/seed');
  return data;
};

export const apiSeedData = async () => {
  return await apiSeedDatabase();
};

// ==========================================
// ERROR HANDLING
// ==========================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data
      apiLogout();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;