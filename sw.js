const CACHE_NAME = 'trains';
const BASE_PATH = '/trains/';
const urlsToCache = [
    BASE_PATH,
    BASE_PATH + 'index.html',
    BASE_PATH + 'src/fonts.css',
    BASE_PATH + 'src/main.css',
    BASE_PATH + 'src/reset.css',
    BASE_PATH + 'src/js/app.js',
    BASE_PATH + 'src/favicon/icon-192.png',
    BASE_PATH + 'src/favicon/icon-512.png',
    BASE_PATH + 'src/ic_etrain_type_light.svg',
    BASE_PATH + 'src/ic_etrain_type_dark.svg',
    BASE_PATH + 'pub/barcode_0002.jpg',
    BASE_PATH + 'src/fonts/ys_text_medium.ttf',
    BASE_PATH + 'src/fonts/ys_text_regular.ttf',
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
    const requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin &&
        requestUrl.pathname.startsWith(BASE_PATH)) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                        if (response) {
                            return response;
                        }
                        return fetch(event.request).catch(() =>
                            caches.match(BASE_PATH + 'index.html')
                        );
                    }
                )
        );
    }


});