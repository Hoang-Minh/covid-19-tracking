# Flu Tracker Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the COVID-19 tracker to a seasonal flu tracker using Vite, React 18, Tailwind CSS, and the CDC ILINet API, deployed to Vercel.

**Architecture:** Single-page React 18 app built with Vite. Data comes from CDC's public Socrata ILINet API (`data.cdc.gov/resource/j3ug-3e1k.json`) — no auth required. All UI styling via Tailwind CSS — no component library. Deploys as a static site on Vercel via `vite build` → `dist/`.

**Tech Stack:** Vite 6, React 18, Tailwind CSS 3, Chart.js 4, react-chartjs-2 5, axios 1.x, Vitest 2, @testing-library/react 16, Node 20 LTS.

**Spec:** `docs/superpowers/specs/2026-05-17-flu-tracker-modernization-design.md`

---

## File Map

**Created:**
- `index.html` — Vite SPA entry point (root level, replaces `public/index.html`)
- `vite.config.js` — Vite + Vitest configuration
- `tailwind.config.js` — Tailwind content scanning paths
- `postcss.config.js` — PostCSS plugins (Tailwind + autoprefixer)
- `vercel.json` — SPA rewrite rule for Vercel
- `.env` — local CDC API URL (not committed)
- `.env.example` — env var template (committed)
- `src/setupTests.js` — Vitest global test setup (@testing-library/jest-dom)
- `src/main.jsx` — React 18 `createRoot` entry (replaces `src/index.js`)
- `src/index.css` — Tailwind directives
- `src/App.jsx` — functional App component (replaces `src/App.js`)
- `src/api/index.js` — CDC ILINet API functions (replaces old covid API)
- `src/api/index.test.js`
- `src/components/StatCards/StatCard.jsx` — single stat card (replaces `CardTemplate.js`)
- `src/components/StatCards/StatCard.test.jsx`
- `src/components/StatCards/StatCardList.jsx` — 3-card grid (replaces `CardList.js`)
- `src/components/StatCards/StatCardList.test.jsx`
- `src/components/RegionPicker/RegionPicker.jsx` — HHS region selector (replaces `CountryPicker.js`)
- `src/components/RegionPicker/RegionPicker.test.jsx`
- `src/components/Chart/Chart.jsx` — Chart.js 4 version (overwrites existing)
- `src/components/Chart/Chart.test.jsx`

**Modified:**
- `package.json` — full replacement of deps + scripts

**Deleted:**
- `public/index.html` — CRA HTML template (replaced by root `index.html`)
- `src/index.js` — old CRA entry with `ReactDOM.render`
- `src/App.js` — old class component
- `src/App.module.css`
- `src/components/Cards/CardTemplate.js`
- `src/components/Cards/CardList.js`
- `src/components/Cards/Cards.module.css`
- `src/components/Chart/Chart.module.css`
- `src/components/CountryPicker/CountryPicker.js`
- `src/components/CountryPicker/CountryPicker.module.css`

---

## Task 1: Swap build tooling (CRA → Vite + Tailwind)

**Files:**
- Modify: `package.json`
- Create: `index.html`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `src/setupTests.js`, `src/index.css`
- Delete: `public/index.html`

- [ ] **Step 1: Replace `package.json`**

Overwrite the entire file with:

```json
{
  "name": "flu-tracker",
  "version": "0.1.0",
  "description": "US seasonal flu tracking dashboard",
  "private": true,
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "start": "vite",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "axios": "^1.7.0",
    "chart.js": "^4.4.0",
    "react": "^18.3.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^6.0.0",
    "vitest": "^2.0.0"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

Expected: clean install, no peer-dep errors. `package-lock.json` regenerated with the new dependency tree.

- [ ] **Step 3: Create `vite.config.js` at project root**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
```

- [ ] **Step 4: Create `index.html` at project root**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flu Tracker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Delete `public/index.html`**

```bash
git rm public/index.html
```

The remaining files in `public/` (favicon.ico, manifest.json, robots.txt, logo files) stay — Vite serves them as-is from `public/`.

- [ ] **Step 6: Create `tailwind.config.js` at project root**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

