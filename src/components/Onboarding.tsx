import { useState, type FormEvent } from 'react';
import { useHabitStore } from '../store/useHabitStore';

type Props = { onDone: () => void };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Onboarding({ onDone }: Props) {
  const completeOnboarding = useHabitStore((s) => s.completeOnboarding);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [time, setTime] = useState('20:00');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError('Please tell us your name.');
    if (!EMAIL_RE.test(email)) return setError('That email looks off.');
    if (!/^\d{2}:\d{2}$/.test(time)) return setError('Pick a time.');
    completeOnboarding({ name: name.trim(), email: email.trim(), reportTime: time });
    onDone();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden animate-splashIn"
      style={{
        background:
          'linear-gradient(180deg, #FDE7DB 0%, #FBF3EC 22%, #F6ECEF 55%, #EFE4F5 100%)',
      }}
    >
      <div className="blob bg-accent-cream -top-32 -left-32 w-[24rem] h-[24rem] animate-blobIn" />
      <div className="blob bg-accent-lilac -bottom-32 -right-32 w-[26rem] h-[26rem] animate-blobIn" style={{ animationDelay: '0.2s' }} />

      <form
        onSubmit={submit}
        className="card relative w-full max-w-md mx-4 p-7 md:p-8 space-y-5 shadow-soft animate-fadeUp"
        style={{ animationDelay: '0.2s' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div className="text-center space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent-purple font-medium">
            Let's set the stage
          </p>
          <h2 id="onboarding-title" className="display text-3xl md:text-4xl leading-tight">
            Welcome to{' '}
            <span className="italic text-accent-purple">LevelUp.</span>
          </h2>
          <p className="text-sm text-muted">
            A few quick details so your daily report knows where to land.
          </p>
        </div>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            placeholder="e.g. Tuhin"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">
            Daily report time
          </span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition"
          />
          <span className="block text-[11px] text-muted mt-1 leading-relaxed">
            At this time, LevelUp will surface a one-tap "send today's report"
            nudge that opens your mail client pre-filled. Fully unattended send
            needs a tiny local relay — see Settings.
          </span>
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full px-6 py-3 rounded-full bg-ink text-canvas font-medium hover:opacity-90 shadow-card transition active:scale-[0.98]"
        >
          Begin
        </button>
      </form>
    </div>
  );
}
