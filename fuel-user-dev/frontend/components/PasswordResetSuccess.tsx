import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import AnimatedPage from './AnimatedPage';
import TapEffectButton from './TapEffectButton';

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Back Button */}
        <div className="flex items-center p-4">
          <TapEffectButton
            onClick={() => navigate('/login')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </TapEffectButton>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
          {/* Success Icon with Shield */}
          <div className="relative">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
              {/* Shield shape with checkmark */}
              <div className="relative">
                <svg width="64" height="72" viewBox="0 0 64 72" fill="none" className="text-green-500">
                  <path 
                    d="M32 4L8 16V36C8 52 32 68 32 68C32 68 56 52 56 36V16L32 4Z" 
                    fill="currentColor"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check size={24} className="text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Password Reset Successfully
          </h1>

          {/* Description */}
          <p className="text-base text-gray-600 text-center max-w-sm">
            Your Password has been changed successfully
          </p>

          {/* Go to Home Button */}
          <button
            onClick={() => navigate('/login')}
            className="w-full max-w-sm bg-green-500 text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl"
          >
            Go to Home
          </button>

          {/* Illustration */}
          <div className="mt-12 flex items-end justify-center">
            <div className="relative">
              {/* Character illustration */}
              <div className="flex flex-col items-center mr-4">
                {/* Head */}
                <div className="w-8 h-8 bg-orange-300 rounded-full mb-1"></div>
                {/* Body */}
                <div className="w-6 h-12 bg-green-500 rounded-t-lg"></div>
                {/* Legs */}
                <div className="w-8 h-6 bg-gray-800 rounded-b-lg"></div>
              </div>
              
              {/* Phone mockup */}
              <div className="w-32 h-56 bg-white rounded-3xl border-4 border-gray-300 shadow-lg flex flex-col p-3">
                {/* Phone header */}
                <div className="w-full h-2 bg-gray-300 rounded-full mb-4"></div>
                
                {/* Content lines */}
                <div className="space-y-2 mb-6">
                  <div className="w-3/4 h-1.5 bg-gray-300 rounded"></div>
                  <div className="w-1/2 h-1.5 bg-gray-300 rounded"></div>
                  <div className="w-2/3 h-1.5 bg-gray-300 rounded"></div>
                </div>
                
                {/* Success checkmark in phone */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={20} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PasswordResetSuccess;