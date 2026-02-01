import React, { useState, useEffect, useRef } from 'react';
import { Mail, MessageSquare, ArrowLeft } from 'lucide-react';
import TapEffectButton from './TapEffectButton';

interface MobileOTPFormProps {
  onBack: () => void;
  onSuccess: (userData: any) => void;
  onError: (message: string) => void;
}

const MobileOTPForm: React.FC<MobileOTPFormProps> = ({ onBack, onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Timer effect for resend cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Focus first OTP input when OTP is sent
  useEffect(() => {
    if (otpSent && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [otpSent]);

  const startResendTimer = () => {
    setCanResend(false);
    setTimer(60);
  };

  const sendOTP = async () => {
    if (!email) {
      onError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      onError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const { apiSendEmailOTP } = await import('../services/api');
      const result = await apiSendEmailOTP(email);
      
      setOtpSent(true);
      startResendTimer();
      // Show success message
      if (result.simulated && result.otp) {
        onError(`OTP sent! For testing: ${result.otp}`);
      } else {
        onError('OTP sent to your email!');
      }
    } catch (err: any) {
      console.error('Send OTP error:', err);
      onError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isLoading) return; // Prevent double submission
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      onError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const { apiVerifyEmailOTP } = await import('../services/api');
      const result = await apiVerifyEmailOTP(email, otpCode);
      
      // Create user data for successful login
      const userData = {
        id: `user-${Date.now()}`,
        fullName: email.split('@')[0],
        email,
        phone: '',
        city: '',
        avatarUrl: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
        vehicles: []
      };

      onSuccess(userData);
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      onError(err.message || 'Invalid OTP code');
      // Clear OTP fields on error
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!canResend || isLoading) return;
    
    setIsLoading(true);
    try {
      const { apiSendEmailOTP } = await import('../services/api');
      const result = await apiSendEmailOTP(email);
      
      // Reset OTP fields
      setOtp(['', '', '', '', '', '']);
      startResendTimer();
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
      // Show success message
      if (result.simulated && result.otp) {
        onError(`New OTP sent! For testing: ${result.otp}`);
      } else {
        onError('New OTP sent to your email!');
      }
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      onError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.match(/^[0-9]$/) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value entered
      if (value !== '' && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return; // Prevent double submission
    
    if (otpSent) {
      verifyOTP(e);
    } else {
      sendOTP();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Back button */}
      <TapEffectButton
        onClick={onBack}
        className="mb-4 p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
      </TapEffectButton>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {otpSent ? 'Verify OTP' : 'Email Login'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {otpSent 
            ? `Enter the 6-digit code sent to ${email}` 
            : 'Enter your email to receive a verification code'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!otpSent ? (
          // Email input form
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-base mobile-text-base"
                autoFocus
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-primary text-white py-3 rounded-xl text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:bg-primary/70 mobile-btn-md ripple"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          // OTP input form
          <div className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mobile-text-2xl"
                  disabled={isLoading}
                />
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="flex-1 bg-primary text-white py-3 rounded-xl text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:bg-primary/70 mobile-btn-md ripple"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isLoading && otp.join('').length === 6) {
                    verifyOTP(e);
                  }
                }}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
              
              <button
                type="button"
                onClick={resendOTP}
                disabled={!canResend || isLoading}
                className="flex-1 py-3 rounded-xl text-base font-semibold border border-primary text-primary hover:bg-primary/10 transition-colors disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed mobile-btn-md"
              >
                {canResend ? 'Resend' : `${timer}s`}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Additional info */}
      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default MobileOTPForm;