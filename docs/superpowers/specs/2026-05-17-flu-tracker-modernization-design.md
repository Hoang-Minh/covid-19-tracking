# Flu Tracker Modernization Design

**Date:** 2026-05-17  
**Status:** Approved  
**Goal:** Modernize the covid-19-tracking app into a seasonal flu tracker, deploy to Vercel.

---

## 1. Architecture & Tooling

**Build tool:** Vite 6 replaces Create React App (`react-scripts`). Entry point moves to `index.html` at project root. Scripts change to `vite` / `vite build` / `vite preview`.

**Runtime:** Node 20 LTS. The `engines` field updates from `12.13.0` to `>=20`.

**Deployment:** `vercel.json` added at project root with a single SPA rewrite rule so client-side routing works correctly. Vercel auto-detects Vite and outputs from `dist/`.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Dependencies removed:**

| Package | Reason |
|---|---|
| `react-scripts` | Replaced by Vite |
| `@material-ui/core` | Replaced by Tailwind CSS |
| `classnames` | No longer needed |
| `react-countup` | Replaced by `Intl.NumberFormat` |
| `chart.js ^2` | Upgraded to v4 |
| `react-chartjs-2 ^2` | Upgraded to v5 |
| `axios ^0.19` | Upgraded to v1 |
| `@testing-library/*` v9 | Upgraded to v14 |

**Dependencies added:**

| Package | Purpose |
|---|---|
| `vite` | Build tool |
| `@vitejs/plugin-react` | React JSX transform for Vite |
| `tailwindcss` | Utility-first CSS |
| `postcss` | Required by Tailwind |
| `autoprefixer` | Required by Tailwind |
| `chart.js ^4` | Charts |
| `react-chartjs-2 ^5` | React wrapper for Chart.js 4 |
| `axios ^1` | HTTP client |

---

## 2. Data Layer

**API source:** CDC public Socrata API (`data.cdc.gov`). No API key required.

**Base URL:** stored in `.env` as `VITE_CDC_API_URL=https://data.cdc.gov/resource/j3ug-3e1k.json`

### Endpoints

| Function | Endpoint | Purpose |
|---|---|---|
| `fetchCurrentStats(region)` | `j3ug-3e1k.json` filtered to latest week + region | Stat cards |
| `fetchWeeklyTrend()` | `j3ug-3e1k.json` last 52 weeks, national | Line chart |
| `fetchRegions()` | Hardcoded — no network call | Region picker |

### Data Shape Mapping

| Old field | New field | CDC column |
|---|---|---|
| `confirmed.value` (active cases) | ILI Patients | `ilitotal` |
| `recovered.value` | Total Patients | `total_patients` |
| `deaths.value` | % ILI | `weighted_ili` |

### Regions

Ten HHS regions (hardcoded array) plus "National":

```
National, Region 1, Region 2, Region 3, Region 4,
Region 5, Region 6, Region 7, Region 8, Region 9, Region 10
```

### Error Handling

Each API function returns `null` on network failure or non-2xx response. The UI checks for `null` and renders a graceful error state rather than crashing.

---

## 3. Components

All CSS modules are removed. All styling uses Tailwind utility classes.

### Component Tree

```
App.jsx
├── StatCardList.jsx
│   └── StatCard.jsx
├── RegionPicker.jsx
└── Chart.jsx
```

### Per-Component Changes

**`App.jsx`**
- Convert class component to functional with `useState` / `useEffect`
- State: `{ stats, region, loading, error }`
- Fetches on mount (national) and re-fetches when region changes

**`StatCard.jsx`** (was `CardTemplate.js`)
- Remove MUI `Card`, `CardContent`, `Typography`, `Grid`
- Remove `react-countup`
- Plain `div` with Tailwind classes
- Numbers formatted with `Intl.NumberFormat('en-US')`
- Props: `title`, `value`, `subtitle`, `colorClass`

**`StatCardList.jsx`** (was `CardList.js`)
- Remove MUI `Grid`
- Tailwind `grid grid-cols-1 sm:grid-cols-3 gap-4`
- Three cards: ILI Patients (blue), Total Patients (green), % ILI (red)

**`RegionPicker.jsx`** (was `CountryPicker.js`)
- Remove MUI `NativeSelect`, `FormControl`
- Plain `<select>` with Tailwind styling
- Options: National + Regions 1–10 (hardcoded, no fetch)

**`Chart.jsx`**
- Upgrade to Chart.js 4: register required components explicitly via `Chart.register(...)`
- Fix `options` placement — was incorrectly nested inside `data` object, must be a separate prop on `<Line>` / `<Bar>`
- Line chart: weekly ILI % trend (national, last 52 weeks)
- Bar chart: ILI patients / total patients / % ILI for selected region

---

## 4. Deployment & Error States

### Vercel Deployment

- `vercel.json` at project root (SPA rewrite rule above)
- Build command: `vite build` (auto-detected)
- Output directory: `dist`
- Node version: 20 (set via `"engines": { "node": ">=20" }` in `package.json` — Vercel reads this automatically)

### UI Error States

| State | Trigger | UI Treatment |
|---|---|---|
| Loading | API call in flight | Skeleton placeholder cards + spinner |
| Error | Network failure / non-2xx | Banner: "Flu data temporarily unavailable" |
| Empty | No data for selected region/week | Cards show "—" instead of 0 |

### Branding

- App title: "Flu Tracker"
- `<title>` in `index.html`: "Flu Tracker"
- Page header: plain `<h1>` with Tailwind styling (NIH COVID image removed)
- All visible "COVID-19" text replaced with flu-relevant labels

### Environment Variables

| Variable | Value | Purpose |
|---|---|---|
| `VITE_CDC_API_URL` | `https://data.cdc.gov/resource/j3ug-3e1k.json` | CDC ILINet dataset |

Add `.env` to `.gitignore` if not already present; commit a `.env.example` with the variable name but no value.

---

## Out of Scope

- New tests beyond upgrading existing test library versions
- User authentication
- Data persistence / caching layer
- Mobile-specific layout changes beyond Tailwind responsive classes
