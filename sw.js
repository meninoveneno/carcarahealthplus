const CACHE_NAME = 'carcara-health-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js',
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
