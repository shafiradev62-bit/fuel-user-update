import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Lock, CreditCard, Calculator, Sun, Moon, Bell, HelpCircle, FileText, Shield, Trash2, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { pushNotificationService } from '../services/pushNotification';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';
import ConfirmationModal from '../components/ConfirmationModal';

const SettingsItem = ({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick?: () => void }) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
        <div className="flex items-center">
            <div className="mr-4 text-gray-600 dark:text-gray-400">{icon}</div>
            <span className="text-gray-800 dark:text-gray-200 text-base">{text}</span>
        </div>
        <ChevronRight className="text-gray-400 dark:text-gray-600" size={20} />
    </div>
);

const SettingsScreen = () => {
    const navigate = useNavigate();
    const { logout, user } = useAppContext();
    const [notifStatus, setNotifStatus] = useState<string>('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
    };

    const enableNotifications = async () => {
        try {
            setNotifStatus('Requesting permission...');
            const token = await pushNotificationService.initializePushNotifications();
            if (token) {
                setNotifStatus('Notifications enabled successfully');
                console.log('FCM Token:', token);
                // Auto-clear status after 3 seconds
                setTimeout(() => setNotifStatus(''), 3000);
            } else {
                setNotifStatus('Permission denied or not supported');
                setTimeout(() => setNotifStatus(''), 3000);
            }
        } catch (e: any) {
            setNotifStatus(e?.message || 'Failed to enable notifications');
            setTimeout(() => setNotifStatus(''), 3000);
        }
    };

    const testPush = async () => {
        try {
            setNotifStatus('Sending test notification...');
            const success = await pushNotificationService.sendTestNotification();
            if (success) {
                setNotifStatus('Test notification sent successfully');
            } else {
                setNotifStatus('Failed to send test notification');
            }
            setTimeout(() => setNotifStatus(''), 3000);
        } catch (error) {
            setNotifStatus('Test notification failed');
            setTimeout(() => setNotifStatus(''), 3000);
        }
    };

    return (
      <>
        <AnimatedPage>
            <div className="min-h-screen bg-background">
                <header className="p-4 flex items-center bg-background border-b border-gray-100 dark:border-gray-800">
                    <TapEffectButton onClick={() => navigate('/home')} className="p-2 -ml-2">
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </TapEffectButton>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900 dark:text-white">Settings</h2>
                </header>

                <div className="p-4 space-y-6">
                    {/* Status Message */}
                    {notifStatus && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-blue-600 text-sm text-center">{notifStatus}</p>
                        </div>
                    )}

                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3 px-2">Security & Passwords</h3>
                        <div className="bg-background border-t border-b border-gray-200 dark:border-gray-800">
                            <div className="border-t border-gray-100 dark:border-gray-800"></div>
                            <SettingsItem icon={<CreditCard size={20} />} text="Manage Payment Method" onClick={() => navigate('/payment-methods')} />
                            <div className="border-t border-gray-100 dark:border-gray-800"></div>
                            <SettingsItem icon={<Calculator size={20} />} text="Fuel Efficiency Calculator" onClick={() => navigate('/fuel-efficiency')} />
                            <div className="border-t border-gray-100 dark:border-gray-800"></div>
                            <SettingsItem icon={<Sun size={20} />} text="Themes" onClick={() => navigate('/theme')} />
                            <div className="border-t border-gray-100 dark:border-gray-800"></div>
                            <SettingsItem icon={<Bell size={20} />} text="Notification Settings" onClick={() => navigate('/notification-settings')} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3 px-2">Customer Care</h3>
                        <div className="bg-background border-t border-b border-gray-200 dark:border-gray-800">
                            <SettingsItem icon={<HelpCircle size={20} />} text="Help and Support" onClick={() => navigate('/support-help')} />
                            <div className="border-t border-gray-100 dark:border-gray-800"></div>
                            <SettingsItem icon={<FileText size={20} />} text="Terms and Conditions" onClick={() => navigate('/terms-conditions')} />
                            <div className="border-t border-gray-100 dark:border-gray-800"></div>
                            <SettingsItem icon={<Shield size={20} />} text="Privacy Policy" onClick={() => navigate('/privacy-policy')} />
                            <div className="border-t border-gray-100 dark:border-gray-800"></div>
                            <SettingsItem icon={<FileText size={20} />} text="My Receipts" onClick={() => navigate('/receipts')} />
                            <div className="border-t border-gray-100 dark:border-gray-800"></div>
                            <SettingsItem icon={<Trash2 size={20} />} text="Request Account Deletion" onClick={() => navigate('/account-deletion')} />
                        </div>
                    </div>



                    {/* Push Notification Test Buttons - Development Only */}
                    {import.meta.env.DEV && (
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3 px-2">Development Tools</h3>
                            <div className="bg-background border-t border-b border-gray-200 dark:border-gray-800">
                                <SettingsItem icon={<Bell size={20} />} text="Enable Push Notifications" onClick={enableNotifications} />
                                <div className="border-t border-gray-100 dark:border-gray-800"></div>
                                <SettingsItem icon={<Bell size={20} />} text="Test Push Notification" onClick={testPush} />
                            </div>
                        </div>
                    )}

                    {/* Logout Button */}
                    {user && (
                        <div className="pt-4">
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-500 text-white py-4 rounded-full font-bold hover:bg-red-600 transition-colors shadow-lg flex items-center justify-center"
                            >
                                <LogOut size={20} className="mr-2" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AnimatedPage>

        {/* Logout Confirmation Modal */}
        <ConfirmationModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
          title="Sign Out"
          message="Are you sure you want to log out of your account?"
          confirmText="Sign Out"
          cancelText="Cancel"
          type="warning"
        />
      </>
    );
};

export default SettingsScreen;