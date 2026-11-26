// Page renderers for the VSO site. Each returns HTML for <main>; main.js
// wires the controls (data-action attributes) after every render.

import * as D from "./data.js";
import { lineChart, barChart, donutChart, populationPyramid, regionMap } from "./charts.js";

const TEAL = "#0b5563", AMBER = "#d97706", BLUE = "#2563eb", GREEN = "#16794c";

function deltaHtml(series, i, invert = false, suffix = "") {
  const d = D.pctChange(series, i);
  const good = invert ? d < 0 : d > 0;
  const cls = Math.abs(d) < 0.05 ? "flat" : good ? "up" : "down";
  const arrow = d > 0.05 ? "▲" : d < -0.05 ? "▼" : "▬";
  return `<span class="delta ${cls}">${arrow} ${d >= 0 ? "+" : ""}${d.toFixed(1)}%${suffix} vs ${D.YEARS[i - 1]}</span>`;
}

function kpi(label, value, delta, src, amber = false) {
  return `<article class="kpi${amber ? " amber" : ""}"><div class="label">${label}</div><div class="value">${value}</div>${delta}<div class="src">${src}</div></article>`;
}

function srcLine(text) {
  return `<p class="src-line">Source: ${text}</p>`;
}

export function homeView(state) {
  const i = state.yearIdx, year = D.YEARS[i];
  const yearOpts = D.YEARS.map((y, j) => `<option value="${j}"${j === i ? " selected" : ""}>${y}</option>`).join("");
  const releases = D.RELEASES.map((r) => `<li><span><a href="#/data">${r.title}</a><br><small>${r.code}</small></span><time>${r.date}</time></li>`).join("");
  return `
  <section class="hero">
    <div class="hero-card">
      <span class="tag">REPUBLIC OF VELMAR · EST. 1962</span>
      <h1>The country in numbers, from the office that counts it.</h1>
      <p>Population, economy, health, education and regions — every figure published with its source survey and year, free to reuse under the VSO open licence.</p>
      <div class="hero-actions">
        <a class="btn" href="#/population">Explore population</a>
        <a class="btn ghost" href="#/data">Download data tables</a>
      </div>
    </div>
    <aside class="release"><h2>Coming releases</h2><ul>${releases}</ul>${srcLine("VSO release calendar, November 2025")}</aside>
  </section>
  <div class="controls"><label for="year-select">Headline figures for</label><select id="year-select" data-action="year">${yearOpts}</select><span>Change the year — every card and chart below follows.</span></div>
  <section class="kpis" aria-label="Headline indicators ${year}">
    ${kpi("Population, 1 Jan", D.fmt(D.POPULATION[i]), deltaHtml(D.POPULATION, i), `Population Register, ${year}`)}
    ${kpi("GDP", `VKC ${D.GDP_BN[i].toFixed(1)} bn`, deltaHtml(D.GDP_BN, i), `National Accounts, ${year}`, true)}
    ${kpi("Unemployment", `${D.UNEMPLOYMENT[i].toFixed(1)}%`, deltaHtml(D.UNEMPLOYMENT, i, true), `Labour Force Survey, ${year}`)}
    ${kpi("Life expectancy", `${D.LIFE_EXP[i].toFixed(1)} yrs`, deltaHtml(D.LIFE_EXP, i), `Mortality Tables, ${year}`, true)}
  </section>
  <section class="grid2">
    <article class="card"><h2>Population is still growing — slowly</h2><p class="sub">Total population, 2015–2025. Growth now comes mostly from migration: births exceeded deaths by 7,280 in 2025, net migration added 6,420.</p>
    ${lineChart({ labels: D.YEARS.map(String), series: [{ data: D.POPULATION.map((v) => v / 1e6), color: TEAL }], yLabel: "millions", fmtY: (v) => v.toFixed(2) })}
    ${srcLine("Population Register, 1 January each year")}<p><a href="#/population">Full population section →</a></p></article>
    <article class="card"><h2>Inflation has settled near 2%</h2><p class="sub">Consumer price inflation spiked to 7.9% in 2022 and has eased every year since; the 2025 average is 2.4%.</p>
    ${lineChart({ labels: D.YEARS.map(String), series: [{ data: D.INFLATION, color: AMBER }], yLabel: "% per year", fmtY: (v) => v.toFixed(1) })}
    ${srcLine("Consumer Price Index, annual average")}<p><a href="#/economy">Full economy section →</a></p></article>
  </section>
  <section class="grid3">
    <article class="card"><h3>Health</h3><p class="sub">Life expectancy reached 81.8 years in 2025; infant mortality fell to 3.0 per 1,000 births.</p><a href="#/health">Health indicators →</a></article>
    <article class="card"><h3>Education</h3><p class="sub">99.2% adult literacy; 98,400 university students, with business &amp; law the largest field.</p><a href="#/education">Education indicators →</a></article>
    <article class="card"><h3>Regions</h3><p class="sub">The Capital District holds 27% of the population and the highest GDP per capita, VKC 41,200.</p><a href="#/regions">Compare regions →</a></article>
  </section>`;
}

