// Hand-drawn SVG charts for the VSO site. No library: each function takes
// plain data and returns an SVG string sized by its viewBox.

const TEAL = "#0b5563";
const AMBER = "#d97706";
const GRID = "#e3ddd0";
const INK = "#14202b";
const MUTED = "#5b6b7a";

function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}

export function lineChart({ labels, series, yLabel = "", height = 240, fmtY = (v) => String(v) }) {
  const W = 640, H = height, L = 56, R = 14, T = 16, B = 30;
  const all = series.flatMap((s) => s.data);
  let min = Math.min(...all), max = Math.max(...all);
  const pad = (max - min) * 0.12 || 1;
  min = Math.floor(min - pad); max = niceMax(max + pad);
  if (min > 0 && min / max > 0.5) min = Math.floor(max * 0.5);
  const x = (i) => L + (i / (labels.length - 1)) * (W - L - R);
  const y = (v) => T + (1 - (v - min) / (max - min)) * (H - T - B);
  let g = "";
  for (let t = 0; t <= 4; t++) {
    const v = min + ((max - min) * t) / 4, yy = y(v);
    g += `<line x1="${L}" y1="${yy}" x2="${W - R}" y2="${yy}" stroke="${GRID}"/><text x="${L - 8}" y="${yy + 4}" font-size="11" fill="${MUTED}" text-anchor="end">${fmtY(v)}</text>`;
  }
  labels.forEach((lab, i) => {
    if (i % 2 === 0 || labels.length <= 8) g += `<text x="${x(i)}" y="${H - 8}" font-size="11" fill="${MUTED}" text-anchor="middle">${lab}</text>`;
  });
  let paths = "";
  series.forEach((s) => {
    const pts = s.data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    paths += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const last = s.data[s.data.length - 1];
    paths += `<circle cx="${x(s.data.length - 1)}" cy="${y(last)}" r="4" fill="${s.color}"/><text x="${x(s.data.length - 1) - 4}" y="${y(last) - 10}" font-size="12" font-weight="bold" fill="${INK}" text-anchor="end">${fmtY(last)}</text>`;
  });
  const title = yLabel ? `<text x="${L}" y="12" font-size="11" fill="${MUTED}">${yLabel}</text>` : "";
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Line chart">${title}${g}${paths}</svg>`;
}

