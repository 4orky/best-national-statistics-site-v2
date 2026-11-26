// Page templates for Japan in Numbers.
//
// Each function takes the data it needs and returns HTML. No chart maths
// here (charts.js), no figures here (data.js) — only the shape of each
// page: which sections it has, in what order, and what each control does.
import { lineChart, barChart, shareBars } from './charts.js';
import { escapeHtml, fmtPct, sourceLine } from './format.js';
import {
  AGE_STRUCTURE,
  CPI_SERIES,
  GDP_SERIES,
  GDP_YEN_2024,
  GROWTH_SERIES,
  HEADLINE,
  INDICATORS,
  KEY_TAKEAWAYS,
  METRO_AREAS,
  POPULATION_SERIES,
  PREFECTURES,
  RELEASES,
  SOCIETY_2024,
  TRADE_2024,
  UNEMPLOYMENT_SERIES,
  VITALS,
  WORK_2024,
} from './data.js';

// The nine pages, in nav order. `route` is the hash; `label` is the nav text.
const NAV = [
  { route: '#/', label: 'Overview' },
  { route: '#/population', label: 'Population' },
  { route: '#/economy', label: 'Economy' },
  { route: '#/work', label: 'Work' },
  { route: '#/prices', label: 'Prices' },
  { route: '#/society', label: 'Society' },
  { route: '#/regions', label: 'Regions' },
  { route: '#/indicators', label: 'Indicators A–Z' },
  { route: '#/about', label: 'About' },
];

export function siteNav(active) {
  const links = NAV.map(
    ({ route, label }) => `<a href="${route}"${route === active ? ' aria-current="page" class="active"' : ''}>${label}</a>`,
  ).join('');
  return `<nav class="topnav" aria-label="Sections">${links}</nav>`;
}

function kpiCard(item) {
  return `<a class="kpi" href="${item.page}">
  <span class="kpi-label">${escapeHtml(item.label)}</span>
  <span class="kpi-value">${escapeHtml(item.value)}</span>
  <span class="kpi-note">${escapeHtml(item.change)} · ${item.year}</span>
  <span class="kpi-source">Source: ${escapeHtml(item.source)}</span>
</a>`;
}

function factCard(row) {
  return `<div class="fact">
  <span class="fact-label">${escapeHtml(row.label)}</span>
  <span class="fact-value">${escapeHtml(row.value)}</span>
  <span class="fact-note">${escapeHtml(row.note)}</span>
  <span class="fact-source">Source: ${escapeHtml(row.source)}</span>
</div>`;
}

function section(title, body, note = '') {
  return `<section class="block"><h2>${title}</h2>${body}${note}</section>`;
}

// A highlighted takeaway box: one sentence, linked to the page behind it.
function takeaway(item) {
  return `<a class="takeaway" href="${item.page}">${escapeHtml(item.text)} <span>Read more &rarr;</span></a>`;
}

function choiceButtons(current, options, attr) {
  return `<div class="controls" role="group" aria-label="Chart options">${options
    .map(([key, label]) => `<button type="button" data-${attr}="${key}"${key === current ? ' aria-pressed="true" class="on"' : ''}>${label}</button>`)
    .join('')}</div>`;
}

export function pageOverview() {
  const pop = lineChart(POPULATION_SERIES.filter((p) => p.year >= 2015), { unit: 'm', decimals: 1 });
  const gdp = barChart(GDP_SERIES.map((p) => ({ year: p.year, value: p.total })), { unit: '', decimals: 2 });
  const topics = [
    ['#/population', 'Population', '124.0 million people, and falling by about 500,000 a year.'],
    ['#/economy', 'Economy', 'The world’s 4th largest economy at $4.19 trillion.'],
    ['#/work', 'Work', 'Unemployment 2.5% — among the lowest in the developed world.'],
    ['#/prices', 'Prices', 'Inflation +2.7% in 2024 after decades near zero.'],
    ['#/society', 'Society', 'The world’s oldest population, living the longest.'],
    ['#/regions', 'Regions', 'Tokyo alone holds 14.18 million people.'],
  ];
  return `<p class="standfirst">Japan, measured: population, economy, work, prices and society — every figure with its source and year.</p>
<div class="takeaways">${KEY_TAKEAWAYS.map(takeaway).join('')}</div>
<div class="kpis">${HEADLINE.map(kpiCard).join('')}</div>
${section('Population is shrinking', `<div class="chart">${pop}</div>
<p>Japan’s population peaked at 128.1 million in 2010 and has fallen every year since — 124.0 million in 2024.</p>
<p><a href="#/population">Population in full &rarr;</a></p>`, sourceLine('World Bank, World Development Indicators', 2024))}
${section('The economy in dollars', `<div class="chart">${gdp}</div>
<p>Nominal GDP in US dollars fell in 2022–2024 as the yen weakened, even while the economy grew in yen terms.</p>
<p><a href="#/economy">Economy in full &rarr;</a></p>`, sourceLine('World Bank, World Development Indicators', 2024))}
${section('Latest annual releases', `<ul class="releases">${RELEASES.map(
    (r) => `<li><a href="${r.page}">${escapeHtml(r.title)}</a><span>${escapeHtml(r.publisher)} · ${r.year}</span></li>`,
  ).join('')}</ul>`)}
${section('Explore by topic', `<div class="topics">${topics.map(
    ([href, title, blurb]) => `<a class="topic" href="${href}"><strong>${title}</strong><span>${blurb}</span></a>`,
  ).join('')}</div>`)}`;
}

