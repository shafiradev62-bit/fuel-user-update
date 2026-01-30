import React, { useEffect, useRef, useState, useCallback } from 'react';
import Lottie from 'lottie-react';

import tapAnimation from '../assets/animations/loading.json';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'luxury';
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
  particles?: boolean;
  glow?: boolean;
  shine?: boolean;
  morphing?: boolean;
}

const PremiumButton = ({
  children,
  className = '',
  onClick,
  type,
  disabled,
  variant = 'primary',
  size = 'md',
  magnetic = true,
  particles = true,
  glow = true,
  shine = true,
  morphing = false,
  ...props
}: PremiumButtonProps) => {
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number, delay?: number}>>([]);
  const [buttonParticles, setButtonParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, life: number}>>([]);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationFrameRef = useRef<number>();

  // Advanced haptic feedback patterns
  const triggerHapticFeedback = useCallback(() => {
    if (window.navigator && 'vibrate' in window.navigator) {
      switch (variant) {
        case 'luxury':
          window.navigator.vibrate([8, 3, 8, 3, 15]);
          break;
        case 'primary':
          window.navigator.vibrate([10, 5, 10]);
          break;
        default:
          window.navigator.vibrate(15);
      }
    }
  }, [variant]);

  // Enhanced ripple system with multiple layers
  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create multiple ripples for premium effect
    const newRipples = [
      { id: Date.now(), x, y },
      { id: Date.now() + 1, x, y, delay: 0.1 },
      { id: Date.now() + 2, x, y, delay: 0.2 }
    ];
    
    setRipples(prev => [...prev, ...newRipples]);
    
    newRipples.forEach(ripple => {
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, 800 + (ripple.delay || 0) * 1000);
    });
  }, []);

  // Particle system with physics
  const createParticles = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !particles) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 3,
      life: 1.0
    }));
    
    setButtonParticles(prev => [...prev, ...newParticles]);
  }, [particles]);

  // Magnetic effect with smooth following
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !buttonRef.current || !isHovered) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.2;
    const deltaY = (e.clientY - centerY) * 0.2;
    
    setMagneticOffset({ x: deltaX, y: deltaY });
  }, [magnetic, isHovered]);

  // Particle animation loop
  const animateParticles = useCallback(() => {
    setButtonParticles(prev => prev
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.3, // gravity
        life: particle.life - 0.02
      }))
      .filter(particle => particle.life > 0)
    );
    
    animationFrameRef.current = requestAnimationFrame(animateParticles);
  }, []);

  useEffect(() => {
    if (buttonParticles.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [buttonParticles.length, animateParticles]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    triggerHapticFeedback();
    createRipple(e);
    createParticles(e);
    onClick?.(e);
  }, [disabled, triggerHapticFeedback, createRipple, createParticles, onClick]);

  // Variant styles with premium gradients
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: glow && isHovered 
        ? '0 0 40px rgba(102, 126, 234, 0.4), 0 15px 35px rgba(0, 0, 0, 0.2)' 
        : '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
    secondary: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      boxShadow: glow && isHovered 
        ? '0 0 40px rgba(240, 147, 251, 0.4), 0 15px 35px rgba(0, 0, 0, 0.2)' 
        : '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
    luxury: {
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6347 100%)',
      boxShadow: glow && isHovered 
        ? '0 0 50px rgba(255, 215, 0, 0.6), 0 20px 40px rgba(0, 0, 0, 0.3)' 
        : '0 10px 30px rgba(255, 215, 0, 0.3)',
    }
  };

  const sizeStyles = {
    sm: 'py-3 px-6 text-sm min-h-[44px]',
    md: 'py-4 px-8 text-base min-h-[52px]',
    lg: 'py-5 px-12 text-lg min-h-[60px]'
  };

  return (
    <button
      ref={buttonRef}
      type={type ?? 'button'}
      className={`
        relative overflow-hidden
        transform transition-all duration-300 ease-out
        active:scale-95
        rounded-2xl
        font-semibold
        text-white
        border-0
        cursor-pointer
        outline-none
        focus:ring-4 focus:ring-opacity-50
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        ...variantStyles[variant],
        transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px) ${isPressed ? 'scale(0.95)' : 'scale(1)'}`,
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        if (magnetic) triggerHapticFeedback();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setMagneticOffset({ x: 0, y: 0 });
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Multi-layer ripple effects */}
      {ripples.map((ripple, index) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '30px',
            height: '30px',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            animation: `premium-ripple ${0.8 + (index * 0.1)}s ease-out`,
            animationDelay: `${ripple.delay || 0}s`,
          }}
        />
      ))}

      {/* Particle system */}
      {buttonParticles.map(particle => (
        <span
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            width: '6px',
            height: '6px',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            backgroundColor: variant === 'luxury' ? '#FFD700' : '#FFFFFF',
            boxShadow: `0 0 10px ${variant === 'luxury' ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'}`,
            opacity: particle.life,
          }}
        />
      ))}

      {/* Premium shine effect */}
      {shine && (
        <span 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
            transform: 'translateX(-100%)',
            animation: isHovered ? 'premium-shine 2s ease-in-out infinite' : 'none',
          }}
        />
      )}

      {/* Glow overlay */}
      {glow && isHovered && (
        <span 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Morphing border for luxury variant */}
      {morphing && variant === 'luxury' && (
        <span 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            border: '2px solid transparent',
            background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF6347, #FFD700) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'border-rotate 3s linear infinite',
          }}
        />
      )}
    </button>
  );
};

// Add premium animations to global styles
const premiumStyles = document.createElement('style');
premiumStyles.textContent = `
  @keyframes premium-ripple {
    0% {
      width: 30px;
      height: 30px;
      opacity: 0.8;
      box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
    }
    50% {
      opacity: 0.4;
      box-shadow: 0 0 50px rgba(255, 255, 255, 0.3);
    }
    100% {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }

  @keyframes premium-shine {
    0% {
      transform: translateX(-100%) rotate(25deg);
    }
    50%, 100% {
      transform: translateX(200%) rotate(25deg);
    }
  }

  @keyframes glow-pulse {
    0%, 100% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.4;
    }
  }

  @keyframes border-rotate {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
    }
  }
`;

if (!document.head.querySelector('style[data-premium-button]')) {
  premiumStyles.setAttribute('data-premium-button', 'true');
  document.head.appendChild(premiumStyles);
}

export default PremiumButton;
