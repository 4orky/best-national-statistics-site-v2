// Formatting helpers for Japan in Numbers.
//
// One rule for the whole site: the same number is written the same way on
// every page. These are the only places a number or a piece of text gets
// reshaped before it reaches the page.

export function fmtMillions(value) {
  return `${value.toFixed(2)}m`;
}

export function fmtTrillions(value) {
  return `$${value.toFixed(2)}tn`;
}

export function fmtMoney(value) {
  return `$${value.toLocaleString('en-US')}`;
}

// A signed change: +2.7, −0.2, 0.0. Uses the proper minus sign, never a
// hyphen, so a fall does not read as a typo.
export function fmtSigned(value, decimals = 1) {
  if (value > 0) return `+${value.toFixed(decimals)}`;
  if (value < 0) return `−${Math.abs(value).toFixed(decimals)}`;
  return value.toFixed(decimals);
}

// A percentage with its sign, e.g. "+2.7%" or "−0.4%".
export function fmtPct(value, decimals = 1) {
  return `${fmtSigned(value, decimals)}%`;
}

// A year span, e.g. "2015–2024".
export function fmtYearRange(first, last) {
  return `${first}–${last}`;
}

// Escape text that came from data before it goes into HTML.
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

// The small grey line under a chart or table naming where it came from.
export function sourceLine(source, year) {
  return `<p class="source">Source: ${escapeHtml(source)}, ${year}.</p>`;
}