- [ ] **Step 7: Create `postcss.config.js` at project root**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 8: Create `src/setupTests.js`**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 9: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 10: Commit**

```bash
git add index.html vite.config.js tailwind.config.js postcss.config.js src/setupTests.js src/index.css package.json package-lock.json
git commit -m "chore: migrate build tooling from CRA to Vite with Tailwind and Vitest"
```

---

## Task 2: Deployment config

**Files:**
- Create: `vercel.json`, `.env`, `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Create `vercel.json` at project root**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Create `.env` at project root**

```
VITE_CDC_API_URL=https://data.cdc.gov/resource/j3ug-3e1k.json
```

- [ ] **Step 3: Create `.env.example` at project root**

```
VITE_CDC_API_URL=
```

- [ ] **Step 4: Ensure `.env` is in `.gitignore`**

Check if `.gitignore` exists. If it does, ensure `.env` appears on its own line. If it doesn't exist, create it with:

```
node_modules/
dist/
.env
```

If `.gitignore` exists but doesn't include `.env`, add the line:

```
.env
```

- [ ] **Step 5: Commit**

```bash
git add vercel.json .env.example .gitignore
git commit -m "chore: add Vercel deployment config and env template"
```

---

## Task 3: API layer — CDC ILINet

**Files:**
- Create: `src/api/index.js`, `src/api/index.test.js`

The CDC Socrata API at `j3ug-3e1k.json` returns an array of records. Each record has: `region` (string like "National" or "Region 5"), `week_start` (ISO date string), `ilitotal` (string number — raw ILI visit count), `total_patients` (string number), `weighted_ili` (string float — % of visits that were ILI).

- [ ] **Step 1: Write failing tests — create `src/api/index.test.js`**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { fetchCurrentStats, fetchWeeklyTrend, fetchRegions } from './index'

vi.mock('axios')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('fetchCurrentStats', () => {
  it('returns the latest record for the given region', async () => {
    const record = { ilitotal: '200', total_patients: '2000', weighted_ili: '3.1', week_start: '2024-11-01' }
    axios.get.mockResolvedValueOnce({ data: [record] })
    const result = await fetchCurrentStats('National')
    expect(result).toEqual(record)
  })

  it('passes region as a $where query param', async () => {
    axios.get.mockResolvedValueOnce({ data: [{}] })
    await fetchCurrentStats('Region 5')
    expect(axios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ $where: "region='Region 5'" }),
      })
    )
  })

  it('returns null on network error', async () => {
    axios.get.mockRejectedValueOnce(new Error('network'))
    const result = await fetchCurrentStats('National')
    expect(result).toBeNull()
  })

  it('returns null when API returns empty array', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    const result = await fetchCurrentStats('National')
    expect(result).toBeNull()
  })
})

describe('fetchWeeklyTrend', () => {
  it('returns an array of weekly records', async () => {
    const records = [
      { week_start: '2024-01-01', weighted_ili: '1.2' },
      { week_start: '2024-01-08', weighted_ili: '1.5' },
    ]
    axios.get.mockResolvedValueOnce({ data: records })
    const result = await fetchWeeklyTrend()
    expect(result).toEqual(records)
  })

  it('returns null on error', async () => {
    axios.get.mockRejectedValueOnce(new Error('timeout'))
    const result = await fetchWeeklyTrend()
    expect(result).toBeNull()
  })
})

describe('fetchRegions', () => {
  it('returns National plus 10 HHS regions without a network call', () => {
    const regions = fetchRegions()
    expect(axios.get).not.toHaveBeenCalled()
    expect(regions).toHaveLength(11)
    expect(regions[0]).toBe('National')
    expect(regions[10]).toBe('Region 10')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --run src/api/index.test.js
```

Expected: all 7 tests fail with "Cannot find module './index'".

- [ ] **Step 3: Implement `src/api/index.js`**

