import React, { useEffect, useState } from 'react';

const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(true);

  useEffect(() => {
    setReady(false);
    // Add slight delay for smoother transition
    const timer = setTimeout(() => {
      setReady(true);
      // Add haptic feedback for page load
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page ${ready ? 'animate-page-enter' : 'animate-page-exit'}`}>
      {children}
    </div>
  );
};

export default AnimatedPage;