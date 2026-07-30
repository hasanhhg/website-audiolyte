# Audiolyte — website

Productieklare statische website voor **audiolyte.be** (verhuur & installatie van geluid, licht en video).

## Hosting

| Onderdeel | Waar |
|---|---|
| **Website** | GitHub Pages (`hasanhhg/website-audiolyte`, branch `main`) |
| **Domein** (`audiolyte.be`) | [mijn.host](https://mijn.host) — domeinregistratie + DNS-beheer |

De website wordt gehost op GitHub Pages. Het domein (`audiolyte.be`) is geregistreerd bij mijn.host. In het mijn.host controlepaneel (`/cp/domains/`) wijzen A-records het domein naar de GitHub Pages IP's:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

## Wat staat hier

| Bestand / map | Doel |
|---|---|
| `index.html` | Homepage |
| `producten.html` | Productcatalogus + offerte |
| `support.js` | Runtime die de pagina's rendert — verplicht mee uploaden |
| `assets/` | Logo's, productfoto's, showfoto's, favicon |
| `404.html` | Foutpagina (GitHub Pages pikt dit automatisch op) |
| `robots.txt` | Zoekmachines + AI-crawlers toegelaten, verwijst naar sitemap |
| `sitemap.xml` | Sitemap voor Google/Bing |
| `llms.txt` | Samenvatting voor AI-zoekmachines (GEO) |
| `CNAME` | Custom domein voor GitHub Pages (audiolyte.be) |
| `analytics.js` | GA4 analytics (GDPR-bewust) |
| `vendor/` | React + Babel (self-hosted, niet van CDN) |
| `.nojekyll` | Schakelt Jekyll-verwerking uit op GitHub Pages |

**Niet uploaden:** de map `uploads/` (bronmateriaal, ~50MB).

## Publiceren op GitHub Pages

1. Maak een repository.
2. Upload alles behalve `uploads/`.
3. Settings → Pages → Source: `main` branch, `/ (root)`.
4. Custom domain: vul `audiolyte.be` in (het `CNAME`-bestand staat al klaar) en zet **Enforce HTTPS** aan.
5. Bij mijn.host: A-records naar bovenstaande IP's of CNAME van `www` naar `<gebruikersnaam>.github.io`.

## Wijzigingen doorvoeren

Bewerk HTML-bestanden rechtstreeks. Productdata en prijzen staan in `producten.html` in het `CATS`-blok; pakketten in het `PK`-blok (in beide pagina's, 3 talen).

## Nog aan te vullen

- Bedrijfsgegevens voor de wettelijk verplichte vermeldingen (bedrijfsnaam, BTW-nummer, adres) in de footer.
