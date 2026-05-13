<p align="center">
  <img src="https://img.shields.io/badge/LevelUp-Habit%20Tracker-6B5BD1?style=for-the-badge&labelColor=1F1B2D" alt="LevelUp Habit Tracker" />
</p>

<h1 align="center">LevelUp Habit Tracker</h1>

<p align="center">
  <em>A beautiful, local-first habit tracker that turns daily routines into a visual, gamified system.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Tauri-2-FFC131?logo=tauri&logoColor=white" alt="Tauri 2" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Habit Tracking** | Track up to 99 habits with categories, icons, and colors |
| 📅 **Multi-View** | Daily, Weekly, Monthly calendar views with interactive grids |
| 📊 **Insights Dashboard** | Streaks, completion rates, per-category breakdowns, top/bottom performers |
| 🌙 **Dark Mode** | Full dark theme with seamless toggle |
| ⌨️ **Keyboard Shortcuts** | Navigate views, create habits, and change dates without touching the mouse |
| 📧 **Daily Reports** | Scheduled email reports with live countdown and direct send via EmailJS |
| 💾 **Local-First** | All data stays in `localStorage` — no accounts, no server, no tracking |
| 📤 **Backup & Restore** | Export/import JSON backups, email backups to yourself |
| 🖥️ **Desktop App** | Optional native window via Tauri — same app, own taskbar icon |
| ♿ **Accessible** | Focus trapping, ARIA roles, keyboard navigation, skip-to-content |

---

## 🚀 Quick Start

### Browser (recommended)

**Windows** — double-click `start.bat`  
**macOS** — `chmod +x start.sh && ./start.sh`  
**Manual** —
```bash
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).

### Desktop App (Tauri)

> Requires [Rust](https://rustup.rs/) and [Visual Studio Build Tools](https://aka.ms/vs/17/release/vs_BuildTools.exe) (Windows) or Xcode CLI tools (macOS).

**Windows** — `desktop-app\desktop.bat`  
**macOS** — `chmod +x desktop-app/desktop.sh && ./desktop-app/desktop.sh`

First launch compiles Rust (~2-5 min). Subsequent launches are instant.

#### Building a distributable binary

```bash
# Generate app icons first (one time)
npm run tauri:icon -- ./app-icon.png

# Build installer
desktop-app/desktop-build.bat   # Windows → .exe + MSI in src-tauri/target/release/bundle/
./desktop-app/desktop-build.sh  # macOS   → .app + .dmg
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build** | Vite 5 |
| **Styling** | Tailwind CSS 3 + custom glassmorphism design system |
| **State** | Zustand (persisted to `localStorage` under `levelup.v1`) |
| **Charts** | Recharts |
| **Dates** | date-fns |
| **Email** | @emailjs/browser (optional direct send) |
| **Desktop** | Tauri 2 (optional native wrap) |
| **Fonts** | Inter + Fraunces (Google Fonts) |

---

## 📁 Project Structure

```
├── src/
│   ├── components/         # UI components
│   │   ├── charts/         # ProgressRing, CompletionBar, CategoryBar
│   │   ├── Toast.tsx        # Global toast notification system
│   │   ├── ConfirmDialog.tsx # Themed confirmation dialogs
│   │   ├── HabitRow.tsx     # Individual habit with toggle animation
│   │   ├── HabitForm.tsx    # Create/edit habit modal
│   │   ├── Settings.tsx     # App settings, backup, EmailJS config
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useFocusTrap.ts  # Modal focus trapping
│   │   ├── useActiveSection.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── lib/                # Pure utilities
│   │   ├── streaks.ts       # Optimized streak/stats computation
│   │   ├── dates.ts         # Date math helpers
│   │   ├── emailService.ts  # EmailJS integration
│   │   └── dailyReport.ts   # Report builder
│   ├── pages/              # Section views
│   │   ├── DailyView.tsx
│   │   ├── WeeklyView.tsx
│   │   ├── MonthlyView.tsx
│   │   └── DashboardView.tsx
│   ├── store/              # Zustand stores
│   │   ├── useHabitStore.ts # Habits, completions, settings
│   │   └── useUIStore.ts    # Selected date, transient UI state
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css           # Design system tokens
├── desktop-app/            # Tauri launch/build scripts
├── src-tauri/              # Tauri Rust backend
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` `2` `3` `4` | Jump to Today / Week / Month / Insights |
| `←` `→` | Navigate date (day, week, or month depending on view) |
| `T` | Jump to today |
| `N` | Create new habit |
| `S` | Open settings |
| `Esc` | Close any open modal |

---

## 📧 Email Reports Setup

LevelUp can send daily progress reports directly from the browser using [EmailJS](https://www.emailjs.com/) (free tier: 200 emails/month).

1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Create an **Email Service** (Gmail, Outlook, etc.)
3. Create a **Template** with these variables:
   - `{{to_email}}` — recipient address
   - `{{subject}}` — email subject line
   - `{{message}}` — report body
4. Go to **Settings** in LevelUp → paste your **Service ID**, **Template ID**, and **Public Key**
5. Reports will now send directly — no mail client popup

Without EmailJS configured, the app falls back to `mailto:` links (opens your default mail client).

---

## 🎨 Design System

The app uses a custom glassmorphism-based design system:

- **Colors**: Soft pastels (mint, peach, lilac, sky, rose) with accent purple `#6B5BD1`
- **Cards**: Frosted glass effect with `backdrop-filter: blur(8px)`
- **Typography**: Inter (UI) + Fraunces (display headings)
- **Animations**: fadeUp, checkBounce, gentlePulse, toastIn, splashIn/Out
- **Dark Mode**: Deep purple backgrounds with adjusted opacity and contrast

---

## 🔒 Privacy

- **Zero tracking** — no analytics, no telemetry, no cookies
- **Local-only** — all data lives in your browser's `localStorage`
- **No accounts** — no sign-up, no login, no server
- **Your data** — export anytime as JSON, import on any browser

---

## 📋 Development Phases

- [x] Phase 1 — Project scaffold (Vite + React + TypeScript)
- [x] Phase 2 — Habit CRUD + localStorage persistence
- [x] Phase 3 — Daily / Weekly / Monthly views
- [x] Phase 4 — Analytics dashboard (streaks, charts, insights)
- [x] Phase 4.5 — UI redesign (glassmorphism aesthetic)
- [x] Phase 5 — Polish (dark mode, import/export, shortcuts, onboarding, daily reports)
- [x] Phase 6 — Tauri desktop wrap
- [x] Phase 7 — Production hardening (performance, accessibility, responsive, bug fixes)

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

<p align="center">
  <sub>Inspired by <em>Atomic Habits</em> by James Clear. Built with ❤️ and consistency.</sub>
</p>
