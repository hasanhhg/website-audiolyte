# Audiolyte - website

Productieklare statische website voor **audiolyte.be** (verhuur & installatie van geluid, licht en video).

## Hosting

| Onderdeel | Waar |
|---|---|
| **Website** | GitHub Pages (`hasanhhg/website-audiolyte`, branch `main`) |
| **Domein** (`audiolyte.be`) | [mijn.host](https://mijn.host) - domeinregistratie + DNS-beheer |

De website wordt gehost op GitHub Pages. Het domein (`audiolyte.be`) is geregistreerd bij mijn.host. In het mijn.host controlepaneel (`/cp/domains/`) wijzen A-records het domein naar de GitHub Pages IP's:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

## Beveiliging

- **Geen API keys of secrets** in broncode - alles publiek en statisch
- **HTTPS** afgedwongen via GitHub Pages (Let's Encrypt, HSTS 1 jaar)
- **Branch protection** op `main`: force-push en branch deletion geblokkeerd
- **`.gitignore`** voorkomt per ongeluk committen van klantdata (`quotes/`) en bronmateriaal (`uploads/`)
- **DNS:** SPF + DNSSEC actief, DMARC op `p=reject`

### TODO: DMARC rapportage

DMARC-rapportage (`rua=`) ontbreekt - dit vereist een werkend e-mailadres op het domein. Zodra de e-mailhosting geregeld is, voeg toe in het DNS-paneel bij mijn.host:

| Type | Naam | Waarde |
|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=reject; sp=reject; rua=mailto:<jouw@audiolyte.be>` |

## Wat staat hier

| Bestand / map | Doel |
|---|---|
| `index.html` | Homepage |
| `producten.html` | Productcatalogus + offerte |
| `support.js` | Runtime die de pagina's rendert - verplicht mee uploaden |
| `prerender.py` | Zet de Nederlandse weergave van `index.html` en `producten.html` als gewone HTML in de pagina |
| `assets/` | Logo's, productfoto's, showfoto's, favicon |
| `404.html` | Foutpagina (GitHub Pages pikt dit automatisch op) |
| `robots.txt` | Zoekmachines + AI-crawlers toegelaten, verwijst naar sitemap |
| `sitemap.xml` | Sitemap voor Google/Bing |
| `llms.txt` | Samenvatting voor AI-zoekmachines (GEO) |
| `CNAME` | Custom domein voor GitHub Pages (audiolyte.be) |
| `analytics.js` | GA4 analytics (GDPR-bewust) |
| `vendor/` | React + Babel (self-hosted, niet van CDN) |
| `.nojekyll` | Schakelt Jekyll-verwerking uit op GitHub Pages |
| `.gitignore` | Voorkomt uploaden van klantdata en bronmateriaal |

**Niet uploaden:** de map `uploads/` (bronmateriaal, ~50MB).

## Publiceren op GitHub Pages

1. Maak een repository.
2. Upload alles behalve `uploads/`.
3. Settings - Pages - Source: `main` branch, `/ (root)`.
4. Custom domain: vul `audiolyte.be` in (het `CNAME`-bestand staat al klaar) en zet **Enforce HTTPS** aan.
5. Bij mijn.host: A-records naar bovenstaande IP's of CNAME van `www` naar `<gebruikersnaam>.github.io`.

## Wijzigingen doorvoeren

Bewerk HTML-bestanden rechtstreeks. Productdata en prijzen staan in `producten.html` in het `CATS`-blok; pakketten in het `PK`-blok (in beide pagina's, 3 talen).

**Draai daarna altijd `python prerender.py`** (Playwright + Chrome). Het blok tussen `prerender:start` en `prerender:end` is gegenereerd: nooit met de hand bewerken. Na een wijziging aan `support.js`: verhoog de `?v=` op beide pagina's.

## Meten: events en UTM-links

GA4 meet-ID `G-15QKYYRQMC`. GA laadt pas na "Prima" in de banner (`analytics.js`, keuze in localStorage `al-consent`).

### Events die de site verstuurt

| Event | Key event | Parameters | Waar |
|---|---|---|---|
| `contact_phone_click` | ja | `link_text`, `section`, `page_path` | klik op een `tel:`-link, `analytics.js` |
| `contact_email_click` | ja | `link_text`, `section`, `page_path` | klik op een `mailto:`-link, `analytics.js` |
| `offerte_gestart` | ja | `offerte_product_count`, `offerte_total_eur`, `offerte_has_pakket`, `offerte_has_datum`, `offerte_has_bericht`, `offerte_weeks_ahead` | offerteformulier verstuurd, `producten.html` |
| `ui_click` | nee | `label`, `section`, `page_path` | elke andere klik op een knop of link |
| `section_view` | nee | `section`, `page_path` | een `section[id]` komt in beeld |
| `scroll_depth` | nee | `percent` (25, 50, 75, 90), `page_path` | scrollen |
| `faq_open` | nee | `question`, `page_path` | een FAQ-vraag openklappen |
| `language_switch` | nee | `from`, `to` | taalknop NL, EN of FR |
| `js_error` | nee | `message`, `source`, `page_path` | een JavaScript-fout |

GA4 meet zelf nog `page_view`, `session_start`, `first_visit`, `user_engagement`, `scroll` en de rest van de uitgebreide metingen. `purchase` staat als key event in elke GA4-property en is niet te verwijderen; deze site verkoopt niets, dus hij telt nooit iets.

**Regels voor een nieuw event:**

- Kleine letters en underscores, `onderwerp_actie`, hooguit 40 tekens. Een bestaand event krijgt nooit een nieuwe naam: dan breekt de historiek en het key event.
- De contact-events heten op elke site van Hasan hetzelfde (`contact_phone_click`, `contact_email_click`, `contact_whatsapp_click`). Hergebruik die namen.
- Een nieuwe parameter eerst als custom dimension of metric registreren (in `sites.json` van sitedesk, dan `sitedesk ga4 fix`). GA4 rekent niet met terugwerkende kracht.
- Nooit namen, e-mailadressen, telefoonnummers of vrije tekst van bezoekers in een parameter.

### UTM-links

Elke link die van buiten naar de site wijst en die je zelf plaatst (post, advertentie, mail, flyer, QR-code) krijgt deze drie, altijd in kleine letters, woorden met een streepje:

| Parameter | Toegelaten waarden | Voorbeeld |
|---|---|---|
| `utm_source` | het platform of de plek: `instagram`, `facebook`, `linkedin`, `whatsapp`, `tiktok`, `google`, `2dehands`, `nieuwsbrief`, `flyer` | `instagram` |
| `utm_medium` | alleen: `social` (gewone post), `paid_social` (betaalde post), `cpc` (betaald zoeken), `email`, `referral` (link bij een partner), `print` (flyer, affiche, QR-code), `organic` (alleen Google Business Profile) | `social` |
| `utm_campaign` | `jjjj-mm-onderwerp` | `2026-10-bruiloftseizoen` |
| `utm_content` | optioneel, om twee links in dezelfde post of mail uit elkaar te houden | `bio-link` |

Voorbeeld: `https://audiolyte.be/producten.html?utm_source=instagram&utm_medium=social&utm_campaign=2026-10-bruiloftseizoen&utm_content=bio-link`

- Alleen deze `utm_medium`-waarden: GA4 deelt kanalen in op dat woord, en een eigen woord zoals `Insta` of `story` belandt in "Unassigned". `print` belandt daar ook, bewust: GA4 kent geen kanaal voor papier, en zo zie je QR-bezoekers toch apart.
- Nooit UTM op links binnen de eigen site: die starten een nieuwe sessie en overschrijven waar de bezoeker echt vandaan kwam.
- Links in Google Business Profile: `utm_source=google&utm_medium=organic&utm_campaign=gbp`, anders tellen ze als gewoon Google-zoekverkeer.

## Beslissingen

- **2026-09-28: vaste namen voor events en UTM-links** (zie "Meten" hierboven), dezelfde regels als op Hasans andere sites. Afgewezen: vrije `utm_medium`-woorden, want GA4 deelt kanalen daarop in en één verkeerd woord maakt het kanaaloverzicht onbruikbaar.
- **2026-09-27: geen verborgen SEO-tekst meer.** Het onzichtbare `#seo-content`-blok (1px, geclipt, `aria-hidden`) op `index.html` en `producten.html` is verwijderd: Google noemt verborgen tekst en links een spamovertreding. Bijna alles erin stond al zichtbaar op de site en in de JSON-LD (FAQPage, LocalBusiness, 39 producten met prijs). Het enige unieke deel, de links naar de 10 gidsen, staat nu zichtbaar in de footer van de homepage. Afgewezen: het blok zichtbaar maken als extra sectie (dubbel met de zichtbare FAQ en catalogus). Voeg nooit opnieuw tekst toe die voor bezoekers verborgen is.
- **2026-09-27: vooraf opgebouwde HTML (prerender).** De site bouwt zich op met React, dus lezers zonder JavaScript (AI-crawlers) zagen alleen `{{ }}`-sjabloontekst. `prerender.py` zet nu de Nederlandse weergave als gewone, zichtbare HTML in `#dc-prerender`; `support.js` (lokaal gepatcht) laat React daarin mounten en haalt het sjabloon pas na de eerste render weg, anders verspringt de pagina. Het sjabloon zelf staat in `<template data-dc-template>`: browsers tonen het niet en tekstlezers slaan het over, dus niemand ziet nog `{{ }}`. React en ReactDOM krijgen een preload zodat ze niet achter de productfoto's aan laden. Gemeten op traag netwerk met gzip: LCP gelijk of sneller, CLS onder 0,04. Afgewezen: `<noscript>`-kopie (read-page en veel AI-lezers gooien noscript weg) en een vaste mobiele snapshot (desktop is de gangbare crawlerbreedte). `prerender.py` staat bewust in git, anders kan niemand het blok bijwerken.
- **2026-09-27: Nederlands is de standaardtaal.** De site koos Engels voor elke browser met Engelse taal. Googlebot meldt zich als en-US, dus Google kreeg de Engelse tekst op een Nederlandse pagina, en Vlamingen met een Engelstalige pc ook. Nu: bewaarde keuze, anders Frans voor Franstalige browsers, anders Nederlands. Engels via de EN-knop (wordt onthouden). Afgewezen: taal kiezen op basis van bot-detectie (dan krijgt Google iets anders dan bezoekers).

## Nog aan te vullen

- E-mailhosting voor `@audiolyte.be` adressen
- Bedrijfsgegevens voor de wettelijk verplichte vermeldingen (bedrijfsnaam, BTW-nummer, adres) in de footer.
