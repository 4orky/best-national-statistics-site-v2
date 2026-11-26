// Japan in Numbers — the figures behind the site.
//
// Every number below is a published figure, shown with the source and year
// that published it. The country is Japan; the headline year is 2024
// unless a row says otherwise. Figures were checked on 26 November 2026
// against the World Bank's World Development Indicators, the Statistics
// Bureau of Japan, the Ministry of Health, Labour and Welfare, the
// Cabinet Office, the IMF, the OECD, the UNDP and JNTO.
//
// This file holds numbers only. How they are drawn lives in charts.js,
// how pages are laid out lives in views.js, and neither of those files
// carries a single figure of its own.

export const META = {
  country: 'Japan',
  siteName: 'Japan in Numbers',
  tagline: 'An independent atlas of Japan’s official statistics',
  updated: '26 November 2026',
  note: 'Independent atlas. Not affiliated with the Statistics Bureau of Japan or any government body.',
  landAreaKm2: 377975,
  densityPerKm2: 342,
};

// The six numbers on the front page. `page` is where each one is explained.
export const HEADLINE = [
  { label: 'Population', value: '123.98m', change: '−0.4% on 2023', year: 2024, source: 'World Bank', page: '#/population' },
  { label: 'GDP', value: '$4.19tn', change: '−0.2% real growth', year: 2024, source: 'World Bank', page: '#/economy' },
  { label: 'GDP per person', value: '$33,797', change: '4th largest economy', year: 2024, source: 'World Bank', page: '#/economy' },
  { label: 'Unemployment', value: '2.5%', change: 'labour force 69.3m', year: 2024, source: 'ILO / World Bank', page: '#/work' },
  { label: 'Inflation (CPI)', value: '+2.7%', change: 'annual average', year: 2024, source: 'World Bank', page: '#/prices' },
  { label: 'Life expectancy', value: '84.0 yrs', change: 'women 87.1, men 81.1', year: 2024, source: 'World Bank', page: '#/society' },
];

// Three sentences that sum the country up, each tied to a page.
export const KEY_TAKEAWAYS = [
  { text: 'Japan is shrinking by about half a million people a year — and has done so every year since 2010.', page: '#/population' },
  { text: 'It is still the world’s 4th largest economy, at $4.19 trillion, even as the weak yen shrinks the dollar figure.', page: '#/economy' },
  { text: 'It is the oldest large country on earth, and also one of the longest-lived, at 84.0 years.', page: '#/society' },
];

// Total population, millions, World Bank WDI. 2024 is shown rounded to one
// decimal in charts (124.0m); the headline uses the precise 123.98m.
export const POPULATION_SERIES = [
  { year: 2000, value: 126.8 }, { year: 2005, value: 127.8 }, { year: 2010, value: 128.1 },
  { year: 2015, value: 127.1 }, { year: 2016, value: 126.9 }, { year: 2017, value: 126.7 },
  { year: 2018, value: 126.5 }, { year: 2019, value: 126.3 }, { year: 2020, value: 126.1 },
  { year: 2021, value: 125.7 }, { year: 2022, value: 125.1 }, { year: 2023, value: 124.5 },
  { year: 2024, value: 124.0 },
];

// Shares of the population by age, %, 2024, World Bank.
export const AGE_STRUCTURE = [
  { group: 'Aged 0–14', value: 11.4 },
  { group: 'Aged 15–64', value: 58.8 },
  { group: 'Aged 65 and over', value: 29.8 },
];

// Births, deaths and fertility, 2024.
export const VITALS = [
  { label: 'Births', value: '720,988', note: 'fewest on record', source: 'MHLW Vital Statistics, 2024' },
  { label: 'Birth rate', value: '5.7', note: 'per 1,000 people', source: 'World Bank, 2024' },
  { label: 'Death rate', value: '13.3', note: 'per 1,000 people', source: 'World Bank, 2024' },
  { label: 'Total fertility rate', value: '1.15', note: 'births per woman', source: 'World Bank / MHLW, 2024' },
  { label: 'Natural change', value: '−942,213', note: 'births minus deaths', source: 'World Bank, 2024' },
  { label: 'Infant mortality', value: '1.9', note: 'deaths per 1,000 live births', source: 'World Bank, 2024' },
];

// Nominal GDP in $ trillion, and GDP per person in US$, World Bank WDI.
// In yen, 2024 GDP was ¥609.5 trillion (Cabinet Office / IMF).
export const GDP_YEN_2024 = '¥609.5tn';
export const GDP_SERIES = [
  { year: 2015, total: 4.44, perCapita: 34931 }, { year: 2016, total: 5.0, perCapita: 39400 },
  { year: 2017, total: 4.93, perCapita: 38913 }, { year: 2018, total: 5.04, perCapita: 39842 },
  { year: 2019, total: 5.12, perCapita: 40538 }, { year: 2020, total: 5.06, perCapita: 40127 },
  { year: 2021, total: 5.23, perCapita: 41581 }, { year: 2022, total: 4.45, perCapita: 35548 },
  { year: 2023, total: 4.38, perCapita: 35215 }, { year: 2024, total: 4.19, perCapita: 33797 },
];

