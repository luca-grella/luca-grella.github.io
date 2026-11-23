// Wanderlust service worker (luca-grella.github.io/wanderlust/), re-enabled on 22 Nov 2026 so the app shell opens offline.
// Registered by the encrypted wrapper (tools/publish_pages.py), so the password page is kept from the first visit.
// Written against the old bug (a worker that answered cross-origin module loads with 503 and broke Google sign-in):
// - everything is network first: online, every request gets the real network response, untouched;
// - offline, only a copy of a real successful response is returned, never a made-up one;
// - cross-origin, only the pinned Firebase SDK and Leaflet files are kept. Sign-in, Firestore, fonts and every other
//   host are not intercepted at all.
// The pinned Firebase SDK files are also kept at install: on the first visit the page loads them before this worker
// takes over, so keeping them only as they load left the app without them offline (23 Nov 2026).
// Bump CACHE on every release.
const CACHE = 'wanderlust-shell-v2';
const SDK = ['firebase-app.js', 'firebase-auth.js', 'firebase-firestore.js'].map(f => 'https://www.gstatic.com/firebasejs/10.7.1/' + f);
const SHELL = ['./', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const PINNED = ['https://www.gstatic.com/firebasejs/10.7.1/', 'https://unpkg.com/leaflet@1.9.4/'];
const SCOPE = new URL('./', location).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(SHELL).then(() => Promise.all(SDK.map(u => c.add(u).catch(() => {})))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('wanderlust-') && k !== CACHE).map(k => caches.delete(k))))
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
