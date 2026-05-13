import { useEffect, useState } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { buildDailyReport } from '../lib/dailyReport';
import { toDateKey } from '../lib/dates';
import { sendEmail, isEmailJSConfigured } from '../lib/emailService';
import { toast } from './Toast';

function currentHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
}

/** Format seconds into "Xh Ym" or "Ym Zs" countdown string */
function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return 'now';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/** Get seconds until a target HH:MM time today. Returns 0 if already past. */
function secondsUntil(targetHHMM: string): number {
  const [h, m] = targetHHMM.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
  return Math.max(0, diff);
}

export function DailyReportBanner() {
  const name = useHabitStore((s) => s.settings.name);
  const email = useHabitStore((s) => s.settings.backupEmail);
  const reportTime = useHabitStore((s) => s.settings.reportTime);
  const lastSent = useHabitStore((s) => s.settings.lastReportSentDate);
  const emailjsConfig = useHabitStore((s) => s.settings.emailjs);
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const markReportSent = useHabitStore((s) => s.markReportSent);

  const [now, setNow] = useState(() => currentHHMM());
  const [countdown, setCountdown] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  const today = toDateKey();
  const alreadySent = lastSent === today;
  const canDirectSend = isEmailJSConfigured(emailjsConfig);

  // Update clock and countdown every second
  useEffect(() => {
    if (!reportTime || !email) return;

    const tick = () => {
      setNow(currentHHMM());
      setCountdown(secondsUntil(reportTime));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [reportTime, email]);

  const isPastReportTime = reportTime ? now >= reportTime : false;

  // Don't render if not configured
  if (!email || !reportTime) return null;
  if (dismissed && alreadySent) return null;

  const doSend = async () => {
    const { subject, body } = buildDailyReport(name, habits, completions, today);

    if (canDirectSend) {
      setSending(true);
      const result = await sendEmail(emailjsConfig!, email, subject, body);
      setSending(false);
      if (result.ok) {
        markReportSent(today);
        toast('Daily report sent successfully! ✉️', 'success');
      } else {
        toast(`Failed to send: ${result.error}`, 'error');
      }
    } else {
      // Fallback to mailto
      const href = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      markReportSent(today);
      window.location.href = href;
      toast('Opening mail client with your daily report…', 'info');
    }
  };

  // Already sent state — with send again option
  if (alreadySent) {
    return (
      <div className="card flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 px-4 mb-6 shadow-card animate-fadeUp border-l-4 border-accent-mint">
        <span className="text-2xl shrink-0" aria-hidden="true">✅</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            Today's report sent!
          </div>
          <div className="text-xs text-muted truncate">
            Delivered to {email}
          </div>
        </div>
        <button
          onClick={doSend}
          disabled={sending}
          className="px-4 py-2 rounded-full bg-muted/10 text-sm font-medium hover:bg-muted/20 shrink-0 transition active:scale-[0.97] disabled:opacity-50"
        >
          {sending ? '⏳ Sending…' : '🔄 Send again'}
        </button>
      </div>
    );
  }

  // Waiting / ready state
  return (
    <div
      className={`card flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 px-4 mb-6 shadow-card animate-fadeUp ${
        isPastReportTime ? 'animate-gentlePulse border-l-4 border-accent-purple' : ''
      }`}
      role={isPastReportTime ? 'alert' : undefined}
    >
      <span className="text-2xl shrink-0" aria-hidden="true">
        {isPastReportTime ? '📬' : '⏳'}
      </span>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {isPastReportTime
            ? name ? `${name}, it's report time!` : "It's report time!"
            : 'Daily report scheduled'}
        </div>
        <div className="text-xs text-muted truncate">
          {isPastReportTime
            ? `Send today's progress to ${email}`
            : (
              <>
                Auto-nudge in{' '}
                <span className="text-accent-purple font-semibold tabular-nums">
                  {formatCountdown(countdown)}
                </span>
                {' '}at {reportTime}
              </>
            )}
        </div>
        {!canDirectSend && (
          <div className="text-[10px] text-muted/60 mt-0.5">
            Set up EmailJS in Settings for direct sending
          </div>
        )}
      </div>

      <button
        onClick={doSend}
        disabled={sending}
        className="px-4 py-2 rounded-full bg-accent-purple text-white text-sm font-medium hover:opacity-90 shadow-card shrink-0 transition active:scale-[0.97] disabled:opacity-50"
        title={isPastReportTime ? 'Send report now' : 'Send report early'}
      >
        {sending ? '⏳ Sending…' : isPastReportTime ? '📧 Send now' : '📧 Send early'}
      </button>

      {isPastReportTime && (
        <button
          onClick={() => setDismissed(true)}
          className="text-muted hover:text-ink dark:hover:text-canvas px-2 shrink-0 transition"
          aria-label="Dismiss"
          title="Dismiss for now"
        >
          ×
        </button>
      )}
    </div>
  );
}