// Real GDP growth, % a year, World Bank.
export const GROWTH_SERIES = [
  { year: 2019, value: -0.4 }, { year: 2020, value: -4.2 }, { year: 2021, value: 2.6 },
  { year: 2022, value: 0.9 }, { year: 2023, value: 1.7 }, { year: 2024, value: -0.2 },
];

// Trade, debt and markets, 2024.
export const TRADE_2024 = [
  { label: 'Exports of goods', value: '$707.4bn', note: '22.0% of GDP (goods and services)', source: 'World Bank, 2024' },
  { label: 'Imports of goods', value: '$742.7bn', note: '22.9% of GDP (goods and services)', source: 'World Bank, 2024' },
  { label: 'Goods balance', value: '−$35.3bn', note: 'exports minus imports', source: 'World Bank, 2024' },
  { label: 'Government debt', value: '236.7%', note: 'of GDP, gross general government', source: 'IMF, 2024' },
  { label: 'Nikkei 225', value: '39,895', note: 'close on 30 Dec 2024, +19% on the year', source: 'JPX, 2024' },
  { label: 'Yen per US dollar', value: '¥157', note: 'end of December 2024', source: 'Bank of Japan, 2024' },
];

// Consumer price inflation, % a year, World Bank.
export const CPI_SERIES = [
  { year: 2019, value: 0.5 }, { year: 2020, value: 0.0 }, { year: 2021, value: -0.2 },
  { year: 2022, value: 2.5 }, { year: 2023, value: 3.3 }, { year: 2024, value: 2.7 },
];

// Unemployment, % of the labour force, ILO modelled estimates via World Bank.
export const UNEMPLOYMENT_SERIES = [
  { year: 2019, value: 2.4 }, { year: 2020, value: 2.8 }, { year: 2021, value: 2.8 },
  { year: 2022, value: 2.6 }, { year: 2023, value: 2.6 }, { year: 2024, value: 2.5 },
];

export const WORK_2024 = [
  { label: 'Labour force', value: '69.3m', note: 'people aged 15 and over', source: 'World Bank, 2024' },
  { label: 'Participation rate', value: '63.3%', note: 'of people aged 15 and over', source: 'World Bank, 2024' },
  { label: 'Employed persons', value: '67.6m', note: 'labour force minus unemployed', source: 'Statistics Bureau, 2024' },
  { label: 'Youth unemployment', value: '3.9%', note: 'ages 15–24', source: 'World Bank, 2024' },
  { label: 'Minimum wage', value: '¥1,055', note: 'per hour, national weighted average', source: 'MHLW, Oct 2024' },
  { label: 'Employment rate', value: '61.7%', note: 'employed, ages 15 and over', source: 'World Bank, 2024' },
];

export const SOCIETY_2024 = [
  { label: 'Life expectancy', value: '84.0 yrs', note: 'women 87.1, men 81.1', source: 'World Bank, 2024' },
  { label: 'Median age', value: '49.9 yrs', note: 'women 51.3, men 48.3', source: 'CIA World Factbook, 2024 est.' },
  { label: 'Urban population', value: '92.2%', note: 'of total population', source: 'World Bank, 2024' },
  { label: 'Human Development Index', value: '0.925', note: 'on a 0–1 scale', source: 'UNDP, 2023' },
  { label: 'Hospital beds', value: '12.6', note: 'per 1,000 people', source: 'OECD, 2022' },
  { label: 'Tertiary education', value: '65%', note: 'of 25–34-year-olds hold a degree', source: 'OECD, 2023' },
  { label: 'Internet users', value: '85.5%', note: 'of the population', source: 'World Bank, 2024' },
  { label: 'Visitors from abroad', value: '36.87m', note: 'record year for arrivals', source: 'JNTO, 2024' },
  { label: 'Land area', value: '377,975 km²', note: 'about the size of Germany', source: 'Statistics Bureau, 2024' },
  { label: 'Population density', value: '342 /km²', note: 'people per square kilometre', source: 'World Bank, 2024' },
];

// Largest prefectures, millions, 1 Oct 2024 estimates, Statistics Bureau.
export const PREFECTURES = [
  { name: 'Tokyo', population: 14.18 },
  { name: 'Kanagawa', population: 9.24 },
  { name: 'Osaka', population: 8.77 },
  { name: 'Aichi', population: 7.48 },
  { name: 'Saitama', population: 7.34 },
  { name: 'Chiba', population: 6.28 },
  { name: 'Hyogo', population: 5.35 },
  { name: 'Hokkaido', population: 5.14 },
  { name: 'Fukuoka', population: 5.10 },
  { name: 'Shizuoka', population: 3.53 },
];

