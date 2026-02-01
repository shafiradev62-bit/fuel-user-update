// Simple service worker for FuelFriendly
const CACHE_NAME = 'fuelfriendly-v1';
const STATIC_ASSETS = [
  '/assets/',
  '/icons/',
  '/images/',
  '.png',
  '.jpg',
  '.svg',
  '.css',
  '.js'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip caching for HTML pages and API calls
  if (event.request.mode === 'navigate' || 
      url.pathname.includes('/api/') ||
      event.request.headers.get('accept')?.includes('text/html')) {
    return; // Let browser handle normally
  }
  
  // Only cache static assets
  const isStaticAsset = STATIC_ASSETS.some(asset => 
    url.pathname.includes(asset)
  );
  
  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  }
});