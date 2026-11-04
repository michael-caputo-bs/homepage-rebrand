(function () {
  var C = window.FUNNEL_CONFIG;
  var search = new URLSearchParams(window.location.search);
  var page = "";
  var extra = {};

  function clean(v) { return (v || "").trim(); }

  function readStoredUtms() {
    try {
      var stored = JSON.parse(localStorage.getItem(C.UTM_STORAGE_KEY) || "null");
      if (stored && stored.params && Date.now() - stored.timestamp < C.UTM_TTL_MS) return stored.params;
    } catch (e) {}
    return {};
  }

  function getUtms() {
    var fromUrl = {};
    var hasUrl = false;
    C.UTM_KEYS.forEach(function (k) {
      var v = clean(search.get(k));
      if (v) { fromUrl[k] = v; hasUrl = true; }
    });
    if (hasUrl) {
      try { localStorage.setItem(C.UTM_STORAGE_KEY, JSON.stringify({ params: fromUrl, timestamp: Date.now() })); } catch (e) {}
    }
    var source = hasUrl ? fromUrl : readStoredUtms();
    var out = {};
    C.UTM_KEYS.forEach(function (k) { out[k] = source[k] || ""; });
    return out;
  }

  function getLead() {
    var out = {};
    C.LEAD_KEYS.forEach(function (k) { out[k] = clean(search.get(k)); });
    return out;
  }

  function withParams(base, params) {
    var url = new URL(base, window.location.origin);
    Object.keys(params).forEach(function (k) { if (params[k]) url.searchParams.set(k, params[k]); });
    return url.origin === window.location.origin ? url.pathname + url.search : url.toString();
  }

  function payload(event, data) {
    var body = { event: event, page: page, variant: C.VARIANT, timestamp: new Date().toISOString() };
    Object.assign(body, getLead(), getUtms(), extra, data || {});
    return body;
  }

  function track(event, data) {
    var body = payload(event, data);
    if (!C.OPTIN_WEBHOOK_URL) {
      console.log("[funnel] " + event, body);
      return Promise.resolve();
    }
    try {
      return fetch(C.OPTIN_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true
      }).catch(function () {});
    } catch (e) {
      return Promise.resolve();
    }
  }

  function trackThenGo(event, href, data) {
    var done = false;
    function go() { if (done) return; done = true; window.location.href = href; }
    track(event, data).then(go, go);
    setTimeout(go, C.REDIRECT_MAX_WAIT_MS);
  }

  function bindLink(el, event, href) {
    el.href = href;
    el.addEventListener("click", function (e) {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) { track(event); return; }
      e.preventDefault();
      trackThenGo(event, el.href);
    });
  }

  function bookHref() {
    return withParams(C.BOOK_DEMO_PATH, Object.assign(getLead(), getUtms()));
  }

  function selfServeHref() {
    return withParams(C.SELF_SERVE_URL, getUtms());
  }

  function init(pageName) {
    page = pageName;
    var tg = document.getElementById("tg-link");
    if (tg) tg.href = C.TELEGRAM_URL;
    track("page_view");
  }

  window.Funnel = {
    config: C,
    init: init,
    getUtms: getUtms,
    getLead: getLead,
    withParams: withParams,
    track: track,
    trackThenGo: trackThenGo,
    bindLink: bindLink,
    bookHref: bookHref,
    selfServeHref: selfServeHref,
    set: function (k, v) { extra[k] = v; }
  };
})();