```js
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_CDC_API_URL

export const fetchCurrentStats = async (region = 'National') => {
  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        $where: `region='${region}'`,
        $order: 'week_start DESC',
        $limit: 1,
      },
    })
    return data[0] || null
  } catch {
    return null
  }
}

export const fetchWeeklyTrend = async () => {
  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        $where: "region='National'",
        $order: 'week_start ASC',
        $limit: 52,
      },
    })
    return data
  } catch {
    return null
  }
}

export const fetchRegions = () => [
  'National',
  'Region 1',
  'Region 2',
  'Region 3',
  'Region 4',
  'Region 5',
  'Region 6',
  'Region 7',
  'Region 8',
  'Region 9',
  'Region 10',
]
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --run src/api/index.test.js
```

Expected: 7 tests pass, 0 fail.

- [ ] **Step 5: Commit**

```bash
git add src/api/index.js src/api/index.test.js
git commit -m "feat: add CDC ILINet API layer"
```

---

## Task 4: StatCard component

**Files:**
- Create: `src/components/StatCards/StatCard.jsx`, `src/components/StatCards/StatCard.test.jsx`

`StatCard` renders one metric. Props: `title` (string), `value` (number | string | null), `subtitle` (string), `colorClass` (Tailwind top-border color e.g. `"border-blue-500"`). Numbers > 999 get comma formatting via `Intl.NumberFormat`. String values (e.g. `"2.50%"`) pass through unchanged. `null` renders the em-dash `"—"`.

- [ ] **Step 1: Write failing tests — create `src/components/StatCards/StatCard.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatCard from './StatCard'

describe('StatCard', () => {
  it('renders the title', () => {
    render(<StatCard title="ILI Patients" value={100} subtitle="test" colorClass="border-blue-500" />)
    expect(screen.getByText('ILI Patients')).toBeInTheDocument()
  })

  it('formats large numbers with commas', () => {
    render(<StatCard title="ILI Patients" value={12345} subtitle="test" colorClass="border-blue-500" />)
    expect(screen.getByText('12,345')).toBeInTheDocument()
  })

  it('renders string values as-is', () => {
    render(<StatCard title="% ILI" value="2.50%" subtitle="test" colorClass="border-red-500" />)
    expect(screen.getByText('2.50%')).toBeInTheDocument()
  })

  it('renders — when value is null', () => {
    render(<StatCard title="ILI Patients" value={null} subtitle="test" colorClass="border-blue-500" />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<StatCard title="T" value={1} subtitle="Patients with ILI" colorClass="border-blue-500" />)
    expect(screen.getByText('Patients with ILI')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --run src/components/StatCards/StatCard.test.jsx
```

Expected: all 5 tests fail with "Cannot find module './StatCard'".

- [ ] **Step 3: Implement `src/components/StatCards/StatCard.jsx`**

```jsx
const StatCard = ({ title, value, subtitle, colorClass }) => {
  const display =
    value == null
      ? '—'
      : typeof value === 'number'
      ? new Intl.NumberFormat('en-US').format(value)
      : value

  return (
    <div className={`rounded-xl shadow p-5 bg-white border-t-4 ${colorClass}`}>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold my-1">{display}</p>
      <p className="text-gray-400 text-xs">{subtitle}</p>
    </div>
  )
}

export default StatCard
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --run src/components/StatCards/StatCard.test.jsx
```

Expected: 5 tests pass, 0 fail.

- [ ] **Step 5: Commit**

```bash
git add src/components/StatCards/StatCard.jsx src/components/StatCards/StatCard.test.jsx
git commit -m "feat: add StatCard component"
```

---

## Task 5: StatCardList component

**Files:**
- Create: `src/components/StatCards/StatCardList.jsx`, `src/components/StatCards/StatCardList.test.jsx`

`StatCardList` renders a 3-column responsive grid of `StatCard`s. Prop: `stats` (CDC record object or `null`). Fields read from `stats`: `ilitotal`, `total_patients`, `weighted_ili` — all arrive as strings from the API and must be converted with `Number()`. `% ILI` is formatted to 2 decimal places with a `%` suffix before being passed to `StatCard` as a string.

