# Velmar Statistics Office — National Statistics Site

[![make.fun bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/konzlodon74-dot/natstats-entry/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/konzlodon74-dot/natstats-entry/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Bounty: https://make.fun/bounty/best-national-statistics-site-20261126-0539

A complete, original national statistics website for the fictional Republic of
Velmar, published by the Velmar Statistics Office (VSO). It runs entirely from
its own static files in `app/` — no network requests, no libraries — and works
on desktop and phone.

## What's inside

- **Overview dashboard** — headline KPI cards (population, GDP, unemployment,
  life expectancy) with a working year selector (2015–2025), trend charts and
  the release calendar.
- **Population** — components of change (births / deaths / net migration
  switcher), key findings and a full population pyramid.
- **Economy** — GDP, growth, inflation, unemployment, wages and sector shares.
- **Health** — life expectancy, infant mortality, hospital capacity and a
  causes-of-death donut chart.
- **Education** — enrolment by level and graduates by field of study.
- **Regions** — clickable tile map of Velmar's six regions, region profiles and
  a sortable comparison table.
- **Data tables** — searchable indicator catalogue with a one-click CSV
  download of the full 2015–2025 time series.
- **About & methods** — sources, compilation notes and reuse licence.

Every figure lives once in `app/data.js`; charts (`app/charts.js`) are
hand-drawn SVG generated from that data, pages are rendered by
`app/views.js`, and `app/main.js` routes between them and wires every control.

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # hand-in build
```

## Licence

MIT — see `LICENSE`. Site content is released under the VSO open licence:
cite "VSO, Republic of Velmar" with the table code.
