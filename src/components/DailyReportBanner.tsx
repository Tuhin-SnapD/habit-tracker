import { useEffect, useState } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { buildDailyReport } from '../lib/dailyReport';
import { toDateKey } from '../lib/dates';

function currentHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
}

export function DailyReportBanner() {
  const name = useHabitStore((s) => s.settings.name);
  const email = useHabitStore((s) => s.settings.backupEmail);
  const reportTime = useHabitStore((s) => s.settings.reportTime);
  const lastSent = useHabitStore((s) => s.settings.lastReportSentDate);
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const markReportSent = useHabitStore((s) => s.markReportSent);

  const [now, setNow] = useState(() => currentHHMM());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(currentHHMM()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!email || !reportTime) return null;
  if (dismissed) return null;

  const today = toDateKey();
  if (lastSent === today) return null;
  if (now < reportTime) return null;

  const send = () => {
    const { subject, body } = buildDailyReport(name, habits, completions, today);
    const href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    markReportSent(today);
    window.location.href = href;
  };

  return (
    <div className="card flex items-center gap-3 p-3 px-4 mb-6 shadow-card animate-fadeUp">
      <span className="text-2xl">📬</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {name ? `${name}, it's report time.` : "It's report time."}
        </div>
        <div className="text-xs text-muted truncate">
          Send today's progress to {email}.
        </div>
      </div>
      <button
        onClick={send}
        className="px-4 py-1.5 rounded-full bg-accent-purple text-white text-sm hover:opacity-90 shadow-card shrink-0"
      >
        Send
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted hover:text-ink px-2 shrink-0"
        aria-label="Dismiss"
        title="Dismiss for now"
      >
        ×
      </button>
    </div>
  );
}
