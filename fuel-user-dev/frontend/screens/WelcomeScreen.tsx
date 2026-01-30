import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';
// @ts-ignore
import atas from '../assets/images/atas.png';
// @ts-ignore
import bawah from '../assets/images/bawah.png';
// @ts-ignore
import diagonal from '../assets/images/diagonal.png';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setError(''); // Clear any previous errors
      setIsLoading(true); // Show loading state
      await loginWithGoogle();
    } catch (e: any) {
      console.error('Google login error:', e);
      // Don't show error for cancelled popup requests
      if (e?.message && !e.message.includes('cancelled-popup-request')) {
        setError(e?.message || 'Google login failed. Please try again.');
      }
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <AnimatedPage>
      <div className="relative min-h-screen flex flex-col justify-center items-center p-4 bg-white">
        <div className="flex-grow flex flex-col items-center justify-center z-10 space-y-8">
          <Logo />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="w-full max-w-sm space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary text-white py-3 rounded-full text-base font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl mobile-btn-lg ripple"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-transparent border-2 border-primary text-primary py-3 rounded-full text-base font-semibold transition-all active:scale-95 hover:shadow-md mobile-btn-lg ripple"
            >
              Sign up
            </button>
            <div className="flex items-center justify-center space-x-2">
              <hr className="w-1/4 border-gray-300 dark:border-gray-600" />
              <span className="text-gray-500 dark:text-gray-400 text-sm">Or</span>
              <hr className="w-1/4 border-gray-300 dark:border-gray-600" />
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-transparent border-2 border-gray-300 dark:border-gray-600 text-light-text dark:text-dark-text py-3 rounded-full text-base font-semibold transition-all active:scale-95 hover:shadow-md mobile-btn-lg disabled:opacity-50 ripple"
            >
              {isLoading ? (
                'Connecting...'
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5 mr-2" />
                  Continue with Google
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default WelcomeScreen;