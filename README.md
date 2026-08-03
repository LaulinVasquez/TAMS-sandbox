# TAMS Dashboard

TAMS is a responsive React dashboard prototype for managing teaching assistants and supervisor workflows. It includes a supervisor dashboard, TA directory and profiles, theme controls, and a semester-aware weekly task schedule.

## Features

- Supervisor dashboard with performance, survey, hours, and action summaries
- TA directory and individual profile views
- Weekly task schedule calculated from a configurable semester start date
- Support for `T-2`, `T-1`, and semester Weeks 1–14
- Role-based task filtering for supervisors
- Week previews with current, completed, and future states
- Per-supervisor, semester, week, and task completion persistence
- Live weekly progress calculations
- Light and dark themes
- Collapsible responsive navigation
- Accessible controls and reduced-motion support

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

Run the automated tests:

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
├── components/
│   ├── dashboard/        # Dashboard cards and weekly schedule components
│   ├── layout/           # Sidebar and top navigation
│   ├── profile/          # TA profile tabs and metrics
│   └── ui/               # Shared card and progress components
├── data/                 # Dashboard, profile, and weekly schedule data
├── pages/                # Dashboard, directory, and profile views
├── styles/               # Global and Tailwind styles
├── utils/                # Semester calculations and persistence helpers
├── App.jsx               # Application shell and view state
└── main.jsx              # React entry point
tests/                    # Unit and persistence tests
```

## Weekly Schedule Configuration

The semester schedule data lives in:

```text
src/data/weeklyTaskSchedule.js
```

Update the configured semester start date and structured task data there when preparing a new semester. Week calculations and task filtering are implemented in `src/utils/weeklySchedule.js`.

Task completion currently uses a local-storage adapter in `src/utils/weeklyTaskStorage.js`. Completion keys are scoped by supervisor, semester, and week so one user's progress does not overwrite another's.

## Data and Prototype Limitations

This repository is a frontend dashboard prototype. Profile and dashboard records are local structured data, and task completion is stored in the current browser rather than a production database. Clearing browser site data removes saved task completion and theme preferences.

Before production use, replace the local persistence adapter with authenticated backend endpoints that verify supervisor access.

## Browser Support

Use a current version of Chrome, Edge, Firefox, or Safari. The interface is designed for desktop, tablet, and mobile viewport sizes.

