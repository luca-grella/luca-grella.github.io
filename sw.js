// Main page service worker: network first, cache as offline fallback, for the main page, Contacts and Portfolio.
// Its scope is the whole site, but every private page and app has its own worker with a narrower scope, which wins.
// Bump CACHE on every release.
const CACHE = 'main-v9';
const SHELL = ['/', '/manifest.webmanifest', '/icons/icon-180.png', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon.svg'];
// Contacts and Portfolio open offline too (Luca, 23 Nov 2026): their pages and main files are kept at install, so one
// online visit of the main page is enough; anything else under these folders is kept as it loads.
const PAGES = ['/contacts/', '/portfolio/', '/portfolio/about/', '/portfolio/certifications/', '/portfolio/djteck/',
  '/portfolio/projects/', '/portfolio/sports/', '/contacts/assets/css/main.css', '/contacts/assets/css/images/bg.png',
  '/contacts/assets/css/images/overlay-pattern.png', '/contacts/assets/css/images/overlay.svg',
  '/contacts/assets/css/images/lm.png', '/contacts/assets/css/images/poli.png', '/contacts/assets/css/images/icons/dj.png',
  '/public/css/poole.css', '/public/css/syntax.css', '/public/css/hyde.css', '/assets/js/theme-toggle.js',
  '/assets/js/social-app-links.js', '/assets/img/logo.png', '/assets/img/logo.webp',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'];
const FOLDERS = ['/contacts/', '/portfolio/', '/public/', '/assets/'];
const CROSS = ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/', 'https://fonts.googleapis.com/', 'https://fonts.gstatic.com/'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(SHELL).then(() => Promise.all(PAGES.map(u => c.add(u).catch(() => {})))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('main-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const ours = url.origin === location.origin
    ? SHELL.includes(url.pathname) || FOLDERS.some(p => url.pathname.startsWith(p))
    : CROSS.some(p => req.url.startsWith(p));
  if (!ours) return;
  const page = req.mode === 'navigate';
  e.respondWith(fetch(req)
    .then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })
    .catch(err => caches.match(req, { ignoreSearch: true })
      .then(r => r || (page ? caches.match('/') : undefined))
      .then(r => r || Promise.reject(err))));
});
