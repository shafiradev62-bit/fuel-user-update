import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import MobileDebugger from './components/MobileDebugger';
import ErrorBoundary from './components/ErrorBoundary';

// Import pages from fuel-user-update structure
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import LoginFormScreen from './screens/LoginFormScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import HomeScreen from './screens/HomeScreen';
import StationDetailsScreen from './screens/StationDetailsScreen';
import StationReviewsScreen from './screens/StationReviewsScreen';
import FuelFriendDetailsScreen from './screens/FuelFriendDetailsScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import TrackOrderScreen from './screens/TrackOrderScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ManagePasswordScreen from './screens/ManagePasswordScreen';
import ThemeScreen from './screens/ThemeScreen';
import FuelEfficiencyCalculatorScreen from './screens/FuelEfficiencyCalculatorScreen';
import PaymentMethodsScreen from './screens/PaymentMethodsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import SupportHelpScreen from './screens/SupportHelpScreen';
import LiveChatSupportScreen from './screens/LiveChatSupportScreen';
import ReportIssueScreen from './screens/ReportIssueScreen';
import ReportSubmittedSuccessScreen from './screens/ReportSubmittedSuccessScreen';
import TermsConditionsScreen from './screens/TermsConditionsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import AccountDeletionScreen from './screens/AccountDeletionScreen';
import AccountDeletedSuccessScreen from './screens/AccountDeletedSuccessScreen';
import ChatScreen from './screens/ChatScreen';
import ReceiptsScreen from './screens/ReceiptsScreen';
import PasswordResetSuccess from './components/PasswordResetSuccess';
import BottomNav from './components/BottomNav';
import { Theme, User } from './types';

import { apiLogin, apiGetMe } from './services/api';
import { AppContext, useAppContext } from './context/AppContext';

const apiLogout = () => {
    // ✅ Clear token and any stored session data
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Legacy cleanup
};

const apiLoginWithGoogleCredential = async () => {
    // Check if running on mobile (Capacitor)
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        try {
            const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');

            await GoogleAuth.initialize({
                clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID_ANDROID,
                scopes: ['profile', 'email'],
                grantOfflineAccess: true,
            });

            const result = await GoogleAuth.signIn();

            return {
                id: `google-${result.id}`,
                fullName: result.name,
                email: result.email,
                phone: '',
                city: '',
                avatarUrl: result.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name)}&background=random`,
                vehicles: []
            };
        } catch (error) {
            console.error('Mobile Google Auth error:', error);
            // Fallback to mock data
            return {
                id: `google-${Date.now()}`,
                fullName: 'Google User (Mobile)',
                email: 'mobile.user@gmail.com',
                phone: '',
                city: '',
                avatarUrl: 'https://ui-avatars.com/api/?name=Google+User&background=random',
                vehicles: []
            };
        }
    }

    // Web Google OAuth
    return new Promise((resolve, reject) => {
        if (typeof window.google === 'undefined') {
            reject(new Error('Google SDK not loaded'));
            return;
        }

        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: (response: any) => {
                try {
                    const payload = JSON.parse(atob(response.credential.split('.')[1]));

                    const userData = {
                        id: `google-${payload.sub}`,
                        fullName: payload.name || 'Google User',
                        email: payload.email,
                        phone: '',
                        city: '',
                        avatarUrl: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || 'User')}&background=random`,
                        vehicles: []
                    };

                    resolve(userData);
                } catch (error) {
                    reject(error);
                }
            }
        });

        window.google.accounts.id.prompt();
    });
};

// Re-export useAppContext for backward compatibility
export { useAppContext };

const queryClient = new QueryClient();