export function populationView(state) {
  const i = state.yearIdx, year = D.YEARS[i];
  const yearOpts = D.YEARS.map((y, j) => `<option value="${j}"${j === i ? " selected" : ""}>${y}</option>`).join("");
  const metric = state.popMetric;
  const seriesMap = {
    births: { data: D.BIRTHS, color: TEAL, label: "Births" },
    deaths: { data: D.DEATHS, color: AMBER, label: "Deaths" },
    migration: { data: D.NET_MIGRATION, color: BLUE, label: "Net migration" },
  };
  const seg = Object.entries(seriesMap).map(([k, v]) => `<button type="button" data-action="pop-metric" data-value="${k}" class="${metric === k ? "on" : ""}">${v.label}</button>`).join("");
  const natural = D.BIRTHS[i] - D.DEATHS[i];
  return `
  <div class="page-head"><p class="crumbs"><a href="#/">Overview</a> / Population</p><h1>Population</h1><p>How many people live in Velmar, how the total changes, and how the population is structured by age and sex.</p></div>
  <div class="controls"><label for="year-select">Year</label><select id="year-select" data-action="year">${yearOpts}</select></div>
  <section class="kpis">
    ${kpi("Population, 1 Jan " + year, D.fmt(D.POPULATION[i]), deltaHtml(D.POPULATION, i), "Population Register")}
    ${kpi("Births " + year, D.fmt(D.BIRTHS[i]), deltaHtml(D.BIRTHS, i), "Vital Statistics", true)}
    ${kpi("Deaths " + year, D.fmt(D.DEATHS[i]), deltaHtml(D.DEATHS, i, true), "Vital Statistics")}
    ${kpi("Net migration " + year, "+" + D.fmt(D.NET_MIGRATION[i]), deltaHtml(D.NET_MIGRATION, i), "Migration Statistics", true)}
  </section>
  <section class="grid2">
    <article class="card"><h2>Components of change</h2><p class="sub">Pick a component. In ${year}: natural change ${natural >= 0 ? "+" : ""}${D.fmt(natural)} plus net migration +${D.fmt(D.NET_MIGRATION[i])}.</p>
    <div class="controls"><div class="seg" role="group" aria-label="Component">${seg}</div></div>
    ${lineChart({ labels: D.YEARS.map(String), series: [{ data: seriesMap[metric].data, color: seriesMap[metric].color }], yLabel: "persons per year", fmtY: (v) => D.fmt(Math.round(v)) })}
    ${srcLine("Vital Statistics & Migration Statistics, 2015–2025")}</article>
    <article class="card"><h2>Key findings</h2><ul class="findings">
      <li>Median age is <strong>41.2 years</strong> (2025), up from 38.9 in 2015 — the population is ageing steadily.</li>
      <li>Women outnumber men from age 45 upward; at 80+ there are <strong>98,400 women to 58,900 men</strong>.</li>
      <li>Density averages <strong>98 people per km²</strong>, but ranges from 2,140 in the Capital District to 38 in the Northern Highlands.</li>
      <li>Dependency ratio: <strong>52 dependants per 100</strong> working-age residents (2025).</li></ul>
    ${srcLine("Population Register & Census 2021, updated 2025")}</article>
  </section>
  <article class="card"><h2>Population pyramid, 2025</h2><p class="sub">Five-year age bands. The bulge at 25–39 reflects the birth cohorts of the late 1980s–90s plus working-age migration.</p>
  ${populationPyramid({ bands: D.AGE_BANDS, men: D.AGE_MEN, women: D.AGE_WOMEN })}
  ${srcLine("Population Register, 1 Jan 2025 — total 4,728,100")}</article>`;
}

