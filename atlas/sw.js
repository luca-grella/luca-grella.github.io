// Atlas service worker (luca-grella.github.io/atlas/): the app opens offline after one online visit.
// Registered by the encrypted wrapper (tools/publish_pages.py), so the password page is kept from the first visit.
// Same rules as Wanderlust's worker:
// - network first: online every request gets the real response, untouched;
// - offline only a copy of a real successful response is returned, never a made-up one;
// - cross-origin only the pinned libraries are kept (d3, topojson-client, Firebase SDK). Sign-in, Firestore and fonts
//   are not intercepted.
// The pinned files are also fetched at install: on the first visit the page loads them before this worker takes over.
// Bump CACHE on every release.
const CACHE = 'atlas-v2';
const LIBS = [
  'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
  'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js',
  ...['firebase-app.js', 'firebase-auth.js', 'firebase-firestore.js'].map(f => 'https://www.gstatic.com/firebasejs/10.7.1/' + f)
];
const SHELL = ['./', './world.json', './manifest.webmanifest', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png'];
const PINNED = ['https://cdn.jsdelivr.net/npm/d3@7.9.0/', 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/',
  'https://www.gstatic.com/firebasejs/10.7.1/'];
const SCOPE = new URL('./', location).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(SHELL).then(() => Promise.all(LIBS.map(u => c.add(u).catch(() => {})))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('atlas-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (!req.url.startsWith(SCOPE) && !PINNED.some(p => req.url.startsWith(p))) return;
  const page = req.mode === 'navigate';
  e.respondWith(fetch(req)
    .then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })
    .catch(err => caches.match(req, { ignoreSearch: page })
      .then(hit => hit || (page ? caches.match('./') : undefined))
      .then(hit => hit || Promise.reject(err))));
});
