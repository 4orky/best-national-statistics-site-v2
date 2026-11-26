// Hand-drawn SVG charts for Japan in Numbers.
//
// No chart library: each function takes a series and returns an SVG
// string — axes, gridlines, labels and all. Charts read only the series
// they are handed; they never touch the data files, and they fetch
// nothing. A chart that looks flat is a bug, not a style: see fitAxis,
// which zooms a slowly-moving series (a population sliding from 128m to
// 124m) onto the range it actually moves in, instead of pinning it to
// zero and drawing a straight line.

const INK = '#1c2b4a';
const RED = '#c1272d';
const GRID = '#e3ddd2';
const MUTED = '#6b7280';
const AREA = '#1c2b4a14';

// Round a magnitude up to a tidy number for an axis top.
function roundUp(values) {
  const biggest = Math.max(...values.map((v) => Math.abs(v)));
  const power = 10 ** Math.floor(Math.log10(biggest || 1));
  return Math.ceil(biggest / power) * power;
}

// Mirror of roundUp for the bottom of an axis that goes below zero.
function roundDown(values) {
  const smallest = Math.min(...values);
  if (smallest >= 0) return 0;
  const power = 10 ** Math.floor(Math.log10(Math.abs(smallest) || 1));
  return -Math.ceil(Math.abs(smallest) / power) * power;
}

// Pick the axis range for a series. When every value is positive and the
// whole range is small beside the level itself, zoom in: pad the range by
// a tenth on each side and snap the ends to round numbers, so the shape
// of the change is visible. Otherwise use a zero baseline.
function fitAxis(values) {
  const low = Math.min(...values);
  const high = Math.max(...values);
  const range = high - low;
  if (low <= 0 || range >= 0.25 * high || range === 0) return [roundDown(values), roundUp(values)];
  const step = 10 ** Math.floor(Math.log10(range));
  return [
    Math.floor((low - range * 0.1) / step) * step,
    Math.ceil((high + range * 0.1) / step) * step,
  ];
}

