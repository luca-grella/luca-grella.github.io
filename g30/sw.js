// G30 offline copy: network first, cache as fallback, only for /g30/. Bump CACHE on every release.
const CACHE = 'g30-v1';
const SHELL = ['/g30/', '/g30/manifest.webmanifest', '/g30/icon-180.png', '/g30/icon-192.png', '/g30/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('g30-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.pathname.startsWith('/g30/')) return;
  e.respondWith(fetch(req)
    .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
    .catch(err => caches.match(req, { ignoreSearch: true })
      .then(r => r || (req.mode === 'navigate' ? caches.match('/g30/') : undefined))
      .then(r => r || Promise.reject(err))));
});
