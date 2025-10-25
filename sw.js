const CACHE_NAME = 'trains';
const urlsToCache = [
    '/',
    '/index.html',
    '/src/fonts.css',
    '/src/main.css',
    '/src/reset.css',
    '/src/js/app.js',
    '/src/favicon/icon-192.png',
    '/src/favicon/icon-512.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return Promise.all(
                    urlsToCache.map(function(url) {
                        return cache.add(url).catch(function(error) {
                            console.log('Failed to cache:', url, error);

                            return Promise.resolve();
                        });
                    })
                );
            })
            .then(function() {
                console.log('Service Worker: Install completed');
                return self.skipWaiting();
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});