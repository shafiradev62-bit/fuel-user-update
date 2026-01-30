import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, children, className = '', disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 ease-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 select-none ios-button active:scale-95 hover:shadow-lg active:shadow-md';

    // Add haptic feedback on click
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading && navigator.vibrate) {
        navigator.vibrate(20); // Light tap haptic
      }
      props.onClick?.(e);
    };

    const variantClasses = {
      primary: 'bg-[#3AC36C] text-white hover:bg-[#2ea85a] hover:scale-105 focus:ring-[#3AC36C]/50 disabled:opacity-50 shadow-md hover:shadow-xl transition-shadow',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:scale-105 focus:ring-gray-300 disabled:opacity-50 shadow-sm hover:shadow-lg',
      outline: 'border-2 border-[#3AC36C] bg-transparent text-[#3AC36C] hover:bg-[#3AC36C] hover:text-white hover:scale-105 focus:ring-[#3AC36C]/50 disabled:opacity-50 shadow-sm hover:shadow-md',
      ghost: 'bg-transparent text-[#3AC36C] hover:bg-[#3AC36C]/10 hover:scale-105 focus:ring-[#3AC36C]/50 disabled:opacity-50',
      link: 'bg-transparent text-[#3AC36C] underline hover:text-[#2ea85a] hover:scale-105 focus:ring-[#3AC36C]/50 disabled:opacity-50',
    };

    const sizeClasses = {
      sm: 'text-sm py-2 px-4',
      md: 'text-base py-3 px-6',
      lg: 'text-lg py-4 px-8',
    };

    const disabledState = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabledState ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        disabled={disabledState}
        onClick={handleClick}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;