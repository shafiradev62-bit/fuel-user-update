import React, { forwardRef } from 'react';

interface TouchFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  className?: string;
}

const TouchFeedback = forwardRef<HTMLDivElement, TouchFeedbackProps>(
  ({ children, onPress, onPressIn, onPressOut, disabled = false, className = '', ...props }, ref) => {
    const handleMouseDown = (e: React.MouseEvent) => {
      if (onPressIn) onPressIn();
    };

    const handleMouseUp = (e: React.MouseEvent) => {
      if (onPressOut) onPressOut();
    };

    const handleClick = (e: React.MouseEvent) => {
      if (onPress && !disabled) {
        onPress();
      }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      if (onPressIn) onPressIn();
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (onPressOut) onPressOut();
    };

    const handleTouchCancel = (e: React.TouchEvent) => {
      if (onPressOut) onPressOut();
    };

    const computedClassName = `${className} transform transition-all duration-75 ease-out ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-97 cursor-pointer active:opacity-80'
    }`;

    return (
      <div
        ref={ref}
        className={computedClassName}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        style={{
          touchAction: 'manipulation', // Improves touch responsiveness
          userSelect: 'none', // Prevents text selection during tap
        }}
        {...props}
      >
        {React.isValidElement(children) 
          ? React.cloneElement(children, {
              ...(children.props || {}),
              style: {
                ...(children.props?.style || {}),
                pointerEvents: 'none', // Allow events to bubble to the wrapper
              }
            })
          : children}
      </div>
    );
  }
);

TouchFeedback.displayName = 'TouchFeedback';

export default TouchFeedback;