export function economyView(state) {
  const i = state.yearIdx, year = D.YEARS[i];
  const yearOpts = D.YEARS.map((y, j) => `<option value="${j}"${j === i ? " selected" : ""}>${y}</option>`).join("");
  const sectorBars = D.SECTORS.map((s) => `<div class="bar-row"><span>${s.name}</span><span class="bar-track"><span class="bar-fill" style="width:${(s.pct / 58.4) * 100}%"></span></span><span class="num">${s.pct.toFixed(1)}%</span></div>`).join("");
  const sectorRows = D.SECTORS.map((s) => `<tr><td>${s.name}</td><td class="num">${s.pct.toFixed(1)}%</td><td class="num">${D.fmt(s.jobs)}</td></tr>`).join("");
  return `
  <div class="page-head"><p class="crumbs"><a href="#/">Overview</a> / Economy</p><h1>Economy</h1><p>Output, prices, jobs and pay — the national accounts and labour market in one place.</p></div>
  <div class="controls"><label for="year-select">Year</label><select id="year-select" data-action="year">${yearOpts}</select></div>
  <section class="kpis">
    ${kpi("GDP " + year, `VKC ${D.GDP_BN[i].toFixed(1)} bn`, deltaHtml(D.GDP_BN, i), "National Accounts")}
    ${kpi("Real GDP growth", `${D.GDP_GROWTH[i] >= 0 ? "+" : ""}${D.GDP_GROWTH[i].toFixed(1)}%`, deltaHtml(D.GDP_GROWTH, i), "National Accounts", true)}
    ${kpi("Unemployment", `${D.UNEMPLOYMENT[i].toFixed(1)}%`, deltaHtml(D.UNEMPLOYMENT, i, true), "Labour Force Survey")}
    ${kpi("Median monthly wage", `VKC ${D.fmt(D.MEDIAN_WAGE[i])}`, deltaHtml(D.MEDIAN_WAGE, i), "Earnings Survey", true)}
  </section>
  <section class="grid2">
    <article class="card"><h2>GDP and growth</h2><p class="sub">Output dipped in 2020 (−3.4%) and has grown every year since; 2025 growth is +2.3%.</p>
    ${lineChart({ labels: D.YEARS.map(String), series: [{ data: D.GDP_BN, color: TEAL }], yLabel: "VKC billion, current prices", fmtY: (v) => v.toFixed(0) })}
    ${srcLine("National Accounts, 2015–2025")}</article>
    <article class="card"><h2>Where the economy earns</h2><p class="sub">Value added by sector, share of GDP, 2025. Services produce well over half of all output.</p>
    <div class="bars">${sectorBars}</div>${srcLine("National Accounts, sector accounts 2025")}</article>
  </section>
  <section class="grid2">
    <article class="card"><h2>Unemployment keeps falling</h2><p class="sub">The rate peaked at 7.1% in 2020 and reached a record low of 4.9% in 2025.</p>
    ${lineChart({ labels: D.YEARS.map(String), series: [{ data: D.UNEMPLOYMENT, color: AMBER }], yLabel: "% of labour force", fmtY: (v) => v.toFixed(1) })}
    ${srcLine("Labour Force Survey, annual average")}</article>
    <article class="card"><h2>Sectors in detail</h2><table class="data"><thead><tr><th>Sector</th><th>Share of GDP</th><th>Jobs</th></tr></thead><tbody>${sectorRows}</tbody></table>
    ${srcLine("National Accounts & Business Register, 2025")}</article>
  </section>`;
}

