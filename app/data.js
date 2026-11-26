// Velmar Statistics Office — demonstration dataset for the Republic of Velmar.
// Every figure is defined here once; views render from these tables so charts,
// KPI cards and downloadable CSVs always agree.

export const COUNTRY = {
  name: "Republic of Velmar",
  office: "Velmar Statistics Office (VSO)",
  capital: "Port Velmar",
  currency: "velmar crown (VKC)",
  areaKm2: 48210,
};

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Population register, 1 January each year (persons).
export const POPULATION = [4382100, 4418900, 4456700, 4493200, 4529800, 4561400, 4592700, 4625100, 4658900, 4693400, 4728100];
export const BIRTHS = [52140, 51380, 50460, 49820, 49110, 47640, 48320, 47980, 47210, 46890, 47150];
export const DEATHS = [38420, 38960, 39410, 40180, 40890, 44730, 43120, 41860, 40940, 40310, 39870];
export const NET_MIGRATION = [2910, 4380, 4720, 4260, 4780, 3180, 4110, 4720, 5250, 5810, 6420];

// Age structure 2025, five-year bands (persons).
export const AGE_BANDS = ["0–4", "5–9", "10–14", "15–19", "20–24", "25–29", "30–34", "35–39", "40–44", "45–49", "50–54", "55–59", "60–64", "65–69", "70–74", "75–79", "80+"];
export const AGE_MEN = [118400, 121900, 124600, 128300, 141200, 152800, 158400, 156900, 149700, 143200, 138600, 132100, 124800, 112400, 94700, 71600, 58900];
export const AGE_WOMEN = [113100, 116400, 119200, 122700, 136500, 149100, 155600, 155100, 149300, 144800, 141200, 136400, 130900, 120300, 105800, 86100, 98400];

// National accounts, current prices.
export const GDP_BN = [96.4, 99.8, 104.1, 108.7, 113.2, 109.6, 117.4, 124.9, 131.6, 138.4, 145.9];
export const GDP_GROWTH = [2.1, 2.4, 2.9, 2.7, 2.2, -3.4, 4.8, 3.6, 2.4, 2.1, 2.3];
export const INFLATION = [1.2, 0.8, 1.6, 2.1, 1.8, 0.9, 3.4, 7.9, 5.6, 3.1, 2.4];
export const UNEMPLOYMENT = [6.8, 6.4, 5.9, 5.5, 5.2, 7.1, 6.3, 5.6, 5.4, 5.1, 4.9];
export const MEDIAN_WAGE = [2140, 2210, 2305, 2410, 2520, 2510, 2630, 2790, 2940, 3060, 3185];

// Value added by sector, share of GDP 2025 (%).
export const SECTORS = [
  { name: "Services", pct: 58.4, jobs: 1312400 },
  { name: "Manufacturing", pct: 14.6, jobs: 398200 },
  { name: "Construction", pct: 7.9, jobs: 186500 },
  { name: "Agriculture & fishing", pct: 6.8, jobs: 142800 },
  { name: "Energy & utilities", pct: 4.2, jobs: 38100 },
  { name: "Mining & quarrying", pct: 2.1, jobs: 21400 },
  { name: "Other", pct: 6.0, jobs: 95800 },
];

// Health system indicators.
export const LIFE_EXP = [79.8, 80.1, 80.4, 80.6, 80.9, 80.2, 80.5, 81.0, 81.3, 81.5, 81.8];
export const INFANT_MORTALITY = [4.1, 3.9, 3.8, 3.6, 3.5, 3.6, 3.4, 3.3, 3.2, 3.1, 3.0];
export const HOSPITAL_BEDS = [5.6, 5.5, 5.4, 5.3, 5.2, 5.2, 5.1, 5.0, 4.9, 4.9, 4.8];
export const DOCTORS_PER_1000 = [3.1, 3.2, 3.2, 3.3, 3.4, 3.4, 3.5, 3.6, 3.7, 3.7, 3.8];
export const CAUSES_OF_DEATH = [
  { name: "Circulatory diseases", pct: 34.2 },
  { name: "Cancers", pct: 26.8 },
  { name: "Respiratory diseases", pct: 9.4 },
  { name: "External causes", pct: 6.1 },
  { name: "Digestive diseases", pct: 4.8 },
  { name: "Infectious diseases", pct: 3.9 },
  { name: "Other causes", pct: 14.8 },
];