- [ ] **Step 1: Write failing tests — create `src/components/StatCards/StatCardList.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatCardList from './StatCardList'

const mockStats = {
  ilitotal: '150',
  total_patients: '1500',
  weighted_ili: '2.75',
}

describe('StatCardList', () => {
  it('renders three card titles', () => {
    render(<StatCardList stats={mockStats} />)
    expect(screen.getByText('ILI Patients')).toBeInTheDocument()
    expect(screen.getByText('Total Patients')).toBeInTheDocument()
    expect(screen.getByText('% ILI')).toBeInTheDocument()
  })

  it('displays formatted ILI patient count', () => {
    render(<StatCardList stats={mockStats} />)
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('displays % ILI with two decimal places and % symbol', () => {
    render(<StatCardList stats={mockStats} />)
    expect(screen.getByText('2.75%')).toBeInTheDocument()
  })

  it('renders — for all three values when stats is null', () => {
    render(<StatCardList stats={null} />)
    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --run src/components/StatCards/StatCardList.test.jsx
```

Expected: all 4 tests fail with "Cannot find module './StatCardList'".

- [ ] **Step 3: Implement `src/components/StatCards/StatCardList.jsx`**

```jsx
import StatCard from './StatCard'

const StatCardList = ({ stats }) => {
  const cards = [
    {
      title: 'ILI Patients',
      value: stats ? Number(stats.ilitotal) : null,
      subtitle: 'Patients with influenza-like illness',
      colorClass: 'border-blue-500',
    },
    {
      title: 'Total Patients',
      value: stats ? Number(stats.total_patients) : null,
      subtitle: 'Total patients seen this week',
      colorClass: 'border-green-500',
    },
    {
      title: '% ILI',
      value: stats ? `${Number(stats.weighted_ili).toFixed(2)}%` : null,
      subtitle: 'Weighted % of visits for ILI',
      colorClass: 'border-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  )
}

export default StatCardList
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --run src/components/StatCards/StatCardList.test.jsx
```

Expected: 4 tests pass, 0 fail.

- [ ] **Step 5: Commit**

```bash
git add src/components/StatCards/StatCardList.jsx src/components/StatCards/StatCardList.test.jsx
git commit -m "feat: add StatCardList component"
```

---

## Task 6: RegionPicker component

**Files:**
- Create: `src/components/RegionPicker/RegionPicker.jsx`, `src/components/RegionPicker/RegionPicker.test.jsx`

`RegionPicker` is a controlled `<select>` populated from `fetchRegions()`. Props: `region` (currently selected string), `onRegionChange` (callback receiving the new selected string).

- [ ] **Step 1: Write failing tests — create `src/components/RegionPicker/RegionPicker.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import RegionPicker from './RegionPicker'

describe('RegionPicker', () => {
  it('renders 11 options (National + 10 HHS regions)', () => {
    render(<RegionPicker region="National" onRegionChange={() => {}} />)
    expect(screen.getAllByRole('option')).toHaveLength(11)
  })

  it('shows National as the first option', () => {
    render(<RegionPicker region="National" onRegionChange={() => {}} />)
    const options = screen.getAllByRole('option')
    expect(options[0].textContent).toBe('National')
  })

  it('calls onRegionChange with the selected value', async () => {
    const handler = vi.fn()
    render(<RegionPicker region="National" onRegionChange={handler} />)
    await userEvent.selectOptions(screen.getByRole('combobox'), 'Region 3')
    expect(handler).toHaveBeenCalledWith('Region 3')
  })

  it('reflects the controlled region prop as the current value', () => {
    render(<RegionPicker region="Region 5" onRegionChange={() => {}} />)
    expect(screen.getByRole('combobox')).toHaveValue('Region 5')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --run src/components/RegionPicker/RegionPicker.test.jsx
```

Expected: all 4 tests fail with "Cannot find module './RegionPicker'".

- [ ] **Step 3: Implement `src/components/RegionPicker/RegionPicker.jsx`**

```jsx
import { fetchRegions } from '../../api'

const RegionPicker = ({ region, onRegionChange }) => {
  const regions = fetchRegions()
  return (
    <div className="flex justify-center mb-6">
      <select
        className="border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={region}
        onChange={(e) => onRegionChange(e.target.value)}
      >
        {regions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  )
}

export default RegionPicker
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --run src/components/RegionPicker/RegionPicker.test.jsx
```

Expected: 4 tests pass, 0 fail.

- [ ] **Step 5: Commit**