const POP_RANGES = [['5y', '5 years'], ['10y', '10 years'], ['all', 'Since 2000']];

// Year-on-year change in millions, worked out from the series itself so
// the table can never disagree with the chart above it.
function yearlyChange(series) {
  const rows = [];
  for (let i = 1; i < series.length; i += 1) {
    const change = series[i].value - series[i - 1].value;
    const pct = (change / series[i - 1].value) * 100;
    rows.push({ year: series[i].year, change, pct });
  }
  return rows.reverse();
}

export function pagePopulation(state) {
  const from = state.range === '5y' ? 2020 : state.range === '10y' ? 2015 : 2000;
  const series = POPULATION_SERIES.filter((p) => p.year >= from);
  const chart = lineChart(series, { unit: 'm', decimals: 1 });
  const vitals = `<table class="data"><thead><tr><th>Measure</th><th>Value</th><th>Note</th><th>Source</th></tr></thead><tbody>${VITALS.map(
    (v) => `<tr><td>${escapeHtml(v.label)}</td><td class="num">${escapeHtml(v.value)}</td><td>${escapeHtml(v.note)}</td><td>${escapeHtml(v.source)}</td></tr>`,
  ).join('')}</tbody></table>`;
  const prefectures = `<table class="data"><thead><tr><th>#</th><th>Prefecture</th><th class="num">Population</th></tr></thead><tbody>${PREFECTURES.slice(0, 5).map(
    (p, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(p.name)}</td><td class="num">${p.population.toFixed(2)}m</td></tr>`,
  ).join('')}</tbody></table>`;
  const changes = yearlyChange(POPULATION_SERIES.filter((p) => p.year >= 2015));
  const changeTable = `<table class="data"><thead><tr><th>Year</th><th class="num">Change on last year</th><th class="num">Change, %</th></tr></thead><tbody>${changes.map(
    (r) => `<tr><td>${r.year}</td><td class="num">${r.change.toFixed(1)}m</td><td class="num">${fmtPct(r.pct)}</td></tr>`,
  ).join('')}</tbody></table>`;
  return `<p class="standfirst">123.98 million people in 2024 — down 0.4% on the year, and down every year since 2010.</p>
${section('Population over time', choiceButtons(state.range, POP_RANGES, 'range') + `<div class="chart">${chart}</div>
<p>From a peak of 128.1 million in 2010, Japan has lost about 4 million people. The fall is speeding up: 2024 alone lost roughly half a million.</p>`, sourceLine('World Bank, World Development Indicators', 2024))}
${section('How fast is the fall?', changeTable + `<p>The yearly loss has grown from 0.2 million in 2016 to 0.5 million in 2024. Every year in the table is a fall — there has not been a year of growth since 2010.</p>`, sourceLine('World Bank, World Development Indicators; change worked out from the series above', 2024))}
${section('An old country', `<div class="chart">${shareBars(AGE_STRUCTURE)}</div>
<p>Almost three in ten people are 65 or older — the highest share anywhere — while only 11.4% are children under 15.</p>`, sourceLine('World Bank, World Development Indicators', 2024))}
${section('Births, deaths and fertility', vitals + `<p>Births fell to 720,988 in 2024, the fewest on record, and the fertility rate to 1.15 children per woman — far below the 2.1 needed to hold the population steady.</p>`)}
${section('Where people live', prefectures + `<p><a href="#/regions">All prefectures and metro areas &rarr;</a></p>`, sourceLine('Statistics Bureau of Japan, population estimates', 2024))}`;
}

export function pageEconomy(state) {
  const mode = state.gdpMode === 'perCapita' ? 'perCapita' : 'total';
  const series = GDP_SERIES.map((p) => ({ year: p.year, value: mode === 'total' ? p.total : p.perCapita }));
  const chart = barChart(series, { unit: '', decimals: mode === 'total' ? 2 : 0 });
  const growth = barChart(GROWTH_SERIES, { unit: '%', decimals: 1, signed: true });
  return `<p class="standfirst">GDP $4.19 trillion in 2024 — the world’s 4th largest economy — with real growth of −0.2%.</p>
${section('Gross domestic product', choiceButtons(mode, [['total', 'Total, $ trillion'], ['perCapita', 'Per person, $']], 'gdp') + `<div class="chart">${chart}</div>
<p>In yen, GDP was ${GDP_YEN_2024} in 2024. The dollar figure fell after 2021 because the yen weakened against the dollar, not because Japan produced less.</p>`, sourceLine('World Bank, World Development Indicators; IMF', 2024))}
${section('Real growth year by year', `<div class="chart">${growth}</div>
<p>2020 shrank 4.2% in the pandemic; the rebound peaked in 2021 at +2.6%; 2024 slipped back to −0.2%.</p>`, sourceLine('World Bank, World Development Indicators', 2024))}
${section('Trade, debt and markets in 2024', `<div class="facts">${TRADE_2024.map(factCard).join('')}</div>`)}`;
}

export function pageWork() {
  const chart = lineChart(UNEMPLOYMENT_SERIES, { unit: '%', decimals: 1 });
  return `<p class="standfirst">Unemployment 2.5% in 2024 — low by any standard — with 69.3 million people in the labour force.</p>
${section('Unemployment over time', `<div class="chart">${chart}</div>
<p>Even in the pandemic year of 2020, unemployment only reached 2.8%. Japan has run below 3% every year since 2017.</p>`, sourceLine('ILO modelled estimates, via World Bank', 2024))}
${section('Work in 2024', `<div class="facts">${WORK_2024.map(factCard).join('')}</div>`)}`;
}

export function pagePrices() {
  const chart = barChart(CPI_SERIES, { unit: '%', decimals: 1, signed: true });
  const rows = CPI_SERIES.map((p) => `<tr><td>${p.year}</td><td class="num">${fmtPct(p.value)}</td></tr>`).join('');
  return `<p class="standfirst">Consumer prices rose 2.7% in 2024 — the third straight year above 2% after decades near zero.</p>
${section('Inflation year by year', `<div class="chart">${chart}</div>
<p>Prices fell slightly in 2021, then jumped with the post-pandemic recovery: +2.5% in 2022, +3.3% in 2023, +2.7% in 2024.</p>`, sourceLine('World Bank, World Development Indicators', 2024))}
${section('Annual CPI change', `<table class="data"><thead><tr><th>Year</th><th class="num">CPI change</th></tr></thead><tbody>${rows}</tbody></table>`, sourceLine('World Bank, consumer prices, annual %', 2024))}`;
}

export function pageSociety() {
  return `<p class="standfirst">84.0 years of life expectancy, 92.2% of people in towns and cities, and a record 36.87 million visitors in 2024.</p>
${section('People and wellbeing in 2024', `<div class="facts">${SOCIETY_2024.map(factCard).join('')}</div>`)}
${section('The oldest country on earth', `<p>With a median age of 49.9 years and 29.8% of the population over 65, Japan is the oldest large country in the world — and also one of the longest-lived, at 84.0 years. Hospital capacity is the deepest anywhere: 12.6 beds per 1,000 people.</p>
<p>Education reaches far: 65% of 25–34-year-olds hold a tertiary degree. And 2024 was a record year for visitors, with 36.87 million arrivals — more than before the pandemic.</p>`, sourceLine('World Bank; OECD; UNDP; JNTO', 2024))}`;
}

export function prefectureTable(rows) {
  return `<table class="data"><thead><tr>
<th><button type="button" data-sort="rank">#</button></th>
<th><button type="button" data-sort="name">Prefecture</button></th>
<th class="num"><button type="button" data-sort="population">Population</button></th>
<th class="num"><button type="button" data-sort="share">Share of Japan</button></th>
</tr></thead><tbody>${rows.map(
    (p, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(p.name)}</td><td class="num">${p.population.toFixed(2)}m</td><td class="num">${((p.population / 123.98) * 100).toFixed(1)}%</td></tr>`,
  ).join('')}</tbody></table>`;
}

export function pageRegions(state) {
  const query = (state.query || '').trim().toLowerCase();
  let rows = PREFECTURES.filter((p) => !query || p.name.toLowerCase().includes(query));
  const dir = state.sortDir === 'desc' ? -1 : 1;
  if (state.sortKey === 'name') rows = [...rows].sort((a, b) => dir * a.name.localeCompare(b.name));
  else if (state.sortKey === 'population' || state.sortKey === 'share') rows = [...rows].sort((a, b) => dir * (a.population - b.population));
  const metro = `<table class="data"><thead><tr><th>Metro area</th><th class="num">Population</th></tr></thead><tbody>${METRO_AREAS.map(
    (m) => `<tr><td>${escapeHtml(m.name)}</td><td class="num">${m.population.toFixed(2)}m</td></tr>`,
  ).join('')}</tbody></table>`;
  return `<p class="standfirst">Ten prefectures hold more than half the country. Tokyo alone holds 14.18 million people — more than one in nine.</p>
${section('Largest prefectures', `<div class="controls"><label class="search">Search prefectures <input type="search" id="pref-search" value="${escapeHtml(state.query || '')}" placeholder="e.g. Osaka" autocomplete="off"></label></div>
${rows.length ? prefectureTable(rows) : '<p>No prefecture matches that search.</p>'}
<p>Click a column heading to sort. Search filters the list as you type.</p>`, sourceLine('Statistics Bureau of Japan, population estimates, 1 Oct', 2024))}
${section('Largest metro areas', metro, sourceLine('United Nations / CIA World Factbook', 2023))}`;
}

export function pageIndicators(state) {
  const query = (state.query || '').trim().toLowerCase();
  const rows = INDICATORS.filter((r) => !query || r.name.toLowerCase().includes(query));
  return `<p class="standfirst">Every headline indicator on this site, A to Z. Search to filter; each one links to the page that explains it.</p>
${section(`${INDICATORS.length} indicators`, `<div class="controls"><label class="search">Search indicators <input type="search" id="ind-search" value="${escapeHtml(state.query || '')}" placeholder="e.g. inflation" autocomplete="off"></label></div>
${rows.length ? `<table class="data"><thead><tr><th>Indicator</th><th>Latest value</th><th>Year</th><th>Source</th></tr></thead><tbody>${rows.map(
    (r) => `<tr><td><a href="${r.page}">${escapeHtml(r.name)}</a></td><td class="num">${escapeHtml(r.value)}</td><td>${r.year}</td><td>${escapeHtml(r.source)}</td></tr>`,
  ).join('')}</tbody></table>` : '<p>No indicator matches that search.</p>'}`)}`;
}

export function pageAbout() {
  return `<p class="standfirst">How this atlas is made, where every number comes from, and how to cite it.</p>
${section('What this site is', `<p><strong>Japan in Numbers</strong> is an independent atlas of Japan’s official statistics, built by one person from published figures. It is not affiliated with the Statistics Bureau of Japan, the Cabinet Office, or any government body, and it copies no official site’s design, text or images.</p>
<p>Every figure on this site names its source and its year next to the number. Where sources disagree — for example, real GDP growth for 2024 is −0.2% in the World Bank series and +0.1% in the IMF’s — the site uses one series consistently and names it, so the charts and the headlines agree with each other.</p>`)}
${section('Sources', `<ul class="sources">
<li>World Bank, World Development Indicators — population, GDP, inflation, unemployment, life expectancy, trade.</li>
<li>Statistics Bureau of Japan — population estimates by prefecture, labour force survey, consumer price index.</li>
<li>Ministry of Health, Labour and Welfare — vital statistics, fertility, minimum wage.</li>
<li>Cabinet Office — national accounts.</li>
<li>IMF — government debt, yen GDP.</li>
<li>Japan National Tourism Organization — visitor arrivals.</li>
<li>OECD — hospital beds, tertiary education. UNDP — Human Development Index.</li>
</ul>`)}
${section('Methods and updates', `<p>Figures are shown as published, rounded for display; underlying values are kept to the precision the source gives. Dollar GDP uses market exchange rates, so it moves with the yen. New annual figures are added when the source publishes them — the population estimates each autumn, the national accounts each spring.</p>
<p>How to cite a figure: “Japan in Numbers, [indicator], [year], source: [source named on the page].”</p>`)}
${section('Running the site', `<p>This site is static files only: open <code>index.html</code> in any browser, or serve this folder with any static server. It makes no network requests and stores nothing.</p>`)}`;
}

export function pageMissing() {
  return `<h1>Page not found</h1><p>There is no statistics page at this address. <a href="#/">Back to the overview</a>, or try the <a href="#/indicators">A–Z indicator index</a>.</p>`;
}
