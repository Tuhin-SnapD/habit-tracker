import { useEffect, useState } from 'react';

const QUOTES = [
  'Systems matter more than motivation.',
  'Every checkmark builds momentum.',
  "You don't rise to the level of your goals.\nYou fall to the level of your systems.",
  'Small wins, every single day.',
  'Turn your day into a game.',
  'Consistency beats intensity.',
  'Tiny habits compound into a different life.',
  'Progress you can see.',
  'Show up. Stack the day.',
  'One percent better, every day.',
];

const HOLD_MS = 2800;
const EXIT_MS = 750;

type Props = { onDone: () => void };

export function SplashScreen({ onDone }: Props) {
  const [quote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)]
  );
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const startExit = window.setTimeout(() => setLeaving(true), HOLD_MS);
    const finish = window.setTimeout(onDone, HOLD_MS + EXIT_MS);
    return () => {
      window.clearTimeout(startExit);
      window.clearTimeout(finish);
    };
  }, [onDone]);

  // Click anywhere to skip
  const handleSkip = () => {
    if (!leaving) {
      setLeaving(true);
      setTimeout(onDone, 300);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden cursor-pointer select-none ${
        leaving ? 'animate-splashOut' : 'animate-splashIn'
      }`}
      style={{
        background:
          'linear-gradient(180deg, #FDE7DB 0%, #FBF3EC 22%, #F6ECEF 55%, #EFE4F5 100%)',
      }}
      onClick={handleSkip}
      role="status"
      aria-label="Loading LevelUp"
    >
      <div
        className="blob bg-accent-cream -top-40 -left-40 w-[28rem] h-[28rem] animate-blobIn"
        style={{ animationDelay: '0.05s' }}
      />
      <div
        className="blob bg-accent-lilac -bottom-40 -right-40 w-[32rem] h-[32rem] animate-blobIn"
        style={{ animationDelay: '0.2s' }}
      />
      <div
        className="blob bg-accent-blush top-1/3 left-1/2 -translate-x-1/2 w-[26rem] h-[26rem] opacity-40 animate-blobIn"
        style={{ animationDelay: '0.35s' }}
      />

      <div
        className={`relative text-center px-6 max-w-3xl space-y-8 ${
          leaving ? 'animate-contentLift' : ''
        }`}
      >
        <p
          className="text-sm md:text-base uppercase tracking-[0.42em] text-accent-purple font-semibold animate-fadeIn"
          style={{ animationDelay: '0.15s' }}
        >
          Welcome back
        </p>
        <h1
          className="display font-semibold text-7xl md:text-9xl leading-[0.95] animate-titleIn"
          style={{ animationDelay: '0.3s' }}
        >
          Level<span className="italic text-accent-purple">Up</span>
        </h1>
        <p
          className="display italic font-medium text-2xl md:text-4xl text-ink/80 leading-snug whitespace-pre-line animate-fadeUp"
          style={{ animationDelay: '0.75s', maxWidth: '40rem', margin: '0 auto' }}
        >
          {`"${quote}"`}
        </p>
        <p
          className="text-xs text-muted/60 animate-fadeIn"
          style={{ animationDelay: '1.2s' }}
        >
          click anywhere to skip
        </p>
      </div>
    </div>
  );
}
