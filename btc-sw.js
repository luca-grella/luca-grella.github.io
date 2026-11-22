// BTC Tracker service worker, published as /btc-sw.js with scope /btc-tracker.html only (the root /sw.js keeps the rest
// of the site). Added on 22 Nov 2026 so the tracker opens offline after one online visit, also as an installed app.
// The encrypted wrapper's head registers it, so the password page is kept from the first visit.
// Network first everywhere: online nothing changes. Offline it returns the last copy of the page, of Chart.js and of
// each price answer, so the page shows the last prices it saw. The price URLs carry time parameters (start, end,
// since) and may go through the allorigins proxy, so price copies are keyed by the direct URL without those.
// Bump CACHE on every release.
const CACHE = 'btc-v1';
const PAGE = '/btc-tracker.html';
const CHART = /^https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com)\/.*chart\.umd\.min\.js$/;
const PRICES = ['api.coingecko.com', 'www.bitstamp.net', 'api.exchange.coinbase.com', 'api.kraken.com', 'api.allorigins.win'];

function priceKey(href) {
  let u = new URL(href);
  if (u.hostname === 'api.allorigins.win' && u.searchParams.get('url')) u = new URL(u.searchParams.get('url'));
  for (const p of ['start', 'end', 'since']) u.searchParams.delete(p);
  return u.href;
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add(PAGE)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('btc-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const key = url.origin === location.origin && url.pathname === PAGE ? PAGE
    : CHART.test(req.url) ? req.url
    : PRICES.includes(url.hostname) ? priceKey(req.url) : null;
  if (!key) return;
  e.respondWith(fetch(req)
    .then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
      return res;
    })
    .catch(err => caches.match(key).then(hit => hit || Promise.reject(err))));
});
