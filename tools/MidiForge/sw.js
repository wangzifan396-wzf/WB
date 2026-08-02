const SCOPE = 'nano:midiforge';
const CACHE = SCOPE + ':v1';
const LEGACY = ['nano-v1', 'midiforge-v1'];
const ASSETS = ['./', './index.html', './favicon.svg', './og.svg', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => {
        if ((k.indexOf(SCOPE + ':') === 0 && k !== CACHE) || LEGACY.indexOf(k) >= 0) {
          return caches.delete(k);
        }
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(req).then((cached) =>
        cached || fetch(req).then((res) => {
          const copy = res.clone();
          cache.put(req, copy);
          return res;
        }).catch(() => cache.match('./index.html'))
      )
    )
  );
});
