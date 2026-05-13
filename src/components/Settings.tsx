import { useRef, useState } from 'react';
import { useHabitStore } from '../store/useHabitStore';

type Props = { onClose: () => void };

export function Settings({ onClose }: Props) {
  const theme = useHabitStore((s) => s.settings.theme);
  const backupEmail = useHabitStore((s) => s.settings.backupEmail ?? '');
  const setTheme = useHabitStore((s) => s.setTheme);
  const setBackupEmail = useHabitStore((s) => s.setBackupEmail);
  const exportJSON = useHabitStore((s) => s.exportJSON);
  const importJSON = useHabitStore((s) => s.importJSON);
  const resetAll = useHabitStore((s) => s.resetAll);

  const [emailDraft, setEmailDraft] = useState(backupEmail);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onDownload = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `levelup-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setFeedback('Backup downloaded.');
  };

  const onMail = () => {
    if (!emailDraft) {
      setFeedback('Add an email first to send a backup.');
      return;
    }
    setBackupEmail(emailDraft);
    const json = exportJSON();
    const subject = encodeURIComponent(
      `LevelUp backup — ${new Date().toISOString().slice(0, 10)}`
    );
    const body = encodeURIComponent(
      `Your LevelUp habit data is below. Save it somewhere safe.\n\n${json}`
    );
    window.location.href = `mailto:${emailDraft}?subject=${subject}&body=${body}`;
    setFeedback('Opening your mail client...');
  };

  const onPickFile = () => fileRef.current?.click();

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const raw = await file.text();
    const result = importJSON(raw);
    if (result.ok) {
      setFeedback('Backup restored.');
    } else {
      setFeedback(`Import failed: ${result.error}`);
    }
    e.target.value = '';
  };

  const onReset = () => {
    if (
      confirm(
        'Reset everything? All habits, completions, and settings will be erased. This cannot be undone.'
      )
    ) {
      resetAll();
      setFeedback('All data cleared.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-md p-6 space-y-5 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <h3 className="display text-2xl">Settings</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted">
            Appearance
          </div>
          <div className="card flex gap-1 p-1 w-fit">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                theme === 'light'
                  ? 'bg-ink text-canvas'
                  : 'text-muted hover:text-ink'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                theme === 'dark'
                  ? 'bg-ink text-canvas'
                  : 'text-muted hover:text-ink'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted">
            Backup
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDownload}
              className="flex-1 px-4 py-2 rounded-full bg-ink text-canvas text-sm hover:opacity-90"
            >
              Download JSON
            </button>
            <button
              onClick={onPickFile}
              className="flex-1 px-4 py-2 rounded-full bg-white/70 text-ink text-sm border border-muted/25 hover:bg-white"
            >
              Restore from file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={onImport}
              className="hidden"
            />
          </div>

          <div className="pt-2">
            <label className="block">
              <span className="text-xs text-muted">Backup email</span>
              <input
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20"
              />
            </label>
            <button
              onClick={onMail}
              className="mt-2 w-full px-4 py-2 rounded-full bg-accent-purple text-white text-sm hover:opacity-90"
            >
              Email backup to this address
            </button>
            <p className="text-[11px] text-muted mt-2 leading-relaxed">
              Opens your mail client with the backup attached as JSON in the
              body. Fully automatic email sending would need a tiny local mail
              relay — out of scope for an offline-only app.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted">
            Danger zone
          </div>
          <button
            onClick={onReset}
            className="w-full px-4 py-2 rounded-full bg-red-700/10 text-red-700 text-sm hover:bg-red-700/20"
          >
            Reset all data
          </button>
        </div>

        {feedback && (
          <p className="text-sm text-accent-purple text-center">{feedback}</p>
        )}

        <p className="text-[11px] text-muted text-center pt-2">
          Shortcuts: 1–4 switch tabs · ← → change date · T = today · N = new
          habit · S = settings
        </p>
      </div>
    </div>
  );
}