function fmtNum(v, decimals) {
  return Number(v.toFixed(decimals)).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// The horizontal gridlines + axis labels shared by the line and bar charts.
function axisGrid({ width, height, padL, padR, padT, padB, bottom, top, decimals, unit, signed }) {
  const span = top - bottom || 1;
  const y = (v) => padT + ((top - v) / span) * (height - padT - padB);
  const label = (v) => (signed && v > 0 ? '+' : '') + fmtNum(v, decimals) + unit;
  let out = '';
  for (let s = 0; s <= 4; s += 1) {
    const v = bottom + ((top - bottom) * s) / 4;
    const gy = y(v);
    out += `<line x1="${padL}" y1="${gy}" x2="${width - padR}" y2="${gy}" stroke="${GRID}" stroke-width="1"/>`
      + `<text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="12" fill="${MUTED}">${label(v)}</text>`;
  }
  if (bottom < 0) {
    out += `<line x1="${padL}" y1="${y(0)}" x2="${width - padR}" y2="${y(0)}" stroke="${INK}" stroke-width="1"/>`;
  }
  return { grid: out, y };
}

// Line chart. series: [{year, value}].
// options: {unit, decimals, height, shade} — shade fills the area under
// the line, on by default, so the level is readable at a glance.
export function lineChart(series, options = {}) {
  const { unit = '', decimals = 1, height = 260, shade = true } = options;
  const width = 760;
  const padL = 56;
  const padR = 64;
  const padT = 18;
  const padB = 34;
  const values = series.map((p) => p.value);
  const [bottom, top] = fitAxis(values);
  const span = top - bottom || 1;
  const x = (i) => padL + (i * (width - padL - padR)) / (series.length - 1);
  const { grid, y } = axisGrid({ width, height, padL, padR, padT, padB, bottom, top, decimals, unit, signed: false });
  const fmt = (v) => fmtNum(v, decimals) + unit;

  const points = series.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const last = series[series.length - 1];
  const area = shade
    ? `<polygon points="${padL},${y(bottom).toFixed(1)} ${points} ${x(series.length - 1).toFixed(1)},${y(bottom).toFixed(1)}" fill="${AREA}"/>`
    : '';
  const yearLabels = series
    .filter((p, i) => i % Math.ceil(series.length / 6) === 0 || i === series.length - 1)
    .map((p) => {
      const idx = series.indexOf(p);
      return `<text x="${x(idx)}" y="${height - 10}" text-anchor="middle" font-size="12" fill="${MUTED}">${p.year}</text>`;
    })
    .join('');
  const dots = series.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.value)}" r="${i === series.length - 1 ? 5 : 3}" fill="${i === series.length - 1 ? RED : INK}"><title>${p.year}: ${fmt(p.value)}</title></circle>`).join('');

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Line chart, ${series[0].year} to ${last.year}" preserveAspectRatio="xMidYMid meet">
<title>Line chart ${series[0].year}–${last.year}</title>${grid}${area}
<polyline points="${points}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
${dots}
<text x="${x(series.length - 1) + 8}" y="${y(last.value) + 4}" font-size="13" font-weight="700" fill="${RED}">${fmt(last.value)}</text>
${yearLabels}</svg>`;
}

// Bar chart. series: [{year, value}]. Negative values hang below the zero
// line. options: {unit, decimals, height, signed} — signed puts a + in
// front of positive values, for change series (growth, inflation) and
// never for levels, where a + would read as a change.
export function barChart(series, options = {}) {
  const { unit = '', decimals = 1, height = 260, signed = false } = options;
  const width = 760;
  const padL = 56;
  const padR = 16;
  const padT = 18;
  const padB = 34;
  const values = series.map((p) => p.value);
  const top = roundUp(values);
  const bottom = roundDown(values);
  const { grid, y } = axisGrid({ width, height, padL, padR, padT, padB, bottom, top, decimals, unit, signed });
  const fmt = (v) => (signed && v > 0 ? '+' : '') + fmtNum(v, decimals) + unit;
  const slot = (width - padL - padR) / series.length;
  const barW = Math.min(64, slot * 0.62);
  const zero = y(0);

  const bars = series
    .map((p, i) => {
      const cx = padL + slot * i + slot / 2;
      const by = y(p.value);
      const rectY = Math.min(zero, by);
      const rectH = Math.max(2, Math.abs(zero - by));
      const isLast = i === series.length - 1;
      return `<rect x="${(cx - barW / 2).toFixed(1)}" y="${rectY.toFixed(1)}" width="${barW}" height="${rectH.toFixed(1)}" rx="3" fill="${isLast ? RED : INK}"><title>${p.year}: ${fmt(p.value)}</title></rect>`
        + `<text x="${cx}" y="${(p.value >= 0 ? by - 6 : by + rectH + 14).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${fmt(p.value)}</text>`
        + `<text x="${cx}" y="${height - 10}" text-anchor="middle" font-size="12" fill="${MUTED}">${p.year}</text>`;
    })
    .join('');

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart, ${series[0].year} to ${series[series.length - 1].year}" preserveAspectRatio="xMidYMid meet">
<title>Bar chart ${series[0].year}–${series[series.length - 1].year}</title>${grid}${bars}</svg>`;
}

// Horizontal bars for shares of a whole, e.g. the age structure. The
// longest bar sets the scale; the last row gets the accent colour.
export function shareBars(rows, options = {}) {
  const { unit = '%', height = 170 } = options;
  const width = 760;
  const padL = 190;
  const padR = 70;
  const rowH = height / rows.length;
  const max = Math.max(...rows.map((r) => r.value));
  const bars = rows
    .map((r, i) => {
      const top = i * rowH + rowH * 0.22;
      const h = rowH * 0.56;
      const w = ((width - padL - padR) * r.value) / max;
      return `<text x="${padL - 12}" y="${top + h / 2 + 4}" text-anchor="end" font-size="13" fill="${INK}">${r.group}</text>`
        + `<rect x="${padL}" y="${top}" width="${w.toFixed(1)}" height="${h}" rx="3" fill="${i === rows.length - 1 ? RED : INK}"><title>${r.group}: ${r.value}${unit}</title></rect>`
        + `<text x="${padL + w + 8}" y="${top + h / 2 + 4}" font-size="13" font-weight="700" fill="${INK}">${r.value}${unit}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Shares of population by age group" preserveAspectRatio="xMidYMid meet"><title>Age structure</title>${bars}</svg>`;
}
