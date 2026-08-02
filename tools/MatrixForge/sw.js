/* nano-tools service worker: offline-first, same-origin GET only.
   注意：全矩阵托管在同一个 GitHub Pages origin，CacheStorage 按 origin 共享，
   因此 activate 阶段只能淘汰「本工具命名空间」下的历史版本；若像单仓项目那样
   caches.delete 掉所有非自身 key，会连带清空同域其他工具的离线缓存。 */
var SCOPE = 'nano:matrixforge';
var CACHE = SCOPE + ':v2';
var LEGACY = ['nano-v1', 'matrixforge-v1'];
var ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'og.svg'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(ASSETS.map(function (a) { return c.add(a).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) {
      var mine = k.indexOf(SCOPE + ':') === 0 && k !== CACHE;
      var stale = LEGACY.indexOf(k) !== -1;
      return (mine || stale) ? caches.delete(k) : null;
    }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u;
  try { u = new URL(e.request.url); } catch (err) { return; }
  if (u.origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') { c.put(e.request, res.clone()); }
        return res;
      }).catch(function () { return c.match('./'); });
    });
  }));
});
