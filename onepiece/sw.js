// One Piece map service worker (/onepiece/), added on 22 Nov 2026 so the map opens offline after one online visit.
// build.py copies it to dist/sw.js with the illustration list filled in; the encrypted wrapper's head registers it,
// so the password page is kept from the first visit.
// Network first everywhere: online nothing changes (a new image key re-publishes every .bin, so no stale copies).
// Install precaches the page and all illustrations; Leaflet and the Google Fonts are kept as they load.
// Bump CACHE on every release.
const CACHE = 'onepiece-v1';
const IMAGES = ["alabasta", "amazon-lily", "arlong-park", "baltigo", "banaro", "baratie", "baterilla", "boin", "calm-belt-north", "calm-belt-south", "cocoyasi", "dressrosa", "drum", "egghead", "elbaph", "enies-lobby", "fishman-island", "flevance", "florian-triangle", "foodvalten", "foosha", "g-5", "germa-66", "goa-kingdom", "god-valley", "green-bit", "hachinosu", "impel-down", "isola-animali-rari", "jaya", "karakuri", "kuraigana", "laugh-tale", "little-garden", "lodestar", "loguetown", "long-ring-long-land", "lulusia", "lvneel", "marineford", "mary-geoise", "minion", "momoiro", "namakura", "nuovo-qg-marina", "ohara", "onigashima", "orange-town", "prodence", "pucci", "punk-hazard", "red-line", "reverse-mountain", "rusukaina", "sabaody", "san-faldo", "shells-town", "shimotsuki", "skypiea", "sorbet", "sphinx", "spider-miles", "st-poplar", "swallow", "syrup-village", "tequila-wolf", "thriller-bark", "torino", "twin-cape", "wano", "water-7", "weatheria", "whisky-peak", "whole-cake", "zou"];
const SHELL = ['./', './manifest.webmanifest', './icon.svg', './icon-180.png', './icon-192.png', './icon-512.png',
  ...IMAGES.map(id => `./img/${encodeURIComponent(id)}.bin`)];
const SCOPE = new URL('./', location).href;
const CROSS = ['https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/', 'https://fonts.googleapis.com/', 'https://fonts.gstatic.com/'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // one by one: a file that fails now is kept on its first view instead of failing the whole install
    await Promise.all(SHELL.map(u => fetch(new Request(u, { cache: 'reload' }))
      .then(res => res.ok && cache.put(u, res)).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('onepiece-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (!req.url.startsWith(SCOPE) && !CROSS.some(p => req.url.startsWith(p))) return;
  const page = req.mode === 'navigate';
  e.respondWith(fetch(req)
    .then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })
    .catch(err => caches.match(req, { ignoreSearch: page })
      .then(hit => hit || (page ? caches.match('./') : undefined))
      .then(hit => hit || Promise.reject(err))));
});