// Education indicators.
export const LITERACY = 99.2;
export const ENROLMENT = [
  { level: "Primary (ages 6–11)", pct: 98.7, pupils: 298400 },
  { level: "Lower secondary (12–15)", pct: 97.9, pupils: 191200 },
  { level: "Upper secondary (16–18)", pct: 92.4, pupils: 138600 },
  { level: "Vocational colleges", pct: 41.8, pupils: 62400 },
  { level: "Universities", pct: 38.6, pupils: 98400 },
];
export const GRADUATES_BY_FIELD = [
  { name: "Health & welfare", n: 6840 },
  { name: "Engineering & construction", n: 5920 },
  { name: "Business & law", n: 7610 },
  { name: "Education", n: 4380 },
  { name: "ICT", n: 4120 },
  { name: "Natural sciences", n: 2960 },
  { name: "Arts & humanities", n: 2840 },
  { name: "Agriculture", n: 1120 },
];

// Six regions. Figures are the 2025 regional accounts release.
export const REGIONS = [
  { id: "capital", name: "Capital District", pop: 1284600, gdpPerCap: 41200, unemployment: 4.2, lifeExp: 82.6, density: 2140, growth: 1.4 },
  { id: "north", name: "Northern Highlands", pop: 612300, gdpPerCap: 24800, unemployment: 6.1, lifeExp: 80.4, density: 38, growth: 0.2 },
  { id: "east", name: "Eastern Plains", pop: 884500, gdpPerCap: 27100, unemployment: 5.4, lifeExp: 80.9, density: 96, growth: 0.6 },
  { id: "south", name: "Southern Coast", pop: 1042800, gdpPerCap: 33600, unemployment: 4.8, lifeExp: 81.9, density: 388, growth: 1.1 },
  { id: "west", name: "Western Valleys", pop: 693200, gdpPerCap: 25900, unemployment: 5.7, lifeExp: 81.1, density: 112, growth: 0.4 },
  { id: "islands", name: "Outer Islands", pop: 210700, gdpPerCap: 29400, unemployment: 5.0, lifeExp: 81.4, density: 64, growth: 0.8 },
];

// Release calendar shown on the overview page.
export const RELEASES = [
  { title: "Consumer prices, October 2025", date: "28 Nov 2025", code: "CPI-2025-10" },
  { title: "Labour force survey, Q3 2025", date: "2 Dec 2025", code: "LFS-2025-Q3" },
  { title: "National accounts, Q3 2025", date: "9 Dec 2025", code: "GDP-2025-Q3" },
  { title: "Population register, 1 Jan 2026", date: "20 Jan 2026", code: "POP-2026-01" },
];

// Searchable indicator catalogue: name, page, latest value, source.
export const CATALOGUE = [
  { name: "Total population", page: "population", value: "4,728,100", year: 2025, source: "Population Register" },
  { name: "Births", page: "population", value: "47,150", year: 2025, source: "Vital Statistics" },
  { name: "Deaths", page: "population", value: "39,870", year: 2025, source: "Vital Statistics" },
  { name: "Net migration", page: "population", value: "+6,420", year: 2025, source: "Migration Statistics" },
  { name: "Median age", page: "population", value: "41.2 years", year: 2025, source: "Population Register" },
  { name: "GDP", page: "economy", value: "VKC 145.9 bn", year: 2025, source: "National Accounts" },
  { name: "GDP growth (real)", page: "economy", value: "+2.3%", year: 2025, source: "National Accounts" },
  { name: "Inflation (CPI, annual avg.)", page: "economy", value: "2.4%", year: 2025, source: "Consumer Price Index" },
  { name: "Unemployment rate", page: "economy", value: "4.9%", year: 2025, source: "Labour Force Survey" },
  { name: "Median monthly wage", page: "economy", value: "VKC 3,185", year: 2025, source: "Earnings Survey" },
  { name: "Life expectancy at birth", page: "health", value: "81.8 years", year: 2025, source: "Mortality Tables" },
  { name: "Infant mortality", page: "health", value: "3.0 per 1,000", year: 2025, source: "Vital Statistics" },
  { name: "Hospital beds", page: "health", value: "4.8 per 1,000", year: 2025, source: "Health Facilities Census" },
  { name: "Physicians", page: "health", value: "3.8 per 1,000", year: 2025, source: "Health Workforce Register" },
  { name: "Adult literacy rate", page: "education", value: "99.2%", year: 2025, source: "Education Census" },
  { name: "Primary enrolment", page: "education", value: "98.7%", year: 2025, source: "School Census" },
  { name: "University students", page: "education", value: "98,400", year: 2025, source: "Higher Education Register" },
  { name: "Capital District population", page: "regions", value: "1,284,600", year: 2025, source: "Regional Accounts" },
  { name: "Highest regional GDP per capita", page: "regions", value: "VKC 41,200 (Capital)", year: 2025, source: "Regional Accounts" },
  { name: "Land area", page: "about", value: "48,210 km²", year: 2025, source: "Geodetic Survey" },
];

export function fmt(n) {
  return n.toLocaleString("en-GB");
}

export function pctChange(series, i) {
  if (i <= 0) return 0;
  return ((series[i] - series[i - 1]) / series[i - 1]) * 100;
}
