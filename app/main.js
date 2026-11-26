// Router and control wiring for Japan in Numbers.
//
//   #/                overview
//   #/population      population (range buttons: 5y / 10y / since 2000)
//   #/economy         economy (GDP toggle: total / per person)
//   #/work            work
//   #/prices          prices
//   #/society         society
//   #/regions         regions (search + sortable prefecture table)
//   #/indicators      A–Z indicator index (search)
//   #/about           about
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import {
  pageAbout,
  pageEconomy,
  pageIndicators,
  pageMissing,
  pageOverview,
  pagePopulation,
  pagePrices,
  pageRegions,
  pageSociety,
  pageWork,
  siteNav,
} from './views.js';

const app = document.getElementById('app');
const navSlot = document.getElementById('nav');
const titleSlot = document.querySelector('title');

// Control state, kept while the visitor stays on the page. A re-render
// never resets it: switching a chart range and then sorting a table
// should not throw the first choice away.
const pageState = {
  population: { range: '10y' },
  economy: { gdpMode: 'total' },
  regions: { query: '', sortKey: 'population', sortDir: 'desc' },
  indicators: { query: '' },
};

// One row per route: its title and the function that renders it. The
// router below is just a lookup in this table, so adding a page means
// adding one row here and one nav entry in views.js — nothing else.
const ROUTES = {
  '#/': { title: 'Japan in Numbers — Japan, measured', render: () => pageOverview() },
  '#/population': { title: 'Population | Japan in Numbers', render: () => pagePopulation(pageState.population) },
  '#/economy': { title: 'Economy | Japan in Numbers', render: () => pageEconomy(pageState.economy) },
  '#/work': { title: 'Work | Japan in Numbers', render: () => pageWork() },
  '#/prices': { title: 'Prices | Japan in Numbers', render: () => pagePrices() },
  '#/society': { title: 'Society | Japan in Numbers', render: () => pageSociety() },
  '#/regions': { title: 'Regions | Japan in Numbers', render: () => pageRegions(pageState.regions) },
  '#/indicators': { title: 'Indicators A–Z | Japan in Numbers', render: () => pageIndicators(pageState.indicators) },
  '#/about': { title: 'About | Japan in Numbers', render: () => pageAbout() },
};

function currentRoute() {
  const hash = location.hash || '#/';
  return ROUTES[hash] ? hash : '#/missing';
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  navSlot.innerHTML = siteNav(route);
  const entry = ROUTES[route];
  titleSlot.textContent = entry ? entry.title : 'Japan in Numbers';
  app.innerHTML = entry ? entry.render() : pageMissing();
  wireControls();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// Live search re-renders on every keystroke, which rebuilds the input
// itself. Put the caret back where it was, or typing feels broken.
function keepSearchFocus(inputId, setValue) {
  const box = document.getElementById(inputId);
  if (!box) return;
  box.addEventListener('input', () => {
    setValue(box.value);
    const caret = box.selectionStart;
    render();
    const again = document.getElementById(inputId);
    if (again) {
      again.focus();
      again.setSelectionRange(caret, caret);
    }
  });
}

function wireControls() {
  // Population range buttons re-render the chart for the chosen span.
  app.querySelectorAll('[data-range]').forEach((button) => {
    button.addEventListener('click', () => {
      pageState.population.range = button.getAttribute('data-range');
      render();
    });
  });
  // Economy GDP measure toggle re-renders the GDP chart.
  app.querySelectorAll('[data-gdp]').forEach((button) => {
    button.addEventListener('click', () => {
      pageState.economy.gdpMode = button.getAttribute('data-gdp');
      render();
    });
  });
  // Regions: sort by clicking a column heading; a second click flips direction.
  app.querySelectorAll('[data-sort]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-sort');
      const regions = pageState.regions;
      if (regions.sortKey === key) {
        regions.sortDir = regions.sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        regions.sortKey = key;
        regions.sortDir = key === 'name' ? 'asc' : 'desc';
      }
      render();
    });
  });
  // Regions + indicators: live search filters the table as you type.
  keepSearchFocus('pref-search', (v) => { pageState.regions.query = v; });
  keepSearchFocus('ind-search', (v) => { pageState.indicators.query = v; });
}

window.addEventListener('hashchange', render);
render();
