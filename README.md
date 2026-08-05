# TAMS Dashboard

TAMS is a responsive React dashboard prototype for managing teaching assistants and supervisor workflows. It includes a supervisor dashboard, TA directory, individual profiles, semester-aware task scheduling, and Workday-based performance analytics.

## Features

### Supervisor Dashboard

- Performance, survey, hours, and action summaries
- Weekly task schedule calculated from a configurable semester start date
- Support for `T-2`, `T-1`, and semester Weeks 1-14
- Role-based supervisor task filtering
- Current, completed, future, and previewed week states
- Per-supervisor, semester, week, and task completion persistence
- Live weekly progress calculations

### TA Profiles

- General information and onboarding views
- Course assignment and workload allocation details
- Weekly Workday performance based on one combined record per week
- Worked versus expected hours and utilization progress
- Status classifications: On Track, Below Hours, Over Hours, and Needs Review
- Attendance and manual-entry indicators
- Interactive semester hours trend chart
- Synchronized week selection across performance details, chart highlighting, and notes
- Categorized supervisor communication log with colored badges
- Instant category filtering and text/author search
- Newest-first notes with keyboard submission, week context, and success feedback
- Student-support performance placeholder for future metrics

### Interface

- Responsive desktop, tablet, and mobile layouts
- Light and dark themes
- Collapsible navigation
- Keyboard-accessible controls
- Reduced-motion support

## Technology

- React 18
- Vite 6
- Tailwind CSS 3
- Lucide React icons
- ESLint 9
- Node.js built-in test runner
- Browser `localStorage` for temporary client-side persistence

## Prerequisites

- Node.js 18 or newer
- npm

## Installation

From the project root:

```bash
npm install
```

## Development

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, normally [http://localhost:5173](http://localhost:5173).

Changes under `src/` are reflected automatically through Vite hot-module replacement.

## Validation

Run all automated tests:

```bash
npm test
```

Run ESLint:

```bash
npm run lint
```

Create an optimized production build:

```bash
npm run build
```

Preview that production build locally:

```bash
npm run preview
```

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run dev:nodemon` | Start the development server through the existing alias |
| `npm test` | Run tests in `tests/` with Node's test runner |
| `npm run lint` | Check source files with ESLint |
| `npm run build` | Generate the production bundle in `dist/` |
| `npm run preview` | Serve the generated production bundle locally |

## Project Structure

```text
src/
|-- components/
|   |-- dashboard/       # Dashboard and weekly schedule components
|   |-- layout/          # Sidebar and top navigation
|   |-- profile/         # Profile tabs, Workday cards, chart, and notes
|   `-- ui/              # Shared cards and progress components
|-- data/                # Dashboard, profile, and schedule data
|-- pages/               # Dashboard, directory, and profile views
|-- styles/              # Global and Tailwind styles
|-- utils/               # Calculations, statuses, and persistence helpers
|-- App.jsx              # Application shell and view state
`-- main.jsx             # React entry point
tests/                   # Schedule and performance metric tests
```

## Weekly Schedule Configuration

The semester schedule data lives in:

```text
src/data/weeklyTaskSchedule.js
```

Update the configured semester start date and structured task data there when preparing a new semester. Week calculations and task filtering are implemented in `src/utils/weeklySchedule.js`.

Task completion currently uses a local-storage adapter in `src/utils/weeklyTaskStorage.js`. Completion keys are scoped by supervisor, semester, and week so one user's progress does not overwrite another's.

## Performance Data Model

Course allocation and Workday reporting are intentionally separate:

```js
assignments: [
  { course: 'ENG 101', section: '03', maxHours: 10 }
]

workdayData: [
  {
    week: 1,
    expectedHours: 20,
    workedHours: 18.4,
    daysUnder25Minutes: 0,
    manualEntryPercentage: 18,
    syncedAt: '2026-06-03T17:00:00.000Z'
  }
]
```

Only maximum assigned hours belong to individual courses. Worked hours, attendance details, manual entries, and status are calculated from one combined Workday record for each week.

Performance calculations and thresholds are centralized in:

```text
src/utils/profileMetrics.js
```

The interactive trend chart is implemented with accessible SVG and does not require a charting dependency.

## Tests

The test suite covers:

- Semester week calculations and boundaries
- Weekly task filtering and progress
- Completion persistence scope
- Workday status classification
- Manual-entry severity thresholds
- Aggregate Workday performance calculations
- Missing Workday data handling
- Note category validation, filtering, searching, sorting, and date formatting

## Data and Prototype Limitations

This repository is a frontend dashboard prototype. Profile, dashboard, and Workday records are generated local data. Weekly task completion and theme preferences use browser storage.

New supervisor notes currently remain in component state and do not persist after a full reload. Before production use, connect profiles, Workday records, notes, and task completion to authenticated backend endpoints with role-based authorization.

## Browser Support

Use a current version of Chrome, Edge, Firefox, or Safari. The interface is designed for desktop, tablet, and mobile viewport sizes.