export function healthView(state) {
  const i = state.yearIdx, year = D.YEARS[i];
  const yearOpts = D.YEARS.map((y, j) => `<option value="${j}"${j === i ? " selected" : ""}>${y}</option>`).join("");
  return `
  <div class="page-head"><p class="crumbs"><a href="#/">Overview</a> / Health</p><h1>Health</h1><p>How long people live, what they die of, and the capacity of the health system that serves them.</p></div>
  <div class="controls"><label for="year-select">Year</label><select id="year-select" data-action="year">${yearOpts}</select></div>
  <section class="kpis">
    ${kpi("Life expectancy " + year, `${D.LIFE_EXP[i].toFixed(1)} yrs`, deltaHtml(D.LIFE_EXP, i), "Mortality Tables")}
    ${kpi("Infant mortality", `${D.INFANT_MORTALITY[i].toFixed(1)} / 1,000`, deltaHtml(D.INFANT_MORTALITY, i, true), "Vital Statistics", true)}
    ${kpi("Hospital beds", `${D.HOSPITAL_BEDS[i].toFixed(1)} / 1,000`, deltaHtml(D.HOSPITAL_BEDS, i, true), "Health Facilities Census")}
    ${kpi("Physicians", `${D.DOCTORS_PER_1000[i].toFixed(1)} / 1,000`, deltaHtml(D.DOCTORS_PER_1000, i), "Health Workforce Register", true)}
  </section>
  <section class="grid2">
    <article class="card"><h2>Living longer, almost every year</h2><p class="sub">Life expectancy at birth rose from 79.8 years (2015) to 81.8 (2025), with a single dip in 2020.</p>
    ${lineChart({ labels: D.YEARS.map(String), series: [{ data: D.LIFE_EXP, color: GREEN }], yLabel: "years", fmtY: (v) => v.toFixed(1) })}
    ${srcLine("Mortality Tables, 2015–2025")}</article>
    <article class="card"><h2>What people die of</h2><p class="sub">Share of all deaths by cause, 2025. Circulatory diseases and cancers together account for 61%.</p>
    ${donutChart({ slices: D.CAUSES_OF_DEATH.map((c) => ({ name: c.name, value: c.pct })), centerLabel: "deaths 2025", centerValue: D.fmt(D.DEATHS[10]) })}
    ${srcLine("Cause-of-Death Register, 2025")}</article>
  </section>
  <article class="card"><h2>Key findings</h2><ul class="findings">
    <li>Healthy life expectancy at 65 is <strong>11.4 years</strong> for women and <strong>10.1</strong> for men (2025).</li>
    <li>Physician numbers grew every year since 2015, reaching <strong>3.8 per 1,000</strong> residents; hospital beds per capita eased as day care expanded.</li>
    <li>Infant mortality fell from 4.1 to <strong>3.0 per 1,000 live births</strong> over the decade.</li>
    <li>Regional gap: life expectancy ranges from 80.4 years (Northern Highlands) to 82.6 (Capital District) — see <a href="#/regions">Regions</a>.</li></ul>
  ${srcLine("VSO Health Accounts, 2025")}</article>`;
}

