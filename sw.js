/* nano-tools portal service worker: offline-capable, same-origin GET only.

   注意 1：全矩阵托管在同一个 GitHub Pages origin，CacheStorage 按 origin 共享，
   因此 activate 阶段只能淘汰「本命名空间」下的历史版本；若像单仓项目那样
   caches.delete 掉所有非自身 key，会连带清空同域其他工具的离线缓存。

   注意 2：380 款工具合并进本仓 tools/ 之后，本 SW 的 scope（/WB/）已经覆盖
   了全部工具页。必须显式放行 tools/ 子树，交由每个工具自己的 sw.js 管理，
   否则门户会把工具页永久缓存成陈旧副本，工具更新后访客再也拿不到新版。

   注意 3：HTML 导航请求改为 network-first，保证门户内容更新即时生效，
   断网时仍回落到缓存副本。静态资源保持 cache-first。 */
var SCOPE = 'nano:wb';
var CACHE = SCOPE + ':v3';
var LEGACY = ['nano-v1', 'wb-v1'];
var ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'og.svg'];

function scopePath() {
  try { return new URL(self.registration.scope).pathname; } catch (e) { return '/'; }
}

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
  var req = e.request;
  if (req.method !== 'GET') return;
  var u;
  try { u = new URL(req.url); } catch (err) { return; }
  if (u.origin !== self.location.origin) return;

  // 放行 tools/ 子树：每个工具由自己的 sw.js 负责离线缓存
  if (u.pathname.indexOf(scopePath() + 'tools/') === 0) return;

  var isDoc = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') !== -1;

  if (isDoc) {
    // network-first：门户内容永远拿最新，断网回落缓存
    e.respondWith(fetch(req).then(function (res) {
      if (res && res.status === 200 && res.type === 'basic') {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.open(CACHE).then(function (c) {
        return c.match(req).then(function (hit) { return hit || c.match('./'); });
      });
    }));
    return;
  }

  // 静态资源：cache-first
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') { c.put(req, res.clone()); }
        return res;
      }).catch(function () { return c.match('./'); });
    });
  }));
});
