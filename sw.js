/* Reverie · service worker
   HTML 走「网络优先」—— 改了代码推上去，刷新就是新的，不会被缓存卡住。
   图标之类的静态资源走「缓存优先」。
   离线时回落到缓存，装在桌面上没网也能打开。 */
const V = 'reverie-v1';
const CORE = [
  './',
  './home.html',
  './affirm.html',
  './gratitude.html',
  './script.html',
  './me.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const isDoc = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isDoc) {
    /* 网络优先：拿到新的就更新缓存，断网了给缓存 */
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(V).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./home.html')))
    );
    return;
  }

  /* 其他资源：缓存优先 */
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok && new URL(req.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(V).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => hit))
  );
});
