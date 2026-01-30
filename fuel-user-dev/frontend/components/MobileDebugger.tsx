import React, { useState, useEffect } from 'react';

interface ErrorLog {
  timestamp: string;
  message: string;
  type: 'error' | 'network' | 'api';
}

const MobileDebugger = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Capture console errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      setErrors(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type: 'error'
      }]);
      originalError(...args);
    };

    // Capture network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          setErrors(prev => [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            message: `Network Error: ${response.status} ${response.statusText} - ${args[0]}`,
            type: 'network'
          }]);
        }
        return response;
      } catch (error) {
        setErrors(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          message: `Fetch Failed: ${error.message} - ${args[0]}`,
          type: 'network'
        }]);
        throw error;
      }
    };

    return () => {
      console.error = originalError;
      window.fetch = originalFetch;
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full z-50"
        style={{ fontSize: '12px' }}
      >
        🐛 Debug ({errors.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 p-4">
      <div className="bg-white rounded-2xl h-full overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold">Debug Log</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-red-500 font-bold"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <p><strong>API URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'https://apidecor.kelolahrd.life'}</p>
            <p><strong>Online:</strong> {navigator.onLine ? '✅' : '❌'}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
          </div>
          
          {errors.length === 0 ? (
            <p className="text-gray-500">No errors logged</p>
          ) : (
            errors.map((error, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-100 rounded text-xs">
                <div className="font-bold text-red-600">[{error.timestamp}] {error.type.toUpperCase()}</div>
                <div className="break-words">{error.message}</div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={() => setErrors([])}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Clear Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDebugger;