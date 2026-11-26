# Design note — Japan in Numbers (best-national-statistics-site, v2 rebuild)

Country: **Japan**. All figures 2024 unless stated, each with source + year on the page.
Sources verified 2026-11-26 via World Bank WDI / Statistics Bureau of Japan / MHLW / Cabinet Office / IMF / OECD / UNDP / JNTO:
- Population 123.98m (2024, World Bank); growth −0.4%; 65+ 29.8%; under-15 11.4%
- GDP $4.19T (2024, World Bank); per capita $33,797; real growth −0.2% (World Bank); ¥609.5tn in yen
- CPI inflation +2.7% (2024, World Bank); unemployment 2.5% (2024, ILO modelled)
- Labour force 69.3m; participation 63.3% (2024, World Bank)
- Fertility 1.15 (2024, World Bank/MHLW); births 720,988; birth rate 5.7, death rate 13.3 per 1,000
- Life expectancy 84.0y total, women 87.1, men 81.1 (2024)
- Median age 49.9y (2024 est.); urban 92.2% (2024); density 342/km²; land 377,975 km²
- Exports of goods $707.4bn; imports $742.7bn (2024); govt debt 236.7% of GDP (IMF)
- Visitors 36.87m (2024, JNTO, record); HDI 0.925 (2023, UNDP); infant mortality 1.9 per 1,000 (2024)
- Hospital beds 12.6 per 1,000 (2022, OECD); tertiary attainment 25–34: 65% (2023, OECD)
- Min. wage ¥1,055/hour (Oct 2024, MHLW); Nikkei 225 39,895 at end-2024; ¥157/US$ (Dec 2024)

## Why this shape (scored 1–5 against the brief's judge criteria)

The brief wants a site, not a page: "pages, charts and sections a visitor
needs", each reached by a link. Three shapes were weighed:

- **One long scroll** — all sections stacked, anchor nav only. Fails the
  brief's "each reached by a link" test (anchors, not pages) and buries any
  single indicator under a long scroll. Out.
- **Dashboard** — KPI tiles + one chart wall, tabs switching datasets on a
  single page. Compact and good-looking, but still one page: no distinct
  places to explore, thin navigation for a statistics site. Out.
- **Atlas (picked)** — hash-routed multi-page site: Overview, Population,
  Economy, Work, Prices, Society, Regions, Indicators A–Z, About. Every
  page has its own charts + tables; range buttons re-render charts; tables
  sort by clicking headers; search filters prefectures and the A–Z index;
  the GDP chart toggles total/per-capita. Real pages, real navigation,
  every control visibly does something.

## What v2 changed vs the pre-open build

The v1 build was finished before the bounty opened, so it cannot be
submitted as-is (repo predates the open, and its build session predates
it too). v2 is a from-scratch rewrite in a new session and a new repo,
with the same verified figures and three genuine additions:
1. **Takeaways row on the overview** — three one-sentence summaries, each
   linked to the page behind it, so a visitor gets the country in seconds.
2. **Year-on-year change table on the population page** — worked out from
   the chart series itself, so table and chart can never disagree; it shows
   the yearly loss growing from 0.2m (2016) to 0.5m (2024).
3. **Land area + density in Society** (377,975 km², 342/km²) and two more
   A–Z entries, plus shaded areas under line charts, a skip link, and a
   table-driven router (`ROUTES` in main.js) with a shared search-focus
   helper instead of duplicated caret-restore code.

## Site map (hash routes)
- #/            Overview — takeaways, hero KPIs, population line, GDP bars, latest releases, topic cards
- #/population  Population — range chart, yearly-change table, age bars, births/deaths/fertility, prefecture table
- #/economy     Economy — GDP chart (total/per-capita toggle), growth, trade, debt, markets
- #/work        Work — unemployment chart, labour force, minimum wage
- #/prices      Prices — CPI bar chart, inflation table
- #/society     Society — life expectancy, health, education, visitors, land + density
- #/regions     Regions — sortable prefecture table with search, metro areas
- #/indicators  Indicators A–Z — searchable full index (28), every indicator links to its page
- #/about       About — sources & methods, update schedule, independence note

## Files (app/, one clear job each)
- index.html — shell, nav, footer; loads style.css + main.js
- style.css — all styling incl. phone layout, takeaway cards, skip link
- main.js — table-driven router + control wiring + __shotReady flag
- data.js — every figure, series and source (no logic)
- charts.js — SVG line/bar/hbar builders with shared axis grid (no data)
- views.js — page templates from data (no chart math)
- format.js — number formatting helpers, incl. signed percentages

## Screenshots (4, re-shot on the v2 code)
1. 1-overview.jpg — 1280×800 home
2. 2-population.jpg — 1280×800 population page
3. 3-economy.jpg — 1280×800 economy page
4. 4-overview-phone.jpg — 390×844 home on phone

## Chart correctness notes (carried from v1's real-browser review)
1. Line charts use a zoomed axis (fitAxis in charts.js): a zero baseline
   flattens a 128→124m decline into invisibility, so when all values are
   positive and the range is small vs the level, the axis zooms to the
   data on round numbers.
2. Bar labels only prefix + when the series is a change (signed option);
   a + on a level (e.g. "+4.44" on GDP) reads as a change and is wrong.
3. Tooling: system Chrome refuses localhost navigation, so screenshots use
   Camoufox + playwright 1.49.1 from ~/.local (PYTHONPATH). Camoufox
   quirk: page scripts' window.* flags are invisible to Playwright
   evaluate (separate realm) — shoot.py waits on DOM (app children + svg)
   instead of window.__shotReady; the flag stays in main.js for other
   harnesses.
