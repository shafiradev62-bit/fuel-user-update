import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import PasswordResetSuccess from '../components/PasswordResetSuccess';
import { apiSendEmailOTP, apiVerifyEmailOTP, apiResetPassword } from '../services/api';
import TapEffectButton from '../components/TapEffectButton';

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start resend timer
  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await apiSendEmailOTP(email);
      if (result.success) {
        setCodeSent(true);
        setSuccess(result.message);
        startResendTimer();
      } else {
        setError(result.error || 'Failed to send verification code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return; // Prevent double submission
    
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const otpCode = otp.join('');
      const result = await apiVerifyEmailOTP(email, otpCode);
      if (result.success) {
        setOtpVerified(true);
        setSuccess(result.message);
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiResetPassword(email, newPassword);
      if (result.success) {
        setPasswordResetSuccess(true);
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await apiSendEmailOTP(email);
      if (result.success) {
        setSuccess(result.message);
        startResendTimer();
      } else {
        setError(result.error || 'Failed to resend code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show success screen
  if (passwordResetSuccess) {
    return <PasswordResetSuccess />;
  }

  if (otpVerified) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg text-light-text dark:text-dark-text">
          {/* Back Button */}
          <div className="flex items-center p-4">
            <TapEffectButton
              onClick={() => setOtpVerified(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <img src="/Back.png" alt="Back" className="w-5 h-5" />
            </TapEffectButton>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
            {/* Lock Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <Lock size={40} className="text-green-500" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">
              Reset Password
            </h1>

            {/* Description */}
            <p className="text-base text-gray-600 dark:text-gray-400 text-center max-w-sm">
              Reset Your Password
            </p>

            {/* Error/Success Messages */}
            {error && (
              <div className="w-full max-w-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {success && (
              <div className="w-full max-w-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-green-600 dark:text-green-400 text-sm text-center">{success}</p>
              </div>
            )}

            {/* Reset Password Form */}
            <form onSubmit={handleResetPassword} className="w-full max-w-sm space-y-4">
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 text-base placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#3AC36C] hover:bg-[#2ea85a] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-70"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (codeSent) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg text-light-text dark:text-dark-text">
          {/* Back Button */}
          <div className="flex items-center p-4">
            <TapEffectButton
              onClick={() => setCodeSent(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <img src="/Back.png" alt="Back" className="w-5 h-5" />
            </TapEffectButton>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
            {/* Mail Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <Mail size={40} className="text-green-500" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">
              Verify code
            </h1>

            {/* Description */}
            <p className="text-base text-gray-600 dark:text-gray-400 text-center max-w-sm">
              Enter six-digits verification code sent to {email}
            </p>

            {/* Error/Success Messages */}
            {error && (
              <div className="w-full max-w-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {success && (
              <div className="w-full max-w-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-green-600 dark:text-green-400 text-sm text-center">{success}</p>
              </div>
            )}

            {/* OTP Input */}
            <form onSubmit={handleVerifyOtp} className="w-full max-w-sm space-y-6">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-xl font-semibold border-2 border-[#3AC36C] rounded-xl focus:outline-none focus:border-[#3AC36C] focus:ring-2 focus:ring-[#3AC36C]/20 bg-white transition-all duration-200"
                  />
                ))}
              </div>
              
              <button
                type="submit"
                disabled={isLoading || otp.some(digit => !digit)}
                className="w-full py-4 bg-[#3AC36C] hover:bg-[#2ea85a] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-70"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isLoading && !otp.some(digit => !digit)) {
                    handleVerifyOtp(e);
                  }
                }}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </form>

            {/* Resend Section */}
            <div className="text-center space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                Haven't received the verification code?
              </p>
              <button
                onClick={handleResend}
                disabled={!canResend || isLoading}
                className="text-green-500 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Resend
              </button>
              {!canResend && (
                <p className="text-gray-500 text-sm">{resendTimer}s</p>
              )}
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg text-light-text dark:text-dark-text">
        {/* Back Button */}
        <div className="flex items-center p-4">
          <TapEffectButton
            onClick={() => navigate('/login')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </TapEffectButton>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
          {/* Lock Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <Lock size={40} className="text-green-500" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">
            Forget Password
          </h1>

          {/* Description */}
          <p className="text-base text-gray-600 dark:text-gray-400 text-center max-w-sm">
            Enter your email address to receive verification code
          </p>

          {/* Error/Success Messages */}
          {error && (
            <div className="w-full max-w-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="w-full max-w-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-green-600 dark:text-green-400 text-sm text-center">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSendCode} className="w-full max-w-sm space-y-6">
            <input
              type="email"
              placeholder="Email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-4 px-6 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3AC36C] focus:border-[#3AC36C] placeholder-gray-400 text-base transition-all duration-200"
              required
            />
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#3AC36C] hover:bg-[#2ea85a] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ForgotPasswordScreen;