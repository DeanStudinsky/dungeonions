// Service Worker for PWA support
const CACHE_NAME = 'dungeonions-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/config/GameConfig.js',
  '/src/config/TileConfig.js',
  '/src/entities/Player.js',
  '/src/entities/Enemy.js',
  '/src/entities/Projectile.js',
  '/src/managers/MapManager.js',
  '/src/managers/WaveManager.js',
  '/src/managers/ScoreManager.js',
  '/src/scenes/BootScene.js',
  '/src/scenes/MenuScene.js',
  '/src/scenes/GameScene.js',
  '/src/scenes/UIScene.js',
  '/manifest.json',
  '/assets/tilemap.png',
  'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // If both cache and network fail, show offline page
          return caches.match('/index.html');
        });
      })
  );
});
