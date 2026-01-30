import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    animation?: 'pulse' | 'wave' | 'none';
    width?: string;
    height?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'text',
    animation = 'pulse',
    width,
    height
}) => {
    const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';

    const variantClasses = {
        text: 'rounded h-4 w-full',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: ''
    };

    const style: React.CSSProperties = {
        width,
        height
    };

    return (
        <>
            <div
                className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
                style={style}
            />
            {animation === 'wave' && (
                <style>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
            )}
        </>
    );
};

export default Skeleton;