export function educationView(state) {
  const enrolBars = D.ENROLMENT.map((e) => `<div class="bar-row"><span>${e.level}</span><span class="bar-track"><span class="bar-fill amber" style="width:${e.pct}%"></span></span><span class="num">${e.pct.toFixed(1)}%</span></div>`).join("");
  const enrolRows = D.ENROLMENT.map((e) => `<tr><td>${e.level}</td><td class="num">${e.pct.toFixed(1)}%</td><td class="num">${D.fmt(e.pupils)}</td></tr>`).join("");
  return `
  <div class="page-head"><p class="crumbs"><a href="#/">Overview</a> / Education</p><h1>Education</h1><p>Enrolment, attainment and what graduates study — from the first school year to university degrees.</p></div>
  <section class="kpis">
    ${kpi("Adult literacy", `${D.LITERACY.toFixed(1)}%`, `<span class="delta flat">ages 15+, 2025</span>`, "Education Census")}
    ${kpi("Primary enrolment", "98.7%", `<span class="delta up">▲ +0.4 pts vs 2024</span>`, "School Census", true)}
    ${kpi("University students", D.fmt(98400), `<span class="delta up">▲ +2.1% vs 2024</span>`, "Higher Education Register")}
    ${kpi("Graduates 2025", D.fmt(D.GRADUATES_BY_FIELD.reduce((a, g) => a + g.n, 0)), `<span class="delta up">▲ +1.6% vs 2024</span>`, "Higher Education Register", true)}
  </section>
  <section class="grid2">
    <article class="card"><h2>Almost every child is in school</h2><p class="sub">Net enrolment by level, 2025. Upper-secondary participation is 92.4%; tertiary entry keeps rising.</p>
    <div class="bars">${enrolBars}</div>${srcLine("School Census & Higher Education Register, 2025")}</article>
    <article class="card"><h2>What graduates studied</h2><p class="sub">Degrees awarded by field, 2025. Business &amp; law leads, health &amp; welfare is second.</p>
    ${barChart({ items: D.GRADUATES_BY_FIELD.map((g) => ({ label: g.name.replace(" & ", " "), value: g.n })), fmtV: (v) => D.fmt(Math.round(v)) })}
    ${srcLine("Higher Education Register, academic year 2024/25")}</article>
  </section>
  <article class="card"><h2>Enrolment in detail</h2><table class="data"><thead><tr><th>Level</th><th>Net enrolment</th><th>Pupils / students</th></tr></thead><tbody>${enrolRows}</tbody></table>
  ${srcLine("School Census, 1 Oct 2025")}</article>`;
}

