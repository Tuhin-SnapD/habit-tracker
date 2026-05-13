import { useRef, useState, useEffect } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { toast } from './Toast';
import { confirm } from './ConfirmDialog';
import { isEmailJSConfigured } from '../lib/emailService';

type Props = { onClose: () => void };

export function Settings({ onClose }: Props) {
  const theme = useHabitStore((s) => s.settings.theme);
  const backupEmail = useHabitStore((s) => s.settings.backupEmail ?? '');
  const emailjsConfig = useHabitStore((s) => s.settings.emailjs);
  const setTheme = useHabitStore((s) => s.setTheme);
  const setBackupEmail = useHabitStore((s) => s.setBackupEmail);
  const setEmailJSConfig = useHabitStore((s) => s.setEmailJSConfig);
  const exportJSON = useHabitStore((s) => s.exportJSON);
  const importJSON = useHabitStore((s) => s.importJSON);
  const resetAll = useHabitStore((s) => s.resetAll);
  const trapRef = useFocusTrap<HTMLDivElement>();

  const [emailDraft, setEmailDraft] = useState(backupEmail);
  const [ejsServiceId, setEjsServiceId] = useState(emailjsConfig?.serviceId ?? '');
  const [ejsTemplateId, setEjsTemplateId] = useState(emailjsConfig?.templateId ?? '');
  const [ejsPublicKey, setEjsPublicKey] = useState(emailjsConfig?.publicKey ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  const ejsConfigured = isEmailJSConfigured(emailjsConfig);

  const saveEmailJSConfig = () => {
    if (!ejsServiceId.trim() || !ejsTemplateId.trim() || !ejsPublicKey.trim()) {
      toast('Please fill in all three EmailJS fields.', 'error');
      return;
    }
    setEmailJSConfig({
      serviceId: ejsServiceId.trim(),
      templateId: ejsTemplateId.trim(),
      publicKey: ejsPublicKey.trim(),
    });
    toast('EmailJS configured — reports will send directly!', 'success');
  };

  const onDownload = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `levelup-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast('Backup downloaded successfully.', 'success');
  };

  const onMail = () => {
    if (!emailDraft) {
      toast('Add an email first to send a backup.', 'error');
      return;
    }
    setBackupEmail(emailDraft);
    const json = exportJSON();

    if (json.length > 1800) {
      toast('Large backup — your mail client may truncate the body. Prefer downloading JSON.', 'info');
    }

    const subject = encodeURIComponent(
      `LevelUp backup — ${new Date().toISOString().slice(0, 10)}`
    );
    const body = encodeURIComponent(
      `Your LevelUp habit data is below. Save it somewhere safe.\n\n${json}`
    );
    window.location.href = `mailto:${emailDraft}?subject=${subject}&body=${body}`;
    toast('Opening your mail client…', 'info');
  };

  const onPickFile = () => fileRef.current?.click();

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const raw = await file.text();
    const result = importJSON(raw);
    if (result.ok) {
      toast('Backup restored successfully!', 'success');
    } else {
      toast(`Import failed: ${result.error}`, 'error');
    }
    e.target.value = '';
  };

  const onReset = async () => {
    const confirmed = await confirm({
      title: 'Reset all data',
      message: 'This will erase all habits, completions, and settings permanently. This cannot be undone.',
      confirmLabel: 'Reset everything',
      danger: true,
    });
    if (confirmed) {
      resetAll();
      toast('All data has been cleared.', 'info');
    }
  };

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        ref={trapRef}
        onClick={(e) => e.stopPropagation()}
        className="modal-card w-full max-w-md p-6 space-y-5 shadow-soft animate-fadeUp max-h-[90vh] overflow-y-auto scroll-area"
        style={{ animationDuration: '0.3s' }}
      >
        <div className="flex items-center justify-between">
          <h3 id="settings-title" className="display text-2xl">Settings</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink dark:hover:text-canvas text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted/10 transition"
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        {/* Appearance */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted">
            Appearance
          </div>
          <div className="card flex gap-1 p-1 w-fit">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                theme === 'light'
                  ? 'bg-ink text-canvas shadow-card'
                  : 'text-muted hover:text-ink dark:hover:text-canvas'
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                theme === 'dark'
                  ? 'bg-accent-purple text-white shadow-card'
                  : 'text-muted hover:text-ink dark:hover:text-canvas'
              }`}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* EmailJS Direct Send */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-xs uppercase tracking-wider text-muted">
              Direct Email (EmailJS)
            </div>
            {ejsConfigured && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-mint/30 text-accent-mint font-medium">
                ✓ Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Enable sending daily reports directly without opening a mail client.
            Sign up free at{' '}
            <a
              href="https://www.emailjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-purple hover:underline"
            >
              emailjs.com
            </a>
            , create a service + template (use variables: <code className="text-[10px] bg-muted/10 px-1 rounded">{'{{to_email}}'}</code>,{' '}
            <code className="text-[10px] bg-muted/10 px-1 rounded">{'{{subject}}'}</code>,{' '}
            <code className="text-[10px] bg-muted/10 px-1 rounded">{'{{message}}'}</code>), then paste your IDs below.
          </p>
          <input
            value={ejsServiceId}
            onChange={(e) => setEjsServiceId(e.target.value)}
            placeholder="Service ID"
            className="w-full px-3 py-2 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition text-sm"
          />
          <input
            value={ejsTemplateId}
            onChange={(e) => setEjsTemplateId(e.target.value)}
            placeholder="Template ID"
            className="w-full px-3 py-2 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition text-sm"
          />
          <input
            value={ejsPublicKey}
            onChange={(e) => setEjsPublicKey(e.target.value)}
            placeholder="Public Key"
            className="w-full px-3 py-2 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition text-sm"
          />
          <button
            onClick={saveEmailJSConfig}
            className="w-full px-4 py-2.5 rounded-full bg-accent-purple text-white text-sm font-medium hover:opacity-90 transition active:scale-[0.97]"
          >
            {ejsConfigured ? '✅ Update EmailJS Config' : '🔌 Save EmailJS Config'}
          </button>
        </div>

        {/* Backup */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted">
            Backup
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDownload}
              className="flex-1 px-4 py-2.5 rounded-full bg-ink text-canvas text-sm font-medium hover:opacity-90 transition active:scale-[0.97]"
            >
              📥 Download JSON
            </button>
            <button
              onClick={onPickFile}
              className="flex-1 px-4 py-2.5 rounded-full bg-white/70 dark:bg-white/10 text-ink dark:text-canvas text-sm font-medium border border-muted/25 hover:bg-white dark:hover:bg-white/15 transition active:scale-[0.97]"
            >
              📤 Restore from file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={onImport}
              className="hidden"
              aria-hidden="true"
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
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition"
              />
            </label>
            <button
              onClick={onMail}
              className="mt-2 w-full px-4 py-2.5 rounded-full bg-muted/10 text-sm font-medium hover:bg-muted/20 transition active:scale-[0.97]"
            >
              ✉️ Email backup via mail client
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted">
            Danger zone
          </div>
          <button
            onClick={onReset}
            className="w-full px-4 py-2.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-600/20 transition"
          >
            🗑️ Reset all data
          </button>
        </div>

        <p className="text-[11px] text-muted text-center pt-2">
          Shortcuts: 1–4 switch tabs · ← → change date · T = today · N = new
          habit · S = settings · Esc = close
        </p>
      </div>
    </div>
  );
}
