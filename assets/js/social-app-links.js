// On mobile, replace social profile web URLs with native app URL schemes so
// taps open the installed app instead of staying in the browser tab.
// Profile URLs only (ignores Instagram AR filter and other non-profile paths).
(function () {
  var isMobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) return;

  // [ regex on href, builder for the app URL ]
  var rules = [
    // Instagram profile: https://(www.)instagram.com/<user>(/)
    [/^https?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?(?:\?.*)?$/i,
     function (m) { return 'instagram://user?username=' + m[1]; }],
    // Facebook profile or page: https://(www.)facebook.com/<user>(/)
    [/^https?:\/\/(?:www\.)?facebook\.com\/([a-zA-Z0-9.\-_]+)\/?(?:\?.*)?$/i,
     function (m) { return 'fb://profile/' + m[1]; }],
    // LinkedIn /in/<user>
    [/^https?:\/\/(?:www\.)?linkedin\.com\/in\/([^\/?#]+)\/?(?:\?.*)?$/i,
     function (m) { return 'linkedin://in/' + m[1]; }]
  ];

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || !a.href) return;
    for (var i = 0; i < rules.length; i++) {
      var match = a.href.match(rules[i][0]);
      if (match) {
        var appUrl = rules[i][1](match);
        // Try the app; if it fails to handle, the browser will stay where it is
        // and a hidden iframe trick is fragile, so we just attempt it.
        window.location.href = appUrl;
        e.preventDefault();
        return;
      }
    }
  }, true);
})();
