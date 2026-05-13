# Plan: LevelUp Habit Tracker — Local Running App

This plan translates `habit_tracker_project_description.md` from a spreadsheet concept into a locally-runnable web application that preserves the gamification, visual progress, and all-in-one dashboard goals.

## 1. Stack Decision

**Recommended: Vite + React + TypeScript, persisted with `localStorage` / IndexedDB.**

- **Why Vite + React:** Fast dev server, instant HMR, zero backend needed for a single-user local app. Matches the "offline editing" requirement out of the box.
- **Why local storage:** No server, no accounts, no DB install. Data lives in the browser profile and survives reloads. Export/import JSON gives a manual backup story.
- **Charts:** `recharts` (bar graphs + radial progress rings) — simple API, matches the dashboard need.
- **Styling:** Tailwind CSS for the minimalistic, soft-palette aesthetic.
- **State:** Zustand (lighter than Redux, persists trivially via middleware).

**Alternatives considered:**
- *Electron desktop app:* True native window, but heavier setup. Skip unless a `.exe` is required later — Vite app can be wrapped in Electron/Tauri afterward.
- *Plain HTML/JS:* Simpler but harder to scale to 99 habits + charts cleanly.

## 2. Data Model

```ts
type Habit = {
  id: string;
  name: string;
  category: string;       // e.g. Health, Work, Personal
  icon: string;           // emoji or icon key
  color: string;          // hex for cell tinting
  targetPerWeek?: number; // optional weekly goal
  createdAt: string;      // ISO date
  archived: boolean;
};

type Completion = {
  habitId: string;
  date: string;           // YYYY-MM-DD, one entry per day completed
};

type AppState = {
  habits: Habit[];
  completions: Completion[];
  settings: { theme: 'light' | 'dark'; weekStartsOn: 0 | 1 };
};
```

Persisted under one `localStorage` key (`levelup.v1`). Migration version field for future schema bumps.

## 3. Feature Breakdown → Implementation Steps

### Phase 1 — Project scaffold
1. `npm create vite@latest habit-tracker -- --template react-ts`
2. Install: `tailwindcss postcss autoprefixer zustand recharts date-fns nanoid`
3. Init Tailwind, set up soft color palette tokens (off-white background, pastel accents).
4. Create folder layout: `src/components`, `src/store`, `src/lib`, `src/pages`.

### Phase 2 — Core habit CRUD
1. Zustand store with `addHabit`, `editHabit`, `archiveHabit`, `toggleCompletion(habitId, date)`.
2. Habit list panel — supports up to 99 entries with virtualized scroll if needed.
3. Add/edit modal: name, category, icon picker (emoji), color.
4. Persist middleware writing to `localStorage`.

### Phase 3 — Daily / Weekly / Monthly views
1. **Daily view:** Today's habits as a checklist with one-tap toggle.
2. **Weekly view:** Grid (habits × 7 days) with color-coded cells (the "progress you can see" requirement).
3. **Monthly view:** Calendar heatmap per habit, plus an aggregate month grid.
4. Shared date navigator (prev/next, jump-to-today).

### Phase 4 — Analytics dashboard
1. **Streak engine:** `getCurrentStreak(habitId)` and `getLongestStreak(habitId)` computed from completions.
2. **Completion rate:** per-habit and overall, for 7/30/90-day windows.
3. **Charts:**
   - Bar graph: completions per habit for the selected period.
   - Circular ring: daily/weekly completion percentage.
   - Category breakdown: stacked bar.
4. **Performance breakdown:** highlight top 3 consistent habits and bottom 3 lagging habits.

### Phase 4.5 — UI redesign to match the Trackkar aesthetic

Reference: `screencapture-trackkar-store-2026-05-14-01_50_26.png`. The current
app is functional but utilitarian. This phase lifts the visual language to the
same warmth and "game-like" softness as the reference landing page so the
product *feels* aspirational, not just useful.

**Design language to adopt**
- **Backdrop:** soft full-page gradient — pale peach/pink at the top fading
  through cream into a lilac/lavender wash at the bottom. The current solid
  `#FBF8F4` canvas reads cold next to the reference.
- **Type pairing:** a humanist serif (e.g. *Fraunces*, *DM Serif Display*, or
  *Playfair Display*) for hero headlines and section titles, with italic used
  as a flourish ("Turn your life *into a game*"). Body and UI text stay in
  Inter. Heading sizes step up — h1 ~48–56px on desktop, generous letter
  spacing.
- **Cards:** rounded-2xl, near-white surfaces (`rgba(255,255,255,0.7)`) with a
  soft shadow + a 1px translucent border. No hard edges anywhere.
- **CTA buttons:** dark navy/ink pill with white text, slight shadow, larger
  vertical padding (`py-3 px-6`). Mirror the "Download Habit Tracker" button.
- **Accent purple:** add `#6B5BD1` / `#A89AE8` to the palette for checkmarks,
  links, and focus rings — currently only mint/peach/sky exist.
- **Decorative softness:** large blurred pastel blobs behind hero content
  (`filter: blur(80px)`, low opacity) for the landing-page feel.
- **Sectioning:** centered serif headlines with a small uppercase muted
  sub-tagline above them, then content — copy the reference's vertical rhythm.

**Concrete changes**

1. **Global**
   - Update `tailwind.config.js`: add `accent.purple`, `accent.cream`,
     `accent.blush`; register a serif `font-display` family; extend
     `boxShadow` with a soft `card` preset.
   - Add Google Fonts link for the serif + Inter to `index.html`.
   - Replace the flat `bg-canvas` body with a gradient applied in `index.css`
     (`background: linear-gradient(180deg, #FDE7DB 0%, #FBF8F4 30%, #EFE4F5 100%);`).

