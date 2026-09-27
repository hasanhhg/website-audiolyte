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

## Beslissingen

- **2026-09-27: geen verborgen SEO-tekst meer.** Het onzichtbare `#seo-content`-blok (1px, geclipt, `aria-hidden`) op `index.html` en `producten.html` is verwijderd: Google noemt verborgen tekst en links een spamovertreding. Bijna alles erin stond al zichtbaar op de site en in de JSON-LD (FAQPage, LocalBusiness, 39 producten met prijs). Het enige unieke deel, de links naar de 10 gidsen, staat nu zichtbaar in de footer van de homepage. Afgewezen: het blok zichtbaar maken als extra sectie (dubbel met de zichtbare FAQ en catalogus). Voeg nooit opnieuw tekst toe die voor bezoekers verborgen is.
- **2026-09-27: vooraf opgebouwde HTML (prerender).** De site bouwt zich op met React, dus lezers zonder JavaScript (AI-crawlers) zagen alleen `{{ }}`-sjabloontekst. `prerender.py` zet nu de Nederlandse weergave als gewone, zichtbare HTML in `#dc-prerender`; `support.js` (lokaal gepatcht) laat React daarin mounten en haalt het sjabloon pas na de eerste render weg, anders verspringt de pagina. React en ReactDOM krijgen een preload zodat ze niet achter de productfoto's aan laden. Gemeten op traag netwerk met gzip: LCP gelijk of sneller, CLS onder 0,04. Afgewezen: `<noscript>`-kopie (read-page en veel AI-lezers gooien noscript weg) en een vaste mobiele snapshot (desktop is de gangbare crawlerbreedte). `prerender.py` staat bewust in git, anders kan niemand het blok bijwerken.

## Nog aan te vullen

- E-mailhosting voor `@audiolyte.be` adressen
- Bedrijfsgegevens voor de wettelijk verplichte vermeldingen (bedrijfsnaam, BTW-nummer, adres) in de footer.
