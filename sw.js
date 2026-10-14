// Service Worker for Kids Talking Learning Book PWA
const CACHE_NAME = 'kids-talking-book-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/data/vocabulary.js',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/app_bg.png',
  '/images/apple.png',
  '/images/mango.png',
  '/images/watermelon.png',
  '/images/banana.png',
  '/images/lion.png',
  '/images/tiger.png',
  '/images/swan.png',
  '/images/butterfly.png',
  '/images/rose.png',
  '/images/car.png',
  '/images/bed.png',
  '/images/face.png',
  '/images/mountain.png',
  '/sounds/sound_super.mp3',
  '/sounds/sound_very_good.mp3',
  '/sounds/sound_nice.mp3',
  '/sounds/sound_correct_answer.mp3',
  '/sounds/sound_win_puzzle.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Some assets failed caching:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          event.request.url.startsWith(self.location.origin)
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback to offline index
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
