import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
    animationData: any;
    width?: number;
    height?: number;
    loop?: boolean;
    autoplay?: boolean;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ 
    animationData, 
    width = 100, 
    height = 100, 
    loop = true, 
    autoplay = true 
}) => {
    const style = {
        width: `${width}px`,
        height: `${height}px`,
    };

    return (
        <Lottie 
            animationData={animationData} 
            style={style}
            loop={loop}
            autoplay={autoplay}
        />
    );
};

export default LottieAnimation;
