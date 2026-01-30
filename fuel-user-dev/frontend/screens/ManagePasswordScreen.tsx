import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { apiChangePassword } from '../services/api';
import AnimatedPage from '../components/AnimatedPage';
import PasswordChangeSuccessModal from '../components/PasswordChangeSuccessModal';
import TapEffectButton from '../components/TapEffectButton';

const ManagePasswordScreen = () => {
    const navigate = useNavigate();
    const { user } = useAppContext();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const [formData, setFormData] = useState({
        email: user?.email || '',
        currentPassword: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userData || !token) {
            setIsLoggedIn(false);
            return;
        }
        
        try {
            const parsedUser = JSON.parse(userData);
            setCurrentUser(parsedUser);
            setIsLoggedIn(true);
            // Update form data with user email when logged in
            setFormData(prev => ({
                ...prev,
                email: parsedUser.email || ''
            }));
        } catch (e) {
            console.error('Failed to parse user data:', e);
            setIsLoggedIn(false);
        }
    }, []);

    const handleLoginRedirect = () => {
        // Store current location for redirect after login
        localStorage.setItem('redirectAfterLogin', '/manage-password');
        navigate('/login');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = async () => {
        if (!isLoggedIn) {
            handleLoginRedirect();
            return;
        }

        setLoading(true);
        setError('');
        
        // Validation
        if (!formData.currentPassword) {
            setError('Current password is required');
            setLoading(false);
            return;
        }
        
        if (!formData.newPassword) {
            setError('New password is required');
            setLoading(false);
            return;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }
        
        if (formData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            setLoading(false);
            return;
        }
        
        try {
            await apiChangePassword(
                currentUser?.id || user?.id || '',
                formData.currentPassword,
                formData.newPassword
            );
            
            setShowSuccessModal(true);
            setFormData({
                ...formData,
                currentPassword: '',
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <TapEffectButton onClick={() => navigate('/settings')} className="p-2 -ml-2">
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </TapEffectButton>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">Manage Password</h2>
                </header>
                
                <div className="p-4 space-y-6">
                    {!isLoggedIn ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                                <p className="text-yellow-800 text-sm">You are not logged in. <button onClick={handleLoginRedirect} className="text-[#3AC36C] font-medium underline">Login</button> to change your password.</p>
                            </div>
                        </div>
                    ) : null}
                    
                    {/* Show form only if logged in */}
                    {isLoggedIn ? (
                        <>
                            {/* Error Messages */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-600 text-sm text-center">{error}</p>
                                </div>
                            )}

                            {/* Current Password Section */}
                            <div>
                                <h3 className="text-gray-900 font-medium mb-4">Current Password</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 block">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-600"
                                            readOnly
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 block">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                placeholder="password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#3AC36C]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                            >
                                                {showCurrentPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Change Current Password Section */}
                            <div>
                                <h3 className="text-gray-900 font-medium mb-4">Change Current Password</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 block">Enter Old Password</label>
                                        <input
                                            type="email"
                                            name="oldPassword"
                                            value={formData.oldPassword}
                                            onChange={handleChange}
                                            placeholder="robinabc35@gmail.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#3AC36C]"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 block">Write New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#3AC36C]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                            >
                                                {showNewPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-gray-600 text-sm mb-2 block">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#3AC36C]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Password Change Button */}
                            <button
                                onClick={handlePasswordChange}
                                disabled={loading}
                                className="w-full py-4 bg-[#3AC36C] text-white rounded-full font-semibold text-base hover:bg-[#2ea85a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ios-button active:scale-96"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Changing Password...
                                    </div>
                                ) : (
                                    'Password Change'
                                )}
                            </button>
                        </>
                    ) : (
                        // Show a simplified view when not logged in
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Password Management</h3>
                            <p className="text-gray-600 mb-6">Log in to manage your password and security settings.</p>
                            <button
                                onClick={handleLoginRedirect}
                                className="bg-[#3AC36C] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2ea85a] transition-colors"
                            >
                                Log In to Manage Password
                            </button>
                        </div>
                    )}
                </div>

                {/* Success Modal */}
                <PasswordChangeSuccessModal 
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                />
            </div>
        </AnimatedPage>
    );
};

export default ManagePasswordScreen;