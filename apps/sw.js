// Apps hub service worker: network first, cache as offline fallback (same pattern as /games/sw.js).
// Bump CACHE on every release so old copies are dropped.
const CACHE = 'apps-v3';
const SHELL = [
  './',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg',
  './icons/pecunia-192.png',
  './icons/wanderlust-192.png',
  '/icons/icon.svg',
  '/btc/icons/icon-192.png',
  '/onepiece/icon-192.png',
  '/thailandia/icon-192.png',
  '/g30/icon-192.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('apps-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const ours = url.origin === location.origin &&
    (url.pathname.startsWith('/apps/') || SHELL.includes(url.pathname));
  if (!ours) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./')))
  );
});
