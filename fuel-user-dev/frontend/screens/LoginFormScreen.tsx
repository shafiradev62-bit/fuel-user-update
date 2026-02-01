import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';

const LoginFormScreen = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.classList.add('login-screen');
    return () => {
      document.body.classList.remove('login-screen');
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 handleLogin called with:', { email, password });
    setError('');
    setIsLoading(true);

    try {
      console.log('🔍 Calling login function...');
      await login(email, password);
      console.log('🔍 Login function completed');

      // Check if there's a redirect URL stored
      const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');

      // Check if there's pending checkout data
      const pendingCheckout = sessionStorage.getItem('pendingCheckout');

      if (pendingCheckout && redirectAfterLogin === '/payment') {
        // Clean up storage
        localStorage.removeItem('redirectAfterLogin');
        sessionStorage.removeItem('pendingCheckout');

        // Navigate to payment screen with restored state
        const checkoutState = JSON.parse(pendingCheckout);
        navigate('/payment', { state: checkoutState });
      } else if (redirectAfterLogin) {
        // Clean up the stored redirect URL
        localStorage.removeItem('redirectAfterLogin');
        // Navigate to the originally intended location
        navigate(redirectAfterLogin);
      } else {
        // Default to home if no redirect URL stored
        navigate('/home');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();

      // Check if there's a redirect URL stored
      const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
      if (redirectAfterLogin) {
        // Clean up the stored redirect URL
        localStorage.removeItem('redirectAfterLogin');
        // Navigate to the originally intended location
        navigate(redirectAfterLogin);
      } else {
        // Default to home if no redirect URL stored
        navigate('/home');
      }
    } catch (e: any) {
      setError(e?.message || 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[402px] mx-auto min-h-screen bg-white">
      {/* Main Content */}
      <div className="px-4 pt-6 pb-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo terbaru.png" alt="FuelFriendly" className="w-[150px] h-auto aspect-square object-contain" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#3F4249]">Sign In</h1>
        </div>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          {/* Customer Label */}
          <div className="w-full h-10 rounded-[30px] border border-black/50 px-4 flex items-center justify-center text-[#3F4249] bg-white text-sm font-bold">
            Customer
          </div>

          <input
            type="text"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-4 px-6 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3AC36C] focus:border-[#3AC36C] placeholder-gray-400 text-base transition-all duration-200"
            required
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-4 px-6 pr-14 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3AC36C] focus:border-[#3AC36C] placeholder-gray-400 text-base transition-all duration-200"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[#FF6B6B] text-sm hover:underline"
            >
              Forgotten Password
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full py-4 rounded-full font-semibold text-base shadow-lg mt-6"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={() => console.log('🔍 Login button clicked')}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full py-4 rounded-full flex items-center justify-center gap-3 shadow-md"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            isLoading={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLoading ? "Connecting..." : "Continue with Google"}
          </Button>
        </form>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#101010] rounded-full mb-2"></div>
    </div>
  );
};

export default LoginFormScreen;