```bash
git add src/components/RegionPicker/RegionPicker.jsx src/components/RegionPicker/RegionPicker.test.jsx
git commit -m "feat: add RegionPicker component"
```

---

## Task 7: Chart component

**Files:**
- Create: `src/components/Chart/Chart.jsx` (overwrites existing), `src/components/Chart/Chart.test.jsx`

Chart.js 4 requires explicit component registration via `ChartJS.register(...)` before use — unlike v2 which auto-registered everything. The `options` prop must be passed directly to `<Line>` / `<Bar>`, not nested inside the `data` object (the original code had this bug). Line chart: national weekly % ILI over 52 weeks. Bar chart: ILI patients vs total patients for a selected region.

- [ ] **Step 1: Write failing tests — create `src/components/Chart/Chart.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('react-chartjs-2', () => ({
  Line: (_props) => <canvas data-testid="line-chart" />,
  Bar: (_props) => <canvas data-testid="bar-chart" />,
}))

import Chart from './Chart'

describe('Chart', () => {
  const weeklyData = [
    { week_start: '2024-01-01', weighted_ili: '1.5' },
    { week_start: '2024-01-08', weighted_ili: '2.0' },
  ]
  const stats = { ilitotal: '300', total_patients: '3000', weighted_ili: '2.1' }

  it('renders line chart for National view with weekly data', () => {
    render(<Chart weeklyData={weeklyData} stats={null} region="National" />)
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('renders bar chart for a specific region', () => {
    render(<Chart weeklyData={[]} stats={stats} region="Region 4" />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders nothing when National has no weekly data', () => {
    const { container } = render(<Chart weeklyData={[]} stats={null} region="National" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when region stats are null', () => {
    const { container } = render(<Chart weeklyData={[]} stats={null} region="Region 2" />)
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --run src/components/Chart/Chart.test.jsx
```

Expected: tests fail because the existing `Chart.jsx` uses Chart.js 2 imports that are incompatible with v4.

- [ ] **Step 3: Overwrite `src/components/Chart/Chart.jsx`**

```jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const Chart = ({ weeklyData, stats, region }) => {
  if (region === 'National' && weeklyData.length) {
    const lineData = {
      labels: weeklyData.map((d) => d.week_start?.slice(0, 10)),
      datasets: [
        {
          data: weeklyData.map((d) => Number(d.weighted_ili)),
          label: '% ILI',
          borderColor: '#3333ff',
          backgroundColor: 'rgba(51, 51, 255, 0.1)',
          fill: true,
        },
      ],
    }
    const lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
    }
    return (
      <div className="h-64">
        <Line data={lineData} options={lineOptions} />
      </div>
    )
  }

  if (stats) {
    const barData = {
      labels: ['ILI Patients', 'Total Patients'],
      datasets: [
        {
          label: 'Patients',
          backgroundColor: ['rgba(0, 0, 255, 0.5)', 'rgba(0, 255, 0, 0.5)'],
          data: [Number(stats.ilitotal), Number(stats.total_patients)],
        },
      ],
    }
    const barOptions = {
      plugins: {
        legend: { display: false },
        title: { display: true, text: `Current state in ${region}` },
      },
    }
    return (
      <div className="h-64">
        <Bar data={barData} options={barOptions} />
      </div>
    )
  }

  return null
}

export default Chart
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --run src/components/Chart/Chart.test.jsx
```

Expected: 4 tests pass, 0 fail.

- [ ] **Step 5: Commit**

```bash
git add src/components/Chart/Chart.jsx src/components/Chart/Chart.test.jsx
git commit -m "feat: upgrade Chart component to Chart.js 4"
```

---

## Task 8: App component + React 18 entry point

**Files:**
- Create: `src/main.jsx`, `src/App.jsx`

`App` owns all state: `stats`, `weeklyData`, `region`, `loading`, `error`. On mount and whenever `region` changes, it fetches `fetchCurrentStats(region)` and (if National) `fetchWeeklyTrend()` in parallel. A cleanup flag prevents state updates if the component unmounts before the fetch completes.

- [ ] **Step 1: Create `src/main.jsx`**

```jsx
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(<App />)
```