export function regionsView(state) {
  const sel = D.REGIONS.find((r) => r.id === state.regionId) || D.REGIONS[0];
  const sorted = [...D.REGIONS].sort((a, b) => b[state.regionSort] - a[state.regionSort]);
  const rows = sorted.map((r) => `<tr${r.id === sel.id ? ' style="background:#fef3c7"' : ""}><td><a href="#/regions" data-action="region" data-value="${r.id}">${r.name}</a></td><td class="num">${D.fmt(r.pop)}</td><td class="num">VKC ${D.fmt(r.gdpPerCap)}</td><td class="num">${r.unemployment.toFixed(1)}%</td><td class="num">${r.lifeExp.toFixed(1)}</td><td class="num">${D.fmt(r.density)}</td><td class="num">+${r.growth.toFixed(1)}%</td></tr>`).join("");
  const sortBtn = (key, label) => `<button type="button" data-action="region-sort" data-value="${key}" class="${state.regionSort === key ? "on" : ""}">${label}</button>`;
  const cards = D.REGIONS.map((r) => `<button type="button" class="card region-card" data-action="region" data-value="${r.id}"><span class="tag teal">${r.id === sel.id ? "SELECTED" : "REGION"}</span><div class="big">${r.name}</div><div>Population <strong>${D.fmt(r.pop)}</strong> · GDP per capita <strong>VKC ${D.fmt(r.gdpPerCap)}</strong><br>Unemployment ${r.unemployment.toFixed(1)}% · Life expectancy ${r.lifeExp.toFixed(1)} yrs</div></button>`).join("");
  return `
  <div class="page-head"><p class="crumbs"><a href="#/">Overview</a> / Regions</p><h1>Regions</h1><p>Six regions, one country. Click a tile, card or table row to inspect a region; use the sort control to rank the table.</p></div>
  <section class="grid2">
    <div class="mapbox">${regionMap({ regions: D.REGIONS, selectedId: sel.id })}</div>
    <article class="card"><span class="tag">REGION PROFILE</span><h2>${sel.name}</h2><p class="sub">Regional accounts release, 2025.</p>
    <table class="data"><tbody>
    <tr><td>Population</td><td class="num"><strong>${D.fmt(sel.pop)}</strong> (${((sel.pop / D.POPULATION[10]) * 100).toFixed(1)}% of Velmar)</td></tr>
    <tr><td>GDP per capita</td><td class="num">VKC ${D.fmt(sel.gdpPerCap)}</td></tr>
    <tr><td>Unemployment</td><td class="num">${sel.unemployment.toFixed(1)}%</td></tr>
    <tr><td>Life expectancy</td><td class="num">${sel.lifeExp.toFixed(1)} years</td></tr>
    <tr><td>Density</td><td class="num">${D.fmt(sel.density)} / km²</td></tr>
    <tr><td>Population growth</td><td class="num">+${sel.growth.toFixed(1)}% / yr</td></tr>
    </tbody></table>${srcLine("Regional Accounts, 2025")}</article>
  </section>
  <div class="controls"><span><strong>Rank regions by</strong></span><div class="seg">${sortBtn("pop", "Population")}${sortBtn("gdpPerCap", "GDP per capita")}${sortBtn("lifeExp", "Life expectancy")}</div></div>
  <article class="card"><h2>All regions compared</h2><div style="overflow-x:auto"><table class="data"><thead><tr><th>Region</th><th>Population</th><th>GDP / capita</th><th>Unemployment</th><th>Life exp.</th><th>Density</th><th>Growth</th></tr></thead><tbody>${rows}</tbody></table></div>
  ${srcLine("Regional Accounts, 2025")}</article>
  <section class="region-cards" style="margin-top:16px">${cards}</section>`;
}

export function dataView(state) {
  const q = state.tableFilter.toLowerCase();
  const rows = D.CATALOGUE.filter((c) => !q || c.name.toLowerCase().includes(q) || c.source.toLowerCase().includes(q) || c.page.includes(q));
  const body = rows.map((c) => `<tr><td><a href="#/${c.page}">${c.name}</a></td><td class="num">${c.value}</td><td class="num">${c.year}</td><td>${c.source}</td></tr>`).join("");
  const table = rows.length
    ? `<table class="data"><thead><tr><th>Indicator</th><th>Latest value</th><th>Year</th><th>Source survey</th></tr></thead><tbody>${body}</tbody></table>`
    : `<p class="empty-note">No indicators match “${state.tableFilter}”. Try “population”, “GDP” or clear the filter.</p>`;
  return `
  <div class="page-head"><p class="crumbs"><a href="#/">Overview</a> / Data tables</p><h1>Data tables</h1><p>The indicator catalogue: filter it, open the section behind any figure, or download the full time series as CSV.</p></div>
  <article class="card"><div class="controls"><label for="table-filter">Filter indicators</label><input id="table-filter" type="text" data-action="table-filter" placeholder="e.g. unemployment" value="${state.tableFilter.replace(/"/g, "&quot;")}"><button type="button" class="btn dark" data-action="download-csv">Download time series (CSV)</button><span>${rows.length} of ${D.CATALOGUE.length} indicators</span></div>
  ${table}${srcLine("VSO indicator catalogue, November 2025")}</article>
  <article class="card"><h2>Time series at a glance, 2015–2025</h2><div style="overflow-x:auto"><table class="data"><thead><tr><th>Year</th><th>Population</th><th>GDP (bn)</th><th>Inflation %</th><th>Unemployment %</th><th>Life exp.</th></tr></thead><tbody>
  ${D.YEARS.map((y, j) => `<tr><td>${y}</td><td class="num">${D.fmt(D.POPULATION[j])}</td><td class="num">${D.GDP_BN[j].toFixed(1)}</td><td class="num">${D.INFLATION[j].toFixed(1)}</td><td class="num">${D.UNEMPLOYMENT[j].toFixed(1)}</td><td class="num">${D.LIFE_EXP[j].toFixed(1)}</td></tr>`).join("")}
  </tbody></table></div>${srcLine("Population Register; National Accounts; CPI; Labour Force Survey; Mortality Tables")}</article>`;
}

