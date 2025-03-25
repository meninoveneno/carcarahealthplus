const CACHE_NAME = 'carcara-health-v1';
const urlsToCache = [
    '/',
    '/index.html',
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js',
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
    'https://scontent.frec3-1.fna.fbcdn.net/v/t39.30808-6/406602524_678803654462441_807025838529865500_n.jpg'
];

// Evento de instalação: armazena os arquivos no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto, armazenando recursos');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Erro ao armazenar no cache:', err))
    );
    // Força o Service Worker a ativar imediatamente
    self.skipWaiting();
});

// Evento de ativação: limpa caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Limpando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Assume o controle imediato das páginas
    self.clients.claim();
});

// Evento de fetch: serve arquivos do cache ou busca na rede
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna do cache se disponível
                if (response) {
                    return response;
                }
                // Caso contrário, faz a requisição na rede
                return fetch(event.request)
                    .then(networkResponse => {
                        // Só armazena no cache se for uma requisição GET e resposta válida
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return networkResponse;
                    })
                    .catch(() => {
                        // Fallback offline: retorna o index.html se não houver conexão
                        return caches.match('/index.html');
                    });
            })
    );
});