// Largest urban areas, millions, 2023, United Nations / CIA World Factbook.
export const METRO_AREAS = [
  { name: 'Tokyo', population: 37.19 },
  { name: 'Osaka', population: 19.01 },
  { name: 'Nagoya', population: 9.57 },
  { name: 'Kitakyushu-Fukuoka', population: 5.49 },
  { name: 'Shizuoka-Hamamatsu', population: 2.94 },
  { name: 'Sapporo', population: 2.67 },
];

// The newest annual publication in each area, linked to its topic page.
export const RELEASES = [
  { title: 'Population Estimates, 1 October 2024', publisher: 'Statistics Bureau of Japan', year: 2024, page: '#/population' },
  { title: 'National Accounts, calendar year 2024', publisher: 'Cabinet Office', year: 2024, page: '#/economy' },
  { title: 'Labour Force Survey, 2024 annual average', publisher: 'Statistics Bureau of Japan', year: 2024, page: '#/work' },
  { title: 'Consumer Price Index, 2024 annual average', publisher: 'Statistics Bureau of Japan', year: 2024, page: '#/prices' },
  { title: 'Vital Statistics, 2024', publisher: 'Ministry of Health, Labour and Welfare', year: 2024, page: '#/population' },
  { title: 'Visitor Arrivals, 2024', publisher: 'Japan National Tourism Organization', year: 2024, page: '#/society' },
];

// The A–Z index: every headline indicator, linked to the page that explains it.
export const INDICATORS = [
  { name: 'Age structure', value: '29.8% aged 65+', year: 2024, source: 'World Bank', page: '#/population' },
  { name: 'Birth rate', value: '5.7 per 1,000', year: 2024, source: 'World Bank', page: '#/population' },
  { name: 'Consumer price inflation', value: '+2.7%', year: 2024, source: 'World Bank', page: '#/prices' },
  { name: 'Death rate', value: '13.3 per 1,000', year: 2024, source: 'World Bank', page: '#/population' },
  { name: 'Employment rate', value: '61.7%', year: 2024, source: 'World Bank', page: '#/work' },
  { name: 'Exports of goods', value: '$707.4bn', year: 2024, source: 'World Bank', page: '#/economy' },
  { name: 'Fertility rate', value: '1.15', year: 2024, source: 'World Bank / MHLW', page: '#/population' },
  { name: 'GDP', value: '$4.19tn', year: 2024, source: 'World Bank', page: '#/economy' },
  { name: 'GDP per person', value: '$33,797', year: 2024, source: 'World Bank', page: '#/economy' },
  { name: 'Government debt', value: '236.7% of GDP', year: 2024, source: 'IMF', page: '#/economy' },
  { name: 'Hospital beds', value: '12.6 per 1,000', year: 2022, source: 'OECD', page: '#/society' },
  { name: 'Human Development Index', value: '0.925', year: 2023, source: 'UNDP', page: '#/society' },
  { name: 'Imports of goods', value: '$742.7bn', year: 2024, source: 'World Bank', page: '#/economy' },
  { name: 'Infant mortality', value: '1.9 per 1,000', year: 2024, source: 'World Bank', page: '#/population' },
  { name: 'Internet users', value: '85.5%', year: 2024, source: 'World Bank', page: '#/society' },
  { name: 'Labour force', value: '69.3m', year: 2024, source: 'World Bank', page: '#/work' },
  { name: 'Life expectancy', value: '84.0 years', year: 2024, source: 'World Bank', page: '#/society' },
  { name: 'Median age', value: '49.9 years', year: 2024, source: 'CIA World Factbook', page: '#/society' },
  { name: 'Minimum wage', value: '¥1,055 per hour', year: 2024, source: 'MHLW', page: '#/work' },
  { name: 'Nikkei 225', value: '39,895', year: 2024, source: 'JPX', page: '#/economy' },
  { name: 'Population', value: '123.98m', year: 2024, source: 'World Bank', page: '#/population' },
  { name: 'Population density', value: '342 per km²', year: 2024, source: 'World Bank', page: '#/society' },
  { name: 'Real GDP growth', value: '−0.2%', year: 2024, source: 'World Bank', page: '#/economy' },
  { name: 'Tertiary education', value: '65% of ages 25–34', year: 2023, source: 'OECD', page: '#/society' },
  { name: 'Unemployment rate', value: '2.5%', year: 2024, source: 'ILO / World Bank', page: '#/work' },
  { name: 'Urban population', value: '92.2%', year: 2024, source: 'World Bank', page: '#/society' },
  { name: 'Visitors from abroad', value: '36.87m', year: 2024, source: 'JNTO', page: '#/society' },
  { name: 'Youth unemployment', value: '3.9%', year: 2024, source: 'World Bank', page: '#/work' },
];
