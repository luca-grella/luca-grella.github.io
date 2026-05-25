// Light/dark mode toggle. Light is default. Stores preference in localStorage.
(function () {
  var STORAGE_KEY = 'lg-theme';
  var html = document.documentElement;

  // Apply saved preference ASAP to avoid flash of unstyled content
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'dark') {
      html.classList.add('theme-dark');
    }
  } catch (e) { /* localStorage blocked, ignore */ }

  function bind() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isDark = html.classList.toggle('theme-dark');
      try { localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light'); } catch (e) {}
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
