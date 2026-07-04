/* Audiolyte analytics — GA4 (G-15QKYYRQMC) with GDPR consent banner.
   No tracking until the visitor accepts; choice is stored in localStorage.
   Collects: page views, scroll depth, section views, FAQ opens, UI clicks,
   language switches, email/phone clicks, JS errors (+ GA4 enhanced
   measurement: outbound clicks, forms, downloads, video, site search). */
(function () {
  'use strict';
  var GA_ID = 'G-15QKYYRQMC';
  var KEY = 'al-consent'; // 'granted' | 'denied'

  function lang() {
    try {
      var s = localStorage.getItem('al-lang');
      if (s === 'en' || s === 'nl' || s === 'fr') return s;
    } catch (e) {}
    var n = ((typeof navigator !== 'undefined' && navigator.language) || '').toLowerCase();
    if (n.indexOf('fr') === 0) return 'fr';
    if (n.indexOf('en') === 0) return 'en';
    return 'nl';
  }

  var TXT = {
    nl: { msg: 'We gebruiken cookies om het websitebezoek anoniem te meten en onze site te verbeteren.', ok: 'Prima', no: 'Liever niet' },
    en: { msg: 'We use cookies to measure website visits anonymously and improve our site.', ok: 'Sounds good', no: 'No thanks' },
    fr: { msg: 'Nous utilisons des cookies pour mesurer la fréquentation du site de façon anonyme et l’améliorer.', ok: 'D’accord', no: 'Non merci' }
  };

  function track(name, params) {
    if (window.gtag) { try { window.gtag('event', name, params || {}); } catch (e) {} }
  }

  function sectionOf(el) {
    var s = el && el.closest ? el.closest('section[id]') : null;
    if (s) return s.id;
    if (el && el.closest && el.closest('header')) return 'nav';
    if (el && el.closest && el.closest('footer')) return 'footer';
    return 'page';
  }

  function attachInstrumentation() {
    // --- clicks: email / phone (key events) + generic UI clicks ---
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;

      var a = t.closest('a[href^="mailto:"], a[href^="tel:"]');
      if (a) {
        var href = a.getAttribute('href') || '';
        track(href.indexOf('tel:') === 0 ? 'contact_phone_click' : 'contact_email_click', {
          link_text: (a.textContent || '').trim().slice(0, 60),
          page_path: location.pathname,
          section: sectionOf(a)
        });
        return;
      }

      var sum = t.closest('summary');
      if (sum) {
        track('faq_open', {
          question: (sum.textContent || '').replace(/\+$/, '').trim().slice(0, 90),
          page_path: location.pathname
        });
        return;
      }

      var c = t.closest('a, button, [role="button"], [tabindex]');
      if (c) {
        var label = (c.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
        if (label) {
          track('ui_click', { label: label, section: sectionOf(c), page_path: location.pathname });
        }
      }

      // language switch detection (lang buttons update localStorage after the click)
      var before = lang();
      setTimeout(function () {
        var after = lang();
        if (after !== before) track('language_switch', { from: before, to: after });
      }, 50);
    }, true);

    // --- scroll depth (25/50/75/90) + section views, both scroll-driven ---
    var marks = [25, 50, 75, 90], fired = {}, seen = {};
    function checkSections() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var secs = document.querySelectorAll('section[id]');
      for (var i = 0; i < secs.length; i++) {
        var s = secs[i];
        if (seen[s.id]) continue;
        var r = s.getBoundingClientRect();
        var visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (visible > 120 && (visible >= r.height * 0.15 || visible >= vh * 0.5)) {
          seen[s.id] = true;
          track('section_view', { section: s.id, page_path: location.pathname });
        }
      }
    }
    function onScroll() {
      var h = document.documentElement;
      var total = (h.scrollHeight - h.clientHeight) || 1;
      var pct = Math.round((window.scrollY || h.scrollTop) / total * 100);
      for (var i = 0; i < marks.length; i++) {
        var m = marks[i];
        if (pct >= m && !fired[m]) {
          fired[m] = true;
          track('scroll_depth', { percent: m, page_path: location.pathname });
        }
      }
      checkSections();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    // content renders client-side: check the initial viewport once it exists
    var tries = 0;
    var poll = setInterval(function () {
      tries++;
      if (document.querySelectorAll('section[id]').length) { clearInterval(poll); checkSections(); }
      else if (tries > 20) { clearInterval(poll); }
    }, 500);

    // --- JS errors (site health signal) ---
    window.addEventListener('error', function (e) {
      track('js_error', {
        message: String(e.message || 'unknown').slice(0, 100),
        source: String(e.filename || '').split('/').pop().slice(0, 40),
        page_path: location.pathname
      });
    });
  }

  function loadGA() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      analytics_storage: 'granted'
    });
    gtag('js', new Date());
    gtag('config', GA_ID, {
      cookie_flags: 'SameSite=Lax;Secure',
      site_language: lang()
    });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    attachInstrumentation();
  }

  function showBanner() {
    var t = TXT[lang()] || TXT.nl;
    var bar = document.createElement('div');
    bar.id = 'al-consent-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookies');
    bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center;background:#0A0E14;color:#fff;border:1px solid rgba(255,255,255,0.14);border-radius:14px;padding:14px 18px;font-family:Manrope,system-ui,sans-serif;font-size:13.5px;line-height:1.5;box-shadow:0 10px 30px rgba(0,0,0,0.35);max-width:720px;margin:0 auto;';
    var span = document.createElement('span');
    span.style.cssText = 'flex:1 1 260px;min-width:200px;';
    span.textContent = t.msg;
    var ok = document.createElement('button');
    ok.textContent = t.ok;
    ok.style.cssText = 'border:0;border-radius:999px;padding:9px 20px;font-family:Manrope;font-weight:700;font-size:13.5px;background:#7A5CFF;color:#fff;cursor:pointer;';
    var no = document.createElement('button');
    no.textContent = t.no;
    no.style.cssText = 'border:1px solid rgba(255,255,255,0.25);border-radius:999px;padding:9px 20px;font-family:Manrope;font-weight:600;font-size:13.5px;background:transparent;color:rgba(255,255,255,0.75);cursor:pointer;';
    ok.onclick = function () {
      try { localStorage.setItem(KEY, 'granted'); } catch (e) {}
      bar.remove();
      loadGA();
    };
    no.onclick = function () {
      try { localStorage.setItem(KEY, 'denied'); } catch (e) {}
      bar.remove();
    };
    bar.appendChild(span); bar.appendChild(ok); bar.appendChild(no);
    document.body.appendChild(bar);
  }

  function init() {
    var c = null;
    try { c = localStorage.getItem(KEY); } catch (e) {}
    if (c === 'granted') { loadGA(); return; }
    if (c === 'denied') { return; }
    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
