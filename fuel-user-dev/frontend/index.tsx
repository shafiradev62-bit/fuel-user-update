import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/index.css';

// Capacitor imports
import { Capacitor } from '@capacitor/core';

// Simple in-app notification for service worker updates
const showUpdateNotification = () => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `
    fixed top-4 left-1/2 transform -translate-x-1/2 z-[99999]
    bg-white border border-blue-200 rounded-lg p-4 shadow-xl
    animate-fade-in-down
  `;
  
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="flex-1">
        <p class="font-medium text-blue-800">New version available!</p>
        <p class="text-sm text-blue-600 mt-1">Refresh to update the app</p>
        <div class="flex gap-2 mt-3">
          <button id="update-dismiss" class="text-sm text-gray-500 hover:text-gray-700 px-3 py-1">
            Dismiss
          </button>
          <button id="update-refresh" class="text-sm bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600">
            Refresh Now
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Add event listeners
  document.getElementById('update-dismiss')?.addEventListener('click', () => {
    notification.remove();
  });
  
  document.getElementById('update-refresh')?.addEventListener('click', () => {
    window.location.reload();
  });
  
  // Auto remove after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 10000);
};

// Only register service worker for web platform in production
if ('serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show in-app notification
                showUpdateNotification();
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Test image loading
const testImages = [
  '/fuel friend.png',
  '/tulisan.svg',
  '/logo-white.png',
  '/mobil hijau.png'
];

testImages.forEach(src => {
  const img = new Image();
  img.onload = () => console.log(`✅ Loaded: ${src}`);
  img.onerror = () => console.log(`❌ Failed to load: ${src}`);
  img.src = src;
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
