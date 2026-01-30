import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// @ts-ignore
import atas from '../assets/images/atas (2).png';
// @ts-ignore
import bawah from '../assets/images/bawah (2).png';

const SplashScreen = () => {
  console.log('🔍 SplashScreen component rendering');
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any previous redirectAfterLogin when starting fresh
    localStorage.removeItem('redirectAfterLogin');
    
    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Sparkle animation
  const sparkleAnimation = {
    opacity: [0, 1, 0],
    scale: [0.5, 1.2, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const
    }
  };

  // Bounce animation for logo
  const logoAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut" as const
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#3AC36C] relative overflow-hidden">
      {/* Top Diagonal Element - Half size */}
      <img 
        src={atas} 
        alt="" 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-28 z-20"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
      
      {/* Bottom Diagonal Element - Half size */}
      <img 
        src={bawah} 
        alt="" 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-28 z-20"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
      
      {/* Center Logo with Subtle Sparkle Effect */}
      <div className="relative z-30 flex flex-col items-center">
        <div className="relative">
          {/* Sparkle effect elements */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={sparkleAnimation}
          >
            <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full opacity-30"></div>
            <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full opacity-20"></div>
            <div className="absolute bottom-3 left-4 w-1 h-1 bg-white rounded-full opacity-25"></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-white rounded-full opacity-15"></div>
            <div className="absolute top-1/2 left-1 w-1 h-1 bg-white rounded-full opacity-10"></div>
            <div className="absolute top-1/3 right-1 w-1 h-1 bg-white rounded-full opacity-20"></div>
          </motion.div>
          
          <motion.img 
            src="/logo-white.png" 
            alt="FuelFriendly Logo" 
            className="w-48 h-32 relative z-10"
            style={{ transform: 'rotate(360deg)' }}
            animate={logoAnimation}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;