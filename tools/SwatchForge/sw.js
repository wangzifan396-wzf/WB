/* nano-tools service worker: offline-first, same-origin GET only.
   全矩阵托管在同一 origin，CacheStorage 按 origin 共享，
   只淘汰「本工具命名空间」下的历史版本，不影响其他工具。 */
var SCOPE = 'nano:swatchforge';
var CACHE = SCOPE + ':v1';
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
      return mine ? caches.delete(k) : null;
    }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u;
  try { u = new URL(e.request.url); } catch (err) { return; }
  if (u.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        if (res && res.ok && u.href.indexOf(self.location.origin + self.registration.scope.replace(/\/?$/, '/')) === 0) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () { return caches.match('./'); });
    })
  );
});