export function barChart({ items, height = 260, fmtV = (v) => String(v) }) {
  const W = 640, H = height, L = 56, R = 14, T = 14, B = 52;
  const max = niceMax(Math.max(...items.map((d) => d.value)));
  const bw = (W - L - R) / items.length;
  const y = (v) => T + (1 - v / max) * (H - T - B);
  let g = "";
  for (let t = 0; t <= 4; t++) {
    const v = (max * t) / 4, yy = y(v);
    g += `<line x1="${L}" y1="${yy}" x2="${W - R}" y2="${yy}" stroke="${GRID}"/><text x="${L - 8}" y="${yy + 4}" font-size="11" fill="${MUTED}" text-anchor="end">${fmtV(v)}</text>`;
  }
  let bars = "";
  items.forEach((d, i) => {
    const bx = L + i * bw + bw * 0.18, bwid = bw * 0.64, by = y(d.value);
    bars += `<rect x="${bx}" y="${by}" width="${bwid}" height="${H - B - by}" rx="4" fill="${d.color || TEAL}"/>`;
    bars += `<text x="${bx + bwid / 2}" y="${by - 6}" font-size="11" font-weight="bold" fill="${INK}" text-anchor="middle">${fmtV(d.value)}</text>`;
    const words = d.label.split(" ");
    const mid = Math.ceil(words.length / 2);
    const l1 = words.slice(0, mid).join(" "), l2 = words.slice(mid).join(" ");
    bars += `<text x="${bx + bwid / 2}" y="${H - B + 16}" font-size="11" fill="${MUTED}" text-anchor="middle">${l1}</text>`;
    if (l2) bars += `<text x="${bx + bwid / 2}" y="${H - B + 30}" font-size="11" fill="${MUTED}" text-anchor="middle">${l2}</text>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart">${g}${bars}</svg>`;
}

export function donutChart({ slices, centerLabel, centerValue }) {
  const colors = [TEAL, AMBER, "#2563eb", "#16794c", "#7c3aed", "#b42318", "#8a94a6"];
  const total = slices.reduce((a, s) => a + s.value, 0);
  const cx = 150, cy = 140, r = 104, rIn = 62;
  let a0 = -Math.PI / 2, paths = "";
  slices.forEach((s, i) => {
    const a1 = a0 + (s.value / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (a, rad) => `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
    paths += `<path d="M${p(a0, r)} A${r},${r} 0 ${large} 1 ${p(a1, r)} L${p(a1, rIn)} A${rIn},${rIn} 0 ${large} 0 ${p(a0, rIn)} Z" fill="${colors[i % colors.length]}"/>`;
    a0 = a1;
  });
  let legend = "";
  slices.forEach((s, i) => {
    legend += `<div><span class="dot" style="background:${colors[i % colors.length]}"></span>${s.name} — <strong>${s.value.toFixed(1)}%</strong></div>`;
  });
  return `<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:center"><svg viewBox="0 0 300 280" style="width:280px;max-width:100%" role="img" aria-label="Donut chart">${paths}<text x="${cx}" y="${cy - 4}" font-size="22" font-weight="bold" fill="${INK}" text-anchor="middle">${centerValue}</text><text x="${cx}" y="${cy + 18}" font-size="12" fill="${MUTED}" text-anchor="middle">${centerLabel}</text></svg><div class="legend" style="flex-direction:column;gap:7px;margin:0">${legend}</div></div>`;
}

export function populationPyramid({ bands, men, women }) {
  const W = 640, rowH = 20, H = bands.length * rowH + 34, mid = W / 2, half = 240;
  const max = Math.max(...men, ...women);
  let rows = "";
  bands.forEach((b, i) => {
    const y = 10 + i * rowH;
    const mw = (men[i] / max) * half, ww = (women[i] / max) * half;
    rows += `<rect x="${mid - mw}" y="${y + 2}" width="${mw}" height="${rowH - 5}" rx="3" fill="${TEAL}"/>`;
    rows += `<rect x="${mid + 2}" y="${y + 2}" width="${ww}" height="${rowH - 5}" rx="3" fill="${AMBER}"/>`;
    rows += `<text x="${mid - mw - 6}" y="${y + rowH - 6}" font-size="10" fill="${MUTED}" text-anchor="end">${Math.round(men[i] / 1000)}k</text>`;
    rows += `<text x="${mid + ww + 8}" y="${y + rowH - 6}" font-size="10" fill="${MUTED}">${Math.round(women[i] / 1000)}k</text>`;
    rows += `<text x="${mid}" y="${y + rowH - 6}" font-size="10" fill="${INK}" text-anchor="middle" font-weight="bold">${b}</text>`;
  });
  const foot = `<text x="${mid - half}" y="${H - 6}" font-size="12" fill="${TEAL}" font-weight="bold">Men</text><text x="${mid + half}" y="${H - 6}" font-size="12" fill="${AMBER}" font-weight="bold" text-anchor="end">Women</text>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Population pyramid">${rows}${foot}</svg>`;
}

export function regionMap({ regions, selectedId }) {
  // Stylised tile map of Velmar's six regions; tile size follows population.
  const tiles = {
    north: { x: 190, y: 18, w: 210, h: 92 },
    west: { x: 58, y: 118, w: 128, h: 118 },
    capital: { x: 194, y: 118, w: 150, h: 118 },
    east: { x: 352, y: 118, w: 168, h: 118 },
    south: { x: 150, y: 244, w: 270, h: 78 },
    islands: { x: 446, y: 244, w: 120, h: 78 },
  };
  let cells = "";
  regions.forEach((r) => {
    const t = tiles[r.id];
    const on = r.id === selectedId;
    cells += `<g class="map-tile" data-region="${r.id}" style="cursor:pointer"><rect x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" rx="12" fill="${on ? AMBER : TEAL}" opacity="${on ? 1 : 0.82}"/><text x="${t.x + t.w / 2}" y="${t.y + t.h / 2 - 6}" font-size="15" font-weight="bold" fill="#fff" text-anchor="middle">${r.name}</text><text x="${t.x + t.w / 2}" y="${t.y + t.h / 2 + 16}" font-size="13" fill="#eaf6f8" text-anchor="middle">${(r.pop / 1000000).toFixed(2)} m people</text></g>`;
  });
  return `<svg class="chart" viewBox="0 0 600 340" role="img" aria-label="Map of Velmar regions">${cells}<text x="300" y="336" font-size="11" fill="${MUTED}" text-anchor="middle">Tile map — tiles are not to geographic scale. Click a region to inspect it.</text></svg>`;
}
