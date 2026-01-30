import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const AccountDeletedSuccessScreen = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // This screen should only be accessible after account deletion
        // Check if there's a deletion flag or if user is logged out
        const userData = localStorage.getItem('user');
        if (userData) {
            // If user is still logged in, redirect to settings
            navigate('/settings');
            return;
        }
        setIsLoggedIn(false);
    }, [navigate]);

    const handleCreateAccount = () => {
        navigate('/register');
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-[#3AC36C] rounded-full flex items-center justify-center mx-auto mb-8">
                        <Check className="w-10 h-10 text-white stroke-[3]" />
                    </div>

                    {/* Success Message */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Your Account has been deleted
                    </h2>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-12">
                        Your FuelFriendly account and all associated data have been permanently removed. We're sorry to see you go!
                    </p>

                    {/* Create Account Button */}
                    <button
                        onClick={handleCreateAccount}
                        className="text-[#3AC36C] font-medium hover:underline transition-colors"
                    >
                        Create account
                    </button>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default AccountDeletedSuccessScreen;