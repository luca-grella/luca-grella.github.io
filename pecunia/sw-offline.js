// Imported by the workbox service worker (vite.config.js, importScripts). The network-first "pages" rule keeps
// index.html only for navigations this worker handles, but the first visit loads the page before the worker exists:
// with only that rule Pecunia needed two online visits before it opened offline (23 Nov 2026). On activate the
// worker fetches the page into the same cache, so one online visit is enough.
self.addEventListener('activate', e => {
  e.waitUntil(caches.open('pages').then(c => c.add(new URL('./', self.location).href)).catch(() => {}));
});
