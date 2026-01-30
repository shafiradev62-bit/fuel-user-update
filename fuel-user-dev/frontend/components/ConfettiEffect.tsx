import React, { useEffect, useState } from 'react';

interface ConfettiEffectProps {
    show: boolean;
    duration?: number;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ show, duration = 3000 }) => {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; rotation: number; delay: number }>>([]);

    useEffect(() => {
        if (show) {
            const colors = ['#3AC36C', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: -10,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                delay: Math.random() * 0.5
            }));
            setParticles(newParticles);

            const timer = setTimeout(() => {
                setParticles([]);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration]);

    if (!show || particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute w-3 h-3 animate-confetti"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        backgroundColor: particle.color,
                        transform: `rotate(${particle.rotation}deg)`,
                        animationDelay: `${particle.delay}s`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '0'
                    }}
                />
            ))}
            <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default ConfettiEffect;
