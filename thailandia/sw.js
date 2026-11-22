// Thailandia offline copy: network first, cache as fallback, only for /thailandia/. Bump CACHE on every release.
const CACHE = 'thailandia-v1';
const SHELL = ['/thailandia/', '/thailandia/manifest.webmanifest', '/thailandia/icon-180.png', '/thailandia/icon-192.png', '/thailandia/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('thailandia-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.pathname.startsWith('/thailandia/')) return;
  e.respondWith(fetch(req)
    .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('/thailandia/'))));
});
