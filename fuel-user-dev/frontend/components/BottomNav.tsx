import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Lottie from 'lottie-react';

// Import the image assets
import homeIcon from '../assets/icons/home.png';
import myOrdersIcon from '../assets/icons/my-orders.png';
import trackOrderIcon from '../assets/icons/track-order.png';
import settingsIcon from '../assets/icons/settings.png';
import tapAnimation from '../assets/animations/loading.json';

const NavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => {
    const [tapId, setTapId] = useState(0);
    const [showTap, setShowTap] = useState(false);
    const hideTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (hideTimerRef.current) {
                window.clearTimeout(hideTimerRef.current);
                hideTimerRef.current = null;
            }
        };
    }, []);

    const triggerTap = () => {
        setTapId((v) => v + 1);
        setShowTap(true);
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = window.setTimeout(() => {
            setShowTap(false);
        }, 550);
    };

    return (
        <NavLink
            to={to}
            onClick={triggerTap}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 w-full text-sm md:text-base transition-[transform,opacity,color] duration-200 ease-out active:scale-95 hover:opacity-90 ${
                    isActive ? 'text-[#3AC36C]' : 'text-gray-400'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <div className="relative w-6 h-6 md:w-7 md:h-7">
                        {showTap && (
                            <div className="absolute inset-0 pointer-events-none" style={{ transform: 'scale(1.9)' }}>
                                <Lottie
                                    key={tapId}
                                    animationData={tapAnimation as any}
                                    loop={false}
                                    autoplay={true}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        )}
                        <img
                            src={icon}
                            alt={label}
                            className={`w-6 h-6 md:w-7 md:h-7 object-contain transition-[transform,filter,opacity] duration-200 ease-out ${
                                isActive ? 'filter-green' : 'grayscale'
                            }`}
                            style={{
                                filter: isActive ? 'brightness(0) saturate(100%) invert(64%) sepia(98%) saturate(451%) hue-rotate(81deg) brightness(95%) contrast(87%)' : 'grayscale(100%)'
                            }}
                        />
                    </div>
                    <span
                        className={`text-xs md:text-sm mt-1 font-medium transition-colors duration-200 ${
                            isActive ? 'text-[#3AC36C]' : 'text-gray-400'
                        }`}
                    >
                        {label}
                    </span>
                </>
            )}
        </NavLink>
    );
};

const BottomNav = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg w-full z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="flex justify-around items-center h-16 md:h-20 px-2 md:px-4">
                <NavItem to="/home" icon={homeIcon} label="Home" />
                <NavItem to="/orders" icon={myOrdersIcon} label="My Orders" />
                <NavItem to="/track" icon={trackOrderIcon} label="Track Order" />
                <NavItem to="/settings" icon={settingsIcon} label="Settings" />
            </div>
        </footer>
    );
};

export default BottomNav;