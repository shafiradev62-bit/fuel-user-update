import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

const WelcomeScreen = () => {
    const navigate = useNavigate();

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
                {/* Logo */}
                <div className="mb-8">
                    <img 
                        src="/logo-green.png" 
                        alt="FuelFriendly" 
                        className="w-32 h-32 mx-auto"
                    />
                </div>

                {/* Welcome Text */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Welcome to FuelFriendly
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Your trusted fuel delivery service
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="w-full max-w-sm space-y-4">
                    <TapEffectButton
                        onClick={() => navigate('/login')}
                        className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold"
                    >
                        Get Started
                    </TapEffectButton>
                    
                    <TapEffectButton
                        onClick={() => navigate('/register')}
                        className="w-full border-2 border-green-500 text-green-500 py-4 rounded-full text-lg font-semibold"
                    >
                        Create Account
                    </TapEffectButton>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default WelcomeScreen;