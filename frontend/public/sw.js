// Minimal service worker: cache shell and listen for sync (optional)
const CACHE_NAME = 'rescueai-shell-v1';
const toCache = ['/', '/index.html', '/styles/globals.css'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(toCache)));
  self.skipWaiting();
});

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  // Only cache-first for shell assets; let API calls go network-first
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
