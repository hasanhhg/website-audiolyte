# Audiolyte — website

Productieklare statische website voor **audiolyte.be** (verhuur & installatie van geluid, licht en video).

## Hosting

| Onderdeel | Waar |
|---|---|
| **Website** | GitHub Pages (`hasanhhg/website-audiolyte`, branch `main`) |
| **Domein** (`audiolyte.be`) | my.host (domeinregistratie + DNS) |

De DNS bij my.host wijst `audiolyte.be` via A-records naar de GitHub Pages IP's:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

## Wat staat hier

| Bestand / map | Doel |
|---|---|
| `index.html` | Homepage (hosting-kopie van `Audiolyte.dc.html`) |
| `producten.html` | Productcatalogus + offerte (kopie van `Producten.dc.html`) |
| `support.js` | Runtime die de pagina's rendert — verplicht mee uploaden |
| `assets/` | Logo's, productfoto's, showfoto's, favicon |
| `404.html` | Foutpagina (GitHub Pages pikt dit automatisch op) |
| `robots.txt` | Zoekmachines + AI-crawlers toegelaten, verwijst naar sitemap |
| `sitemap.xml` | Sitemap voor Google/Bing |
| `llms.txt` | Samenvatting voor AI-zoekmachines (GEO) |
| `CNAME` | Custom domein voor GitHub Pages (audiolyte.be) |
| `.nojekyll` | Schakelt Jekyll-verwerking uit op GitHub Pages |
| `Audiolyte.dc.html`, `Producten.dc.html` | Bewerkbare bronbestanden (niet nodig op de server, mag mee) |

**Niet uploaden:** de map `uploads/` (bronmateriaal, ~50MB).

## Publiceren op GitHub Pages

1. Maak een repository (bv. `audiolyte-site`).
2. Upload alles behalve `uploads/`.
3. Settings → Pages → Source: `main` branch, `/ (root)`.
4. Custom domain: vul `audiolyte.be` in (het `CNAME`-bestand staat al klaar) en zet **Enforce HTTPS** aan.
5. Bij je domeinregistrar (my.host): A-records naar bovenstaande IP's of een CNAME van `www` naar `<gebruikersnaam>.github.io`.

## Wijzigingen doorvoeren

Bewerk `Audiolyte.dc.html` / `Producten.dc.html` (of `index.html` / `producten.html` rechtstreeks — het zijn kopieën met aangepaste onderlinge links). Productdata en prijzen staan in `producten.html` in het `CATS`-blok; pakketten in het `PK`-blok (in beide pagina's, 3 talen).

## Nog aan te vullen

- Bedrijfsgegevens voor de wettelijk verplichte vermeldingen (bedrijfsnaam, BTW-nummer, adres) in de footer.
