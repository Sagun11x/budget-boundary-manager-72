const CACHE_NAME = 'bb-manager-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Check if the request is for navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's supported
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Otherwise, try to get the resource from the cache
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // If not in cache, try to fetch it
          const networkResponse = await fetch(event.request);
          
          // Clone the response before using it to save it in the cache
          const responseToCache = networkResponse.clone();
          
          // Add the new response to cache
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, responseToCache);
          
          return networkResponse;
        } catch (error) {
          // If both cache and network fail, return a fallback
          const cache = await caches.open(CACHE_NAME);
          const fallbackResponse = await cache.match('/index.html');
          if (fallbackResponse) {
            return fallbackResponse;
          }
          throw error;
        }
      })()
    );
  } else {
    // For non-navigation requests, use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
