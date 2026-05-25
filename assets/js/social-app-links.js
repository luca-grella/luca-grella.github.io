// On mobile, drop target="_blank" from social links so iOS Universal Links /
// Android App Links can intercept the click and open the native app directly
// (no confirmation popup). On desktop we leave target="_blank" intact so the
// portfolio stays open in the original tab.
(function () {
  var isMobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) return;

  var SOCIAL_HOSTS = /(?:^|\.)(instagram\.com|facebook\.com|linkedin\.com|x\.com|twitter\.com|spotify\.com|soundcloud\.com|mixcloud\.com|github\.com)$/i;

  function rewrite() {
    document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
      try {
        var host = new URL(a.href).hostname;
        if (SOCIAL_HOSTS.test(host)) a.removeAttribute('target');
      } catch (e) { /* invalid URL, skip */ }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rewrite);
  } else {
    rewrite();
  }
})();
