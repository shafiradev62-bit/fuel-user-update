import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import AnimatedPage from './AnimatedPage';
import { useAppContext } from '../App';
import TapEffectButton from './TapEffectButton';

const VerificationSuccess = ({ type = 'email', formData, onCreateAccount }: { type?: 'email' | 'whatsapp' | 'success'; formData?: any; onCreateAccount?: () => Promise<void> }) => {
  const navigate = useNavigate();
  const { login, updateUser } = useAppContext();
  const [loading, setLoading] = React.useState(false);

  const handleGoToHome = async () => {
    if (onCreateAccount) {
      setLoading(true);
      try {
        // Create account and save token
        await onCreateAccount();
        // Navigate to home after successful account creation
        navigate('/home');
      } catch (error) {
        console.error('Failed to create account:', error);
        setLoading(false);
      }
    } else {
      navigate('/home');
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Back Button */}
        <div className="flex items-center p-4">
          <TapEffectButton
            onClick={handleGoToHome}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img src="/Back.png" alt="Back" className="w-6 h-6" />
          </TapEffectButton>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
          {/* Success Icon with Shield */}
          <div className="relative">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-16 h-20 bg-green-500 rounded-t-full rounded-b-lg flex items-center justify-center relative">
                <Check size={28} className="text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {type === 'email' ? 'Email verified Successfully' : 'WhatsApp verified Successfully'}
          </h1>

          {/* Description */}
          <p className="text-base text-gray-600 text-center max-w-sm">
            Your account is ready to use.
          </p>

          {/* Go to Home Button */}
          <button
            onClick={handleGoToHome}
            disabled={loading}
            className="w-full max-w-sm bg-green-500 text-white py-4 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Go to Home'}
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

export default VerificationSuccess;