2. **Header / hero**
   - Replace the current utilitarian header with a centered hero block:
     serif h1 "LevelUp" with an italicised tagline ("*systems over
     motivation*"), today's date as a small muted pill below.
   - Move `TabNav` to sit on a translucent capsule under the hero, centered.

3. **Empty state (no habits)**
   - Reframe as a landing-style hero: large serif "Turn your day *into a
     game.*", short subline, primary pill CTA "Add your first habit", and
     a supporting micro-feature list with purple checkmarks (mirrors the
     "Everything you need to stay consistent" block in the reference).

4. **Daily view**
   - Habit rows: keep the left color bar but switch row background to
     `rgba(255,255,255,0.7)` with the card shadow. Increase row height,
     bump icon size, set name in medium-weight Inter and category in
     uppercase tracking-wide muted micro-copy.
   - The toggle circle becomes the focal element: 44px, soft inner shadow
     when undone, full habit-color fill with a white checkmark when done.

5. **Weekly view**
   - Wrap the grid in a card. Add weekday header chips. Day columns get a
     subtle today-column highlight (vertical tinted stripe behind the
     cells). Cells switch from `bg-muted/10` to translucent off-white with
     a 1px border so the colored ones pop.

6. **Monthly view**
   - Calendar cells become softer: bigger radius (`rounded-xl`), pastel
     base, completion fill replaced with a gradient from blush → purple as
     completion % climbs (matches the reference's pink → lilac vibe).
   - Header shows the month name in the serif display font.

7. **Dashboard view**
   - Stat tiles: drop the top accent border in favor of a tinted accent halo
     behind the value number. Numbers in the serif font, large.
   - `ProgressRing` recolored to purple/mint duotone with a serif percent
     label.
   - Charts get a translucent card wrapper; tooltip styled with a serif title
     and soft shadow.

8. **Form modal**
   - Replace solid `bg-canvas` with the same translucent card surface and
     soft shadow. Header in serif font. Color and icon pickers become larger,
     more tactile (44px hit targets).

9. **Tone / copy pass**
   - Header: "Systems over motivation." → keep, set in italic serif.
   - Empty state hero copy borrows the "Stay consistent. Build momentum." tone.
   - Optional gamified micro-toast after toggling ("+1 to streak", "Day
     saved") gated behind a setting so it doesn't get noisy.

**Out of scope for 4.5**
- Animations beyond CSS transitions (saved for a later motion pass).
- Mobile layout fixes beyond what naturally falls out of the redesign
  (Phase 5 owns responsive polish).
- Bitmap imagery — the reference uses product screenshots; we won't import
  any, only style with CSS/SVG.

**Acceptance criteria**
- A first-time visitor with zero habits sees a hero that *visually* recalls
  the Trackkar landing page (gradient, serif headline, pill CTA).
- Every page shares a unified card style and gradient backdrop.
- No raw white blocks remain against `#FBF8F4` anywhere.
- The accent purple is wired into the Tailwind theme and used in at least
  checkmarks, focus rings, and the progress ring.

### Phase 5 — Polish & UX
1. Onboarding: empty-state with "Add your first habit" CTA — the "start in under 2 minutes" promise.
2. Keyboard shortcuts (space to toggle today's selected habit).
3. Responsive layout — mobile-friendly grid that collapses to a single column.
4. Dark mode toggle.
5. Import/export JSON (manual backup + portability between machines).

### Phase 6 — Optional packaging
- If a desktop binary is wanted later: wrap with **Tauri** (smaller than Electron, native Windows `.exe`).

## 4. Folder Layout

```
habit-tracker/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── store/useHabitStore.ts
│   ├── lib/
│   │   ├── streaks.ts
│   │   ├── dates.ts
│   │   └── storage.ts
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── HabitList.tsx
│   │   ├── HabitRow.tsx
│   │   ├── HabitForm.tsx
│   │   ├── WeekGrid.tsx
│   │   ├── MonthHeatmap.tsx
│   │   ├── StreakBadge.tsx
│   │   └── charts/
│   │       ├── CompletionBar.tsx
│   │       └── ProgressRing.tsx
│   └── pages/
│       ├── DailyView.tsx
│       ├── WeeklyView.tsx
│       └── MonthlyView.tsx
└── plan.md
```

## 5. Running Locally

```bash
cd habit-tracker
npm install
npm run dev          # opens http://localhost:5173
npm run build        # production bundle in dist/
npm run preview      # serve the production bundle locally
```

All data stays in the browser. No internet required after `npm install`.

## 6. Open Questions / Decisions Before Coding

- **99-habit ceiling:** keep the hard cap from the spec, or leave unlimited and document 99 as the recommended max? User Answer: 99 Should be max
- **Single profile vs. multiple users on one machine:** localStorage scopes to browser profile — confirm that's enough. User answer: 1 user only
- **Categories:** fixed presets (Health/Work/Personal) or user-defined from the start? User answer: Fixed presets
- **Backup cadence:** auto-download a JSON snapshot weekly, or rely on manual export? User Answer: can we send it to our defined mail automatically.

## 7. Milestone Order (suggested)

1. Phase 1 + 2 → working app that adds habits and toggles today's completion.
2. Phase 3 weekly grid → the visual centerpiece.
3. Phase 4 streaks + one chart → enough analytics to feel gamified.
4. Phase 3 monthly heatmap + Phase 4 remaining charts.
5. Phase 5 polish.
6. Phase 6 only if a desktop binary is requested.