- [ ] **Step 2: Create `src/App.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { fetchCurrentStats, fetchWeeklyTrend } from './api'
import StatCardList from './components/StatCards/StatCardList'
import RegionPicker from './components/RegionPicker/RegionPicker'
import Chart from './components/Chart/Chart'

export default function App() {
  const [stats, setStats] = useState(null)
  const [weeklyData, setWeeklyData] = useState([])
  const [region, setRegion] = useState('National')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(false)
      try {
        const [statsData, trend] = await Promise.all([
          fetchCurrentStats(region),
          region === 'National' ? fetchWeeklyTrend() : Promise.resolve([]),
        ])
        if (!cancelled) {
          setStats(statsData)
          setWeeklyData(trend || [])
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [region])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Flu Tracker</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          Flu data temporarily unavailable.
        </div>
      )}
      <RegionPicker region={region} onRegionChange={setRegion} />
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : (
        <>
          <StatCardList stats={stats} />
          <Chart weeklyData={weeklyData} stats={stats} region={region} />
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx src/App.jsx
git commit -m "feat: add App component with React 18 entry point"
```

---

## Task 9: Remove old files and verify build

**Files deleted:** `src/index.js`, `src/App.js`, `src/App.module.css`, `src/components/Cards/CardTemplate.js`, `src/components/Cards/CardList.js`, `src/components/Cards/Cards.module.css`, `src/components/Chart/Chart.module.css`, `src/components/CountryPicker/CountryPicker.js`, `src/components/CountryPicker/CountryPicker.module.css`

- [ ] **Step 1: Remove old source files**

```bash
git rm src/index.js src/App.js src/App.module.css
git rm src/components/Cards/CardTemplate.js src/components/Cards/CardList.js src/components/Cards/Cards.module.css
git rm src/components/Chart/Chart.module.css
git rm src/components/CountryPicker/CountryPicker.js src/components/CountryPicker/CountryPicker.module.css
```

- [ ] **Step 2: Run the full test suite**

```bash
npm test -- --run
```

Expected: all 20 tests across all test files pass, 0 fail.

- [ ] **Step 3: Build the project**

```bash
npm run build
```

Expected: `dist/` folder created with no errors. Terminal shows JS and CSS bundle sizes. A typical output looks like:

```
dist/index.html                   0.46 kB
dist/assets/index-[hash].css      x kB
dist/assets/index-[hash].js       x kB
```

If there are any "module not found" errors, check that all old import paths have been updated.

- [ ] **Step 4: Smoke test the production build locally**

```bash
npm run preview
```

Open http://localhost:4173. Verify:
- Page title is "Flu Tracker"
- Page header shows "Flu Tracker"
- Three stat cards render (ILI Patients, Total Patients, % ILI)
- Region picker dropdown shows 11 options
- Selecting a specific region (e.g. "Region 3") changes the displayed data
- Line chart appears for National view
- Bar chart appears for a specific region
- No console errors

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove old CRA files and verify build"
```

---

## Task 10: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git push origin master
```

- [ ] **Step 2: Connect repo to Vercel**

1. Go to https://vercel.com and sign in
2. Click **Add New Project**
3. Import the `covid-19-tracking` GitHub repository
4. Framework preset: **Vite** (auto-detected)
5. Build command: `vite build` (auto-detected)
6. Output directory: `dist` (auto-detected)
7. Click **Deploy** — the first deploy will fail or show "—" data because the env var is not set yet (expected)

- [ ] **Step 3: Add the environment variable in Vercel**

In the Vercel project → **Settings** → **Environment Variables**, add:

| Name | Value | Environments |
|---|---|---|
| `VITE_CDC_API_URL` | `https://data.cdc.gov/resource/j3ug-3e1k.json` | Production, Preview, Development |

Click **Save**.

- [ ] **Step 4: Trigger a redeployment**

In Vercel → **Deployments** → click **Redeploy** on the latest deployment so it picks up the env var.

- [ ] **Step 5: Verify the live deployment**

Open the Vercel deployment URL. Verify:
- "Flu Tracker" heading visible
- Stat cards show real numeric data (not "—")
- Region picker works — selecting a region reloads data
- National view shows a line chart (weekly % ILI trend)
- Specific region shows a bar chart
- No console errors in browser DevTools
