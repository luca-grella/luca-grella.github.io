// BTC Tracker service worker, published as /btc-sw.js with scope /btc-tracker.html only (the root /sw.js keeps the rest
// of the site). Added on 22 Nov 2026 so the tracker opens offline after one online visit, also as an installed app.
// The encrypted wrapper's head registers it, so the password page is kept from the first visit.
// Network first everywhere: online nothing changes. Offline it returns the last copy of the page, of Chart.js and of
// each price answer, so the page shows the last prices it saw and the chart. Price URLs may go through the allorigins
// proxy and some carry a time relative to now (hourly start, last end), so copies are keyed by the direct URL without
// time parameters that fall in the last 30 days; the fixed history pages keep theirs (23 Nov 2026: stripping them all
// made every history page return the same copy offline).
// Chart.js is fetched with CORS so a failing CDN (cdnjs answers 404) is never stored: on iPhone a stored opaque 404
// counted as loaded and the page never tried the next CDN. The working one is kept at install, before the page needs it.
// Price copies live in DATA, which survives releases. On the very first install the page has already asked for its
// prices before this worker took over, so it reloads the page once: the second load goes through here and is kept.
// Bump CACHE on every release.
const CACHE = 'btc-v2';
const DATA = 'btc-data';
const CHART_URL = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js';
const PAGE = '/btc-tracker.html';
const CHART = /^https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com)\/.*chart\.umd\.min\.js$/;
const PRICES = ['api.coingecko.com', 'www.bitstamp.net', 'api.exchange.coinbase.com', 'api.kraken.com', 'api.allorigins.win'];

function priceKey(href) {
  let u = new URL(href);
  if (u.hostname === 'api.allorigins.win' && u.searchParams.get('url')) u = new URL(u.searchParams.get('url'));
  const now = Date.now();
  for (const p of ['start', 'end', 'since']) {
    const v = u.searchParams.get(p);
    if (v === null) continue;
    const ms = /^\d+$/.test(v) ? Number(v) * 1000 : Date.parse(v);
    if (Math.abs(now - ms) < 30 * 864e5) u.searchParams.delete(p);
  }
  return u.href;
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.all([PAGE, CHART_URL].map(u => c.add(new Request(u, { mode: 'cors' })).catch(() => {}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const first = !(await caches.has(DATA));
    await caches.open(DATA);
    for (const k of await caches.keys()) if (k.startsWith('btc-') && k !== CACHE && k !== DATA) await caches.delete(k);
    await self.clients.claim();
    if (first) for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(c.url).catch(() => {});
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const key = url.origin === location.origin && url.pathname === PAGE ? PAGE
    : CHART.test(req.url) ? req.url
    : PRICES.includes(url.hostname) ? priceKey(req.url) : null;
  if (!key) return;
  e.respondWith(fetch(key === req.url && CHART.test(key) ? new Request(key, { mode: 'cors' }) : req)
    .then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(key === PAGE || key === req.url && CHART.test(key) ? CACHE : DATA).then(c => c.put(key, copy)); }
      return res;
    })
    .catch(err => caches.match(key).then(hit => hit || Promise.reject(err))));  // caches.match looks in every cache
});
