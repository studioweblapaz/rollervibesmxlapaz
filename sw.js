// ==========================================
// SERVICE WORKER - ROLLER VIBES MX LA PAZ
// ==========================================

const CACHE_NAME = 'roller-vibes-v2'; // Versión actualizada
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// 1. Instalar y cachear archivos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Error al cachear:', err))
  );
  // Forzar la activación inmediata
  self.skipWaiting();
});

// 2. Interceptar peticiones (IGNORANDO FIREBASE)
self.addEventListener('fetch', event => {
  // Ignorar peticiones de Firebase, Google APIs y métodos que no sean GET
  if (event.request.url.includes('googleapis.com') || 
      event.request.url.includes('firebaseio.com') ||
      event.request.url.includes('firestore.googleapis.com') ||
      event.request.method !== 'GET') {
    return; // Dejar que el navegador maneje estas peticiones normalmente
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Servir desde caché si existe
        }
        return fetch(event.request); // Si no, hacer la petición de red
      })
      .catch(() => {
        // Fallback opcional si no hay red ni caché
      })
  );
});

// 3. Activar y limpiar cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando caché viejo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Tomar el control de todas las páginas inmediatamente
  return self.clients.claim();
});
