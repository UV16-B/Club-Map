const CACHE_NAME = 'kids-map-v2';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/css/style.css',
    '/js/script.js',
    '/js/map.js',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
    );
});
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});
self.addEventListener('fetch', event => {
    if (event.request.url.includes('/api/v1/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => caches.match(event.request));
            })
        );
        return;
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});