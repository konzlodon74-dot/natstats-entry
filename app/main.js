// Router and control wiring for the VSO site. Hash routes keep the whole
// site in one static page load; state survives navigation so the chosen
// year, region and filters stay put while exploring.

import * as D from "./data.js";
import { homeView, populationView, economyView, healthView, educationView, regionsView, dataView, searchView, aboutView, notFoundView } from "./views.js";

const state = {
  yearIdx: D.YEARS.length - 1,
  popMetric: "births",
  regionId: "capital",
  regionSort: "pop",
  tableFilter: "",
  query: "",
};

const app = document.getElementById("app");
const navLinks = [...document.querySelectorAll("#main-nav a")];

function route() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [page, param] = hash.split("/");
  let html, active = page || "home";
  switch (page) {
    case "": case "home": html = homeView(state); active = "home"; break;
    case "population": html = populationView(state); break;
    case "economy": html = economyView(state); break;
    case "health": html = healthView(state); break;
    case "education": html = educationView(state); break;
    case "regions": html = regionsView(state); break;
    case "data": html = dataView(state); break;
    case "about": html = aboutView(); break;
    case "search": state.query = decodeURIComponent(param || ""); html = searchView(state); active = ""; break;
    default: html = notFoundView(); active = "";
  }
  app.innerHTML = html;
  navLinks.forEach((a) => a.classList.toggle("active", a.dataset.route === active));
  document.title = active && active !== "home"
    ? `${active[0].toUpperCase()}${active.slice(1)} — Velmar Statistics Office`
    : "Velmar Statistics Office — National Statistics";
  wireControls();
  window.scrollTo(0, 0);
}

function rerender() {
  const activeId = document.activeElement?.id;
  route();
  if (activeId) document.getElementById(activeId)?.focus();
}

function downloadCsv() {
  const head = "year,population,births,deaths,net_migration,gdp_vkc_bn,gdp_growth_pct,inflation_pct,unemployment_pct,median_wage_vkc,life_expectancy,infant_mortality\n";
  const rows = D.YEARS.map((y, i) => [y, D.POPULATION[i], D.BIRTHS[i], D.DEATHS[i], D.NET_MIGRATION[i], D.GDP_BN[i], D.GDP_GROWTH[i], D.INFLATION[i], D.UNEMPLOYMENT[i], D.MEDIAN_WAGE[i], D.LIFE_EXP[i], D.INFANT_MORTALITY[i]].join(",")).join("\n");
  const blob = new Blob([head + rows + "\n"], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "velmar-time-series-2015-2025.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

function wireControls() {
  app.querySelectorAll("[data-action]").forEach((el) => {
    const action = el.dataset.action;
    if (action === "year") el.addEventListener("change", () => { state.yearIdx = Number(el.value); rerender(); });
    if (action === "pop-metric") el.addEventListener("click", () => { state.popMetric = el.dataset.value; rerender(); });
    if (action === "region") el.addEventListener("click", (e) => { e.preventDefault(); state.regionId = el.dataset.value; rerender(); });
    if (action === "region-sort") el.addEventListener("click", () => { state.regionSort = el.dataset.value; rerender(); });
    if (action === "table-filter") el.addEventListener("input", () => { state.tableFilter = el.value; rerender(); });
    if (action === "download-csv") el.addEventListener("click", downloadCsv);
  });
  app.querySelectorAll(".map-tile").forEach((tile) => {
    tile.addEventListener("click", () => { state.regionId = tile.dataset.region; rerender(); });
  });
}

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("search-input").value.trim();
  location.hash = q ? `#/search/${encodeURIComponent(q)}` : "#/data";
});

window.addEventListener("hashchange", route);
route();
