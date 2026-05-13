import { useEffect, useState, useCallback } from 'react';
import { useHabitStore } from './store/useHabitStore';
import { SectionNav } from './components/SectionNav';
import { DailySection } from './pages/DailyView';
import { WeekSection } from './pages/WeeklyView';
import { MonthSection } from './pages/MonthlyView';
import { InsightsSection } from './pages/DashboardView';
import { Settings } from './components/Settings';
import { HabitForm } from './components/HabitForm';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { DailyReportBanner } from './components/DailyReportBanner';
import { ToastContainer } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { toDateKey } from './lib/dates';
import { format } from 'date-fns';

export default function App() {
  const theme = useHabitStore((s) => s.settings.theme);
  const onboarded = useHabitStore((s) => s.settings.onboarded ?? false);
  const userName = useHabitStore((s) => s.settings.name);

  // Reactive today — updates every 60s so midnight rollover works
  const [today, setToday] = useState(() => format(new Date(), 'EEEE, MMMM d'));
  useEffect(() => {
    const id = window.setInterval(() => {
      setToday(format(new Date(), 'EEEE, MMMM d'));
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const [splashDone, setSplashDone] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newHabitOpen, setNewHabitOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Close modals on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (newHabitOpen) {
          setNewHabitOpen(false);
          e.stopPropagation();
        } else if (settingsOpen) {
          setSettingsOpen(false);
          e.stopPropagation();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [settingsOpen, newHabitOpen]);

  const handleNewHabit = useCallback(() => setNewHabitOpen(true), []);
  const handleOpenSettings = useCallback(() => setSettingsOpen(true), []);

  useKeyboardShortcuts({
    onNewHabit: handleNewHabit,
    onOpenSettings: handleOpenSettings,
  });

  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  // Derive onboarding state directly from store so resets/imports are reflected
  if (!onboarded) {
    return <Onboarding onDone={() => {}} />;
  }

  return (
    <div className="min-h-screen relative animate-appIn">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="blob bg-accent-cream -top-32 -left-32 w-96 h-96" />
        <div className="blob bg-accent-lilac top-1/3 -right-32 w-[28rem] h-[28rem]" />
        <div className="blob bg-accent-blush top-2/3 -left-32 w-[26rem] h-[26rem] opacity-40" />
      </div>

      <header className="relative px-6 pt-10 pb-8">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-accent-purple font-medium">
            {today}
          </p>
          <h1 className="display text-5xl md:text-6xl leading-none">
            Level<span className="italic text-accent-purple">Up</span>
          </h1>
          <p className="display italic text-muted text-lg">
            {userName ? `welcome back, ${userName}.` : 'systems over motivation.'}
          </p>
        </div>
        <button
          onClick={handleOpenSettings}
          className="card absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-muted hover:text-ink dark:hover:text-canvas transition"
          aria-label="Settings"
          title="Settings (press S)"
        >
          ⚙
        </button>
      </header>

      <div className="sticky top-2 z-30 px-4 mb-4">
        <SectionNav />
      </div>

      <main id="main-content" className="relative max-w-5xl mx-auto px-4 md:px-6 pb-20">
        <div className="max-w-3xl mx-auto mb-6">
          <DailyReportBanner />
        </div>

        <div className="space-y-16">
          <DailySection />
          <WeekSection />
          <MonthSection />
          <InsightsSection />
        </div>

        <footer className="text-center text-[11px] text-muted/70 mt-20 space-y-1">
          <p>Shortcuts: 1–4 jump · ← → date · T today · N new · S settings</p>
          <p>{toDateKey()}</p>
        </footer>
      </main>

      {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}
      {newHabitOpen && (
        <HabitForm
          editingId={null}
          onClose={() => setNewHabitOpen(false)}
        />
      )}

      <ToastContainer />
      <ConfirmDialog />
    </div>
  );
}
