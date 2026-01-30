import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CreditCard, X, Moon, Truck, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

interface NotificationSettings {
    orderUpdates: boolean;
    paymentConfirmations: boolean;
    orderCancellations: boolean;
    fuelDelivery: boolean;
    safetyAlerts: boolean;
}

const NotificationSettingsScreen = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAppContext();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [settings, setSettings] = useState<NotificationSettings>({
        orderUpdates: true,
        paymentConfirmations: true,
        orderCancellations: false,
        fuelDelivery: true,
        safetyAlerts: false
    });

    useEffect(() => {
        // Check if user is logged in using App Context
        if (!isAuthenticated || !user) {
            setIsLoggedIn(false);
            // Don't return early, just set state to show appropriate UI
            return;
        }
        setIsLoggedIn(true);
        
        // Load saved notification settings only if logged in
        const savedSettings = localStorage.getItem('notificationSettings');
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (error) {
                console.error('Error loading notification settings:', error);
            }
        }
    }, [isAuthenticated, user]);

    const handleLoginRedirect = () => {
        // Store current location for redirect after login
        localStorage.setItem('redirectAfterLogin', '/notification-settings');
        navigate('/login');
    };

    const handleToggle = (key: keyof NotificationSettings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        // Only save to localStorage if logged in
        if (isLoggedIn) {
            localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
        }
    };

    const handleThemeNavigation = () => {
        navigate('/theme');
    };

    const NotificationItem = ({ 
        icon, 
        title, 
        description, 
        isEnabled, 
        onToggle,
        isClickable = false
    }: {
        icon: React.ReactNode;
        title: string;
        description: string;
        isEnabled?: boolean;
        onToggle?: () => void;
        isClickable?: boolean;
    }) => (
        <div className="flex items-start space-x-3 py-4">
            <div className="mt-1">{icon}</div>
            <div className="flex-1">
                <h3 className="font-medium text-gray-900">{title}</h3>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            {isClickable ? (
                <button
                    onClick={onToggle}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
            ) : (
                <button
                    onClick={onToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isEnabled ? 'bg-[#3AC36C]' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            )}
        </div>
    );

    // Don't show login prompt, just render the screen with appropriate content
    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <TapEffectButton onClick={() => navigate('/settings')} className="p-2 -ml-2">
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </TapEffectButton>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
                        Notification Settings
                    </h2>
                </header>
                
                <div className="p-4 space-y-6">
                    {!isLoggedIn ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <Bell className="w-5 h-5 text-yellow-600 mr-2" />
                                <p className="text-yellow-800 text-sm">You are not logged in. <button onClick={handleLoginRedirect} className="text-[#3AC36C] font-medium underline">Login</button> to save your notification preferences.</p>
                            </div>
                        </div>
                    ) : null}
                    
                    <p className="text-gray-600 text-sm mb-6">
                        Customize your notification preferences to stay updated.
                    </p>

                    <div className="space-y-1">
                        <NotificationItem
                            icon={<Bell className="w-5 h-5 text-[#3AC36C]" />}
                            title="Order Updates"
                            description="Get notified about your fuel order status"
                            isEnabled={settings.orderUpdates}
                            onToggle={() => handleToggle('orderUpdates')}
                        />

                        <NotificationItem
                            icon={<CreditCard className="w-5 h-5 text-[#3AC36C]" />}
                            title="Payment Confirmations"
                            description="Get notified when a transaction is successful"
                            isEnabled={settings.paymentConfirmations}
                            onToggle={() => handleToggle('paymentConfirmations')}
                        />

                        <NotificationItem
                            icon={<X className="w-5 h-5 text-gray-400" />}
                            title="Order Cancellation Updates"
                            description="Get notified if an order is cancelled"
                            isEnabled={settings.orderCancellations}
                            onToggle={() => handleToggle('orderCancellations')}
                        />

                        <NotificationItem
                            icon={<Truck className="w-5 h-5 text-[#3AC36C]" />}
                            title="Fuel Delivery Updates"
                            description="Get notified before a scheduled fuel delivery."
                            isEnabled={settings.fuelDelivery}
                            onToggle={() => handleToggle('fuelDelivery')}
                        />

                        <NotificationItem
                            icon={<X className="w-5 h-5 text-gray-400" />}
                            title="Safety Alerts"
                            description="Receive important safety notifications"
                            isEnabled={settings.safetyAlerts}
                            onToggle={() => handleToggle('safetyAlerts')}
                        />

                        <NotificationItem
                            icon={<Moon className="w-5 h-5 text-gray-900" />}
                            title="Change Theme"
                            description=""
                            isClickable={true}
                            onToggle={handleThemeNavigation}
                        />
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default NotificationSettingsScreen;