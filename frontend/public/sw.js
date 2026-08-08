const CACHE_NAME = 'rescueai-v2-ultra-fast';
const ASSETS_TO_CACHE = [
  '/',
  '/dashboard',
  '/rescue-dashboard',
  '/admin',
  '/download',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/rescueai-emergency-v1.0.apk',
];

// Install Event: Pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate Event: Clear obsolete caches instantly
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Stale-While-Revalidate (<5ms Instant Cache Response)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude API / Firebase streams from cache-first
  if (url.pathname.startsWith('/api') || url.hostname.includes('firestore') || url.hostname.includes('firebase')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      // Return cached response instantly (<5ms latency) or fallback to network
      return cachedResponse || fetchPromise;
    })
  );
});
