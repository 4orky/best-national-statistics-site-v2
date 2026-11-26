[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/4orky/best-national-statistics-site-v2/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/4orky/best-national-statistics-site-v2/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# Japan in Numbers

An independent atlas of Japan's official statistics — population, economy, work, prices and society — built for the [make.fun best national statistics site bounty](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

Nine pages, every one reached by a link from the top nav: an overview with three takeaways and six headline indicators, population (range-switchable chart, a year-on-year change table, age structure, births and deaths, prefectures), economy (GDP total/per-person toggle, real growth, trade, debt and markets), work, prices, society, regions (searchable, sortable prefecture table plus metro areas), an A–Z indicator index (28 indicators, searchable), and an About page with sources and methods. Every figure names its source and year, on the page where it appears. Charts are hand-drawn SVG with a shaded area under each line; there is no framework and no network request anywhere.

## Run it

Open `app/index.html` in a desktop browser (or `node serve.ts` and visit http://localhost:8080). No build step, no network requests — every script, stylesheet and figure is a file under `app/`.

## Layout

- `main.ts` — the entrypoint: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`
- `app/` — the site: `index.html`, `style.css`, `main.js` (table-driven router), `data.js` (figures), `charts.js` (SVG charts), `views.js` (pages), `format.js`
- `screenshots/` — 4 real renders of the site, one at phone size
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
