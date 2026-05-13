# LevelUp Habit Tracker

A local-first habit tracker that turns daily routines into a visual, gamified system.
Inspired by the "Hey Morning" spreadsheet pattern and *Atomic Habits* by James Clear.

## Quick start

### Windows
Double-click `start.bat`. The script installs Node.js (via winget) if missing,
installs npm dependencies on first run, and launches the app at
`http://localhost:5173`.

### macOS
```bash
chmod +x start.sh
./start.sh
```
The script installs Node.js (via Homebrew) if missing, installs dependencies on
first run, and launches the app at `http://localhost:5173`.

### Manual
```bash
npm install
npm run dev
```

## Stack
Vite · React · TypeScript · Tailwind CSS · Zustand · Recharts · date-fns.
All data persists locally in your browser's `localStorage` under the key
`levelup.v1`. No accounts, no server.

## Project status
- [x] Phase 1 — Project scaffold
- [x] Phase 2 — Habit CRUD + persistence
- [ ] Phase 3 — Daily / Weekly / Monthly views
- [ ] Phase 4 — Analytics dashboard (streaks, charts)
- [ ] Phase 5 — Polish (onboarding, dark mode, import/export)
- [ ] Phase 6 — Optional Tauri desktop wrap

See `plan.md` for the full plan and `habit_tracker_project_description.md` for
the original product vision.
