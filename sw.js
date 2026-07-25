// nano-tools PWA service worker — 仅缓存同源静态资源，跨域 API 请求不拦截
const CACHE = 'nano-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'og.svg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // 不拦截跨域（如 APIForge/ChatForge 的远程调用）
  e.respondWith(caches.match(e.request).then(cached =>
    cached || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return resp;
    }).catch(() => caches.match('./'))
  ));
});
