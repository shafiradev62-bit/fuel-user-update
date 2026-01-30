import React, { useRef, useState } from 'react';
import '../styles/mobile-animations.css';

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  haptic?: boolean;
  ripple?: boolean;
  loading?: boolean;
  success?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const MobileButton = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  haptic = true,
  ripple = true,
  loading = false,
  success = false,
  onClick,
  disabled,
  ...props
}: MobileButtonProps) => {
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const triggerHapticFeedback = () => {
    if (haptic && window.navigator && 'vibrate' in window.navigator) {
      window.navigator.vibrate(50);
    }
  };

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ripple || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    triggerHapticFeedback();
    createRipple(e);
    onClick?.(e);
  };

  const baseClasses = 'mobile-button press-feedback font-medium rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-[#3AC36C] hover:bg-[#2ea85a] text-white shadow-lg hover:shadow-xl focus:ring-[#3AC36C]',
    secondary: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg focus:ring-gray-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300'
  };

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm min-h-[36px]',
    md: 'py-3 px-6 text-base min-h-[44px]',
    lg: 'py-4 px-8 text-lg min-h-[52px]'
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${loading ? 'loading-button' : ''}
    ${success ? 'success-button' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <button
      ref={buttonRef}
      className={classes.trim()}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      <span className="relative inline-flex items-center justify-center gap-2">
        {loading && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        
        {/* Ripple Effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="ripple-effect"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        
        {children}
      </span>
    </button>
  );
};

export default MobileButton;
