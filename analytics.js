/* Audiolyte analytics — GA4 (G-15QKYYRQMC) with GDPR consent banner.
   No tracking until the visitor accepts; choice is stored in localStorage. */
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

  function loadGA() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      analytics_storage: 'granted'
    });
    gtag('js', new Date());
    gtag('config', GA_ID, { cookie_flags: 'SameSite=Lax;Secure' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    // conversion signals: clicks on email / phone links
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="mailto:"], a[href^="tel:"]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      gtag('event', href.indexOf('tel:') === 0 ? 'contact_phone_click' : 'contact_email_click', {
        link_text: (a.textContent || '').trim().slice(0, 60),
        page_path: location.pathname
      });
    }, true);
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