const AppNavigator = () => {
    console.log('🔍 AppNavigator component rendering');
    const { isAuthenticated, user } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('🔍 AppNavigator useEffect triggered');
        console.log('Current path:', location.pathname);
        console.log('isAuthenticated:', isAuthenticated);
        console.log('Browser history length:', window.history.length);
        console.log('redirectAfterLogin:', localStorage.getItem('redirectAfterLogin'));
        
        const publicRoutes = ['/', '/login', '/login-form', '/register', '/forgot-password', '/password-reset-success'];
        const currentPath = location.pathname;

        // Routes that should NOT redirect authenticated users to home
        const exemptRoutes = [
            '/home',
            '/station/',
            '/fuel-friend/',
            '/checkout',
            '/order-summary',
            '/payment',
            '/track',
            '/orders',
            '/notifications',
            '/settings',
            '/profile',
            '/chat'
        ];

        const isExemptRoute = exemptRoutes.some(route =>
            currentPath === route || currentPath.startsWith(route)
        );

        console.log('publicRoutes.includes(currentPath):', publicRoutes.includes(currentPath));
        console.log('isExemptRoute:', isExemptRoute);

        // Redirect authenticated users to home only if they're on public routes and not exempt, but allow splash screen to show first
        // Skip redirect during registration process
        if (isAuthenticated && publicRoutes.includes(currentPath) && !isExemptRoute && currentPath !== '/' && currentPath !== '/register') {
            console.log('🚀 Redirecting authenticated user to home from:', currentPath);
            navigate('/home');
        } else if (!isAuthenticated && !publicRoutes.includes(currentPath) && !isExemptRoute) {
            // Redirect to login if accessing protected routes without authentication
            const protectedRoutes = ['/home', '/my-orders', '/settings', '/profile', '/orders', '/track', '/notifications', '/checkout', '/payment'];
            if (protectedRoutes.some(route => currentPath === route || currentPath.startsWith(route))) {
                // Store the intended destination before redirecting to login
                localStorage.setItem('redirectAfterLogin', currentPath);
                navigate('/login');
            }
        }
    }, [isAuthenticated, navigate, location.pathname]);

    const showBottomNav = isAuthenticated && (
        ['/home', '/orders', '/track', '/settings'].includes(location.pathname) ||
        location.pathname.startsWith('/track/')
    );

    return (
        <>
            <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/login-form" element={<LoginFormScreen />} />
                <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
                <Route path="/register" element={<RegistrationScreen />} />
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/station/:id" element={<StationDetailsScreen />} />
                <Route path="/station/:id/reviews" element={<StationReviewsScreen />} />
                <Route path="/fuel-friend/:id" element={<FuelFriendDetailsScreen />} />
                <Route path="/checkout" element={<CheckoutScreen />} />
                <Route path="/order-summary" element={<OrderSummaryScreen />} />
                <Route path="/payment" element={<PaymentScreen />} />
                <Route path="/track" element={<TrackOrderScreen />} />
                <Route path="/track/:orderId" element={<TrackOrderScreen />} />
                <Route path="/orders" element={<MyOrdersScreen />} />
                <Route path="/notifications" element={<NotificationsScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
                <Route path="/manage-password" element={<ManagePasswordScreen />} />
                <Route path="/theme" element={<ThemeScreen />} />
                <Route path="/payment-methods" element={<PaymentMethodsScreen />} />
                <Route path="/fuel-efficiency" element={<FuelEfficiencyCalculatorScreen />} />
                <Route path="/notification-settings" element={<NotificationSettingsScreen />} />
                <Route path="/support-help" element={<SupportHelpScreen />} />
                <Route path="/live-chat" element={<LiveChatSupportScreen />} />
                <Route path="/report-issue" element={<ReportIssueScreen />} />
                <Route path="/report-submitted" element={<ReportSubmittedSuccessScreen />} />
                <Route path="/terms-conditions" element={<TermsConditionsScreen />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
                <Route path="/account-deletion" element={<AccountDeletionScreen />} />
                <Route path="/account-deleted" element={<AccountDeletedSuccessScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/chat" element={<ChatScreen />} />
                <Route path="/receipts" element={<ReceiptsScreen />} />
            </Routes>
            {showBottomNav && <BottomNav />}
        </>
    )
}

const App = () => {
    console.log('🔍 App component rendering');
    const [theme, setThemeState] = useState<Theme>(Theme.LIGHT);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Check for existing token and restore session
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            console.log('🔑 Found stored token:', storedToken);
            console.log('Current pathname:', window.location.pathname);
            
            // Skip token validation during registration
            if (window.location.pathname === '/register') {
                console.log('🚫 Skipping token validation during registration');
                return;
            }
            
            setToken(storedToken);
            
            // Validate token with backend
            const validateToken = async () => {
                try {
                    console.log('🔍 Validating token with backend...');
                    const userData = await apiGetMe();
                    console.log('✅ Token valid, user data:', userData);
                    setUser(userData);
                    // Don't set authenticated during registration flow
                    if (!window.location.pathname.includes('/register')) {
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('❌ Token validation failed:', error);
                    // Clear invalid token
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            };
            
            validateToken();
        } else {
            console.log('🚫 No token found in localStorage');
        }

        // Load saved theme or detect system preference
        const savedTheme = localStorage.getItem('theme');
        console.log('Saved theme from localStorage:', savedTheme);
        
        if (savedTheme) {
            const themeValue = savedTheme as Theme;
            setThemeState(themeValue);
            // Apply theme immediately to DOM
            if (themeValue === Theme.DARK) {
                document.documentElement.classList.add('dark');
            } else if (themeValue === Theme.LIGHT) {
                document.documentElement.classList.remove('dark');
            } else {
                // For DEFAULT theme, follow system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            console.log('Applied saved theme:', themeValue);
        } else {
            // If no saved theme, default to LIGHT instead of system preference
            setThemeState(Theme.LIGHT);
            document.documentElement.classList.remove('dark');
            console.log('No saved theme, defaulted to LIGHT');
        }
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === Theme.DARK) {
            root.classList.add('dark');
        } else if (theme === Theme.LIGHT) {
            root.classList.remove('dark');
        } else {
            // Theme.DEFAULT - follow system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        console.log('Setting theme to:', newTheme);
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);

        // Apply theme immediately to DOM
        const root = window.document.documentElement;
        if (newTheme === Theme.DARK) {
            root.classList.add('dark');
        } else if (newTheme === Theme.LIGHT) {
            root.classList.remove('dark');
        } else {
            // Theme.DEFAULT - follow system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    };

    const login = async (email: string, pass: string) => {
        console.log('🔍 Starting login process for:', email);
        
        try {
            const userData = await apiLogin(email, pass);
            console.log('🔑 Login response:', userData);
            
            const token = userData.token;
            
            setToken(token);
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ State updated');
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            const savedToken = localStorage.getItem('token');
            console.log('✅ Token saved to localStorage:', savedToken);
        } catch (error: any) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            // Check if Google SDK is loaded
            if (typeof window.google === 'undefined') {
                // Fallback to mock data if Google SDK not available
                const userData = {
                    id: `user-${Date.now()}`,
                    fullName: 'Google User',
                    email: 'google.user@example.com',
                    phone: '',
                    city: 'London', // Changed from empty to London
                    avatarUrl: 'https://ui-avatars.com/api/?name=Google+User&background=random',
                    vehicles: []
                };
                const token = `mock_token_${Date.now()}`;
                
                // Set state first
                setToken(token);
                setUser(userData);
                setIsAuthenticated(true);
                
                // Then save to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                console.log('✅ Google login fallback successful, token saved:', token);
                return;
            }

            const userData = await apiLoginWithGoogleCredential();
            const token = userData.token || `mock_token_${Date.now()}`;
            
            // Set state first
            setToken(token);
            setUser(userData);
            setIsAuthenticated(true);
            
            // Then save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            console.log('✅ Google login successful, token saved:', token);
        } catch (error) {
            console.error('Google login error:', error);
            // Fallback to mock data on error
            const userData = {
                id: `user-${Date.now()}`,
                fullName: 'Google User',
                email: 'google.user@example.com',
                phone: '',
                city: 'London',
                avatarUrl: 'https://ui-avatars.com/api/?name=Google+User&background=random',
                vehicles: []
            };
            const token = `mock_token_${Date.now()}`;
            
            // Set state first
            setToken(token);
            setUser(userData);
            setIsAuthenticated(true);
            
            // Then save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            console.log('✅ Google login error fallback successful, token saved:', token);
        }
    };

    const logout = async () => {
        try {
            apiLogout();
            setUser(null);
            setIsAuthenticated(false);
            setToken(null);
            // Clear both token and user data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Also clear any redirectAfterLogin that might cause unexpected redirects
            localStorage.removeItem('redirectAfterLogin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        if (updatedUser) {
            // Only set authenticated if not in registration flow
            if (!window.location.pathname.includes('/register')) {
                setIsAuthenticated(true);
            }
            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    }

    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <AppContext.Provider value={{ theme, setTheme, isAuthenticated, user, token, login, loginWithGoogle, logout, updateUser }}>
                    <div className="w-full h-full font-sans bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-200" style={{ height: '100dvh', maxHeight: '100dvh', maxWidth: '100vw', fontFamily: 'Poppins, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
                        <Toaster
                            position="top-center"
                            toastOptions={{
                                className: 'ios-toast',
                                style: {
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    color: '#000000',
                                    border: 'none',
                                    borderRadius: '25px',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    padding: '12px 24px',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                                    width: 'auto',
                                    minWidth: '300px',
                                    marginBottom: '16px',
                                },
                                duration: 3000,
                            }}
                        />
                        <BrowserRouter>
                            <AppNavigator />
                        </BrowserRouter>
                    </div>
                </AppContext.Provider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

export default App;