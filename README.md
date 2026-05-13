# LevelUp Habit Tracker

A local-first habit tracker that turns daily routines into a visual, gamified system.
Inspired by the "Hey Morning" spreadsheet pattern and *Atomic Habits* by James Clear.

## Quick start — browser

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

## Quick start — desktop app (Tauri)

LevelUp can also run as a native window via Tauri — no browser tab, its own
icon in the taskbar/Dock, same data.

### Windows
Double-click `desktop.bat`. First run installs Rust via winget if missing, then
opens LevelUp in a native window. Compile time on first launch is ~2–5 minutes.

### macOS
```bash
chmod +x desktop.sh
./desktop.sh
```

### Producing a distributable binary
- Windows: `desktop-build.bat` → `.exe` + MSI/NSIS installer in `src-tauri/target/release/bundle/`
- macOS: `./desktop-build.sh` → `.app` + `.dmg` in `src-tauri/target/release/bundle/`

The build step needs icons in `src-tauri/icons/`. Drop a 1024×1024 PNG at the
project root as `app-icon.png` and run `npm run tauri:icon -- ./app-icon.png`
once — that generates every required size.

## Stack
Vite · React · TypeScript · Tailwind CSS · Zustand · Recharts · date-fns ·
Tauri (optional desktop wrap). All data persists locally in `localStorage`
under the key `levelup.v1`. No accounts, no server.

## Project status
- [x] Phase 1 — Project scaffold
- [x] Phase 2 — Habit CRUD + persistence
- [x] Phase 3 — Daily / Weekly / Monthly views
- [x] Phase 4 — Analytics dashboard (streaks, charts)
- [x] Phase 4.5 — UI redesign (Trackkar aesthetic)
- [x] Phase 5 — Polish (dark mode, import/export, shortcuts, onboarding, daily report nudge)
- [x] Phase 6 — Tauri desktop wrap

## Keyboard shortcuts
- `1` `2` `3` `4` — switch Daily / Weekly / Monthly / Dashboard
- `←` `→` — previous / next date (or week / month in those views)
- `T` — jump to today
- `N` — new habit
- `S` — open settings

See `plan.md` for the full plan and `habit_tracker_project_description.md` for
the original product vision.
