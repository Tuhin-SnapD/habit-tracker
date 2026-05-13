import { useState, useCallback, useEffect, useRef } from 'react';

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type ConfirmState = ConfirmOptions & {
  resolve: (confirmed: boolean) => void;
};

let showConfirmFn: ((options: ConfirmOptions) => Promise<boolean>) | null = null;

/**
 * Show a themed confirmation dialog from anywhere in the app.
 * Returns a promise that resolves to true (confirmed) or false (cancelled).
 */
export function confirm(options: ConfirmOptions): Promise<boolean> {
  if (!showConfirmFn) return Promise.resolve(false);
  return showConfirmFn(options);
}

export function ConfirmDialog() {
  const [state, setState] = useState<ConfirmState | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  const show = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ ...options, resolve });
    });
  }, []);

  useEffect(() => {
    showConfirmFn = show;
    return () => {
      showConfirmFn = null;
    };
  }, [show]);

  // Focus the cancel button when dialog opens (safer default)
  useEffect(() => {
    if (state) {
      cancelBtnRef.current?.focus();
    }
  }, [state]);

  const handleConfirm = () => {
    state?.resolve(true);
    setState(null);
  };

  const handleCancel = () => {
    state?.resolve(false);
    setState(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
    // Focus trap between the two buttons
    if (e.key === 'Tab') {
      const els = [cancelBtnRef.current, confirmBtnRef.current].filter(Boolean) as HTMLElement[];
      if (els.length < 2) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!state) return null;

  const isDanger = state.danger ?? false;

  return (
    <div
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-[300] animate-fadeIn"
      onClick={handleCancel}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-sm p-6 space-y-4 shadow-soft animate-fadeUp"
        style={{ animationDuration: '0.3s' }}
      >
        <h3
          id="confirm-title"
          className={`display text-xl ${isDanger ? 'text-red-600 dark:text-red-400' : ''}`}
        >
          {state.title}
        </h3>
        <p id="confirm-message" className="text-sm text-muted leading-relaxed">
          {state.message}
        </p>
        <div className="flex gap-2 justify-end pt-2">
          <button
            ref={cancelBtnRef}
            onClick={handleCancel}
            className="px-4 py-2 rounded-full text-sm hover:bg-muted/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple"
          >
            {state.cancelLabel ?? 'Cancel'}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={handleConfirm}
            className={`px-5 py-2 rounded-full text-sm font-medium shadow-card transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isDanger
                ? 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
                : 'bg-ink text-canvas hover:opacity-90 focus-visible:ring-accent-purple'
            }`}
          >
            {state.confirmLabel ?? 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
