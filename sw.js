const CACHE_NAME = ‘neuroreport-v1’;
const URLS_TO_CACHE = [
‘/’,
‘/index.html’,
‘/manifest.json’,
‘https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Serif:wght@400;600;700&display=swap’
];

self.addEventListener(‘install’, event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
);
self.skipWaiting();
});

self.addEventListener(‘fetch’, event => {
event.respondWith(
caches.match(event.request).then(response => {
return response || fetch(event.request).then(fetchRes => {
return caches.open(CACHE_NAME).then(cache => {
cache.put(event.request, fetchRes.clone());
return fetchRes;
});
});
}).catch(() => caches.match(’/index.html’))
);
});

self.addEventListener(‘activate’, event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
)
);
self.clients.claim();
});
