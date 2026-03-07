const CACHE_NAME = 'skov-app-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Installation: Gemmer filerne til offline brug
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  // Tvinger den nye Service Worker til at overtage med det samme
  self.skipWaiting(); 
});

// Aktivering: Rydder op i gamle versioner
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: "Network First" strategi (Hent fra nettet først, ellers brug offline-cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
