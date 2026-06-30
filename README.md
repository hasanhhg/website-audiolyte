# Audiolyte

[![Deploy to GitHub Pages](https://github.com/hasanhhg/audiolyte-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/hasanhhg/audiolyte-website/actions/workflows/deploy.yml)

**Sound & light rental Belgium** — Professionele audio, licht en video verhuur voor evenementen in België.

## Site

- **Live:** [https://audiolyte.be](https://audiolyte.be)
- **Taal:** Nederlands · English · Français (client-side switch)
- **Framework:** DC Runtime (DesignCode)

## Pages

| Page | URL | Beschrijving |
|------|-----|-------------|
| Homepage | `/` | Hero, diensten, materiaal, realisaties, pakketten, contact |
| Producten | `/Producten.dc.html` | Volledige inventaris met selectie + offerteformulier |

## Productcategorieën

- **Licht** — 40+ toestellen: moving heads, washes, beams, hazers, lasers
- **Audio** — PA, mixers, wireless, monitors, DI, stageboxes
- **DJ, Video & Backline** — CDJ-3000, DJM-A9, schermen, keyboards
- **Trussing & Decor** — Truss, towers, lifts, molton backdrops
- **Kabels & Stroom** — XLR, CAT6, stroomverdeling

## Tech

- Static site op GitHub Pages
- DC Runtime (support.js) voor interactieve templates
- Trilingual (NL/EN/FR) via client-side localStorage
- Productselectie + offerteformulier (POST /api/quote via lokale server of Formspree)
- GitHub Actions deploy op push naar `main`

## Development

```bash
python3 server.py 3001
# Bezoek http://localhost:3001
```

## Licentie

MIT