export function searchView(state) {
  const q = state.query.toLowerCase();
  const hits = D.CATALOGUE.filter((c) => c.name.toLowerCase().includes(q) || c.source.toLowerCase().includes(q));
  const items = hits.map((c) => `<li><a href="#/${c.page}"><strong>${c.name}</strong></a> — ${c.value} (${c.year}) · ${c.source}</li>`).join("");
  return `
  <div class="page-head"><p class="crumbs"><a href="#/">Overview</a> / Search</p><h1>Search results</h1><p>${hits.length} indicator${hits.length === 1 ? "" : "s"} matching “${state.query}”.</p></div>
  <article class="card">${hits.length ? `<ul class="findings">${items}</ul>` : `<p class="empty-note">Nothing matches “${state.query}”. Try a shorter word such as “population”, “wage” or “health”, or browse the <a href="#/data">data tables</a>.</p>`}
  <p style="margin-top:14px"><a href="#/data">Open the full indicator catalogue →</a></p></article>`;
}

export function aboutView() {
  return `
  <div class="page-head"><p class="crumbs"><a href="#/">Overview</a> / About &amp; methods</p><h1>About &amp; methods</h1><p>Who publishes these statistics, how they are compiled, and how to reuse them.</p></div>
  <section class="grid2">
    <article class="card"><h2>The office</h2><p>The Velmar Statistics Office (VSO) is the national statistical institute of the Republic of Velmar (capital: Port Velmar; land area 48,210 km²; currency: velmar crown, VKC). It publishes roughly 120 releases a year under the Statistics Act, independently of government.</p>
    <p><strong>Demonstration dataset:</strong> the figures on this site are the VSO demonstration dataset for Velmar, compiled for illustration. Every chart names the survey it imitates and its reference year, so the structure of a real release can be judged at a glance.</p></article>
    <article class="card"><h2>How figures are compiled</h2><ul class="findings">
      <li><strong>Population Register</strong> — continuous register of residents; totals at 1 January.</li>
      <li><strong>National Accounts</strong> — quarterly GDP by production, income and expenditure approaches, benchmarked annually.</li>
      <li><strong>Labour Force Survey</strong> — 18,000 households per quarter; unemployment on the ILO definition.</li>
      <li><strong>Consumer Price Index</strong> — 620 items priced monthly in 42 towns.</li>
      <li><strong>Census 2021</strong> — full enumeration; intercensal years use register-based estimates.</li></ul></article>
  </section>
  <article class="card"><h2>Reuse &amp; citation</h2><p>All tables are released under the VSO open licence: copy, adapt and redistribute for any purpose, citing “VSO, Republic of Velmar” and the table code (for example POP-2026-01). This website is a set of static files and works fully offline — every chart is drawn in your browser from data bundled with the page.</p>
  <p><a class="btn dark" href="#/data">Browse the data tables</a> <a class="btn plain" href="#/">Back to overview</a></p></article>`;
}

export function notFoundView() {
  return `<div class="page-head"><h1>Page not found</h1><p>That section does not exist. Start from the <a href="#/">overview</a> or pick a section above.</p></div>`;
}
