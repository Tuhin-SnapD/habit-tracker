import { useEffect, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

let toastId = 0;
let addToastFn: ((message: string, type?: ToastType) => void) | null = null;

/** Fire a toast notification from anywhere in the app. */
export function toast(message: string, type: ToastType = 'info') {
  addToastFn?.(message, type);
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✗',
  info: 'ℹ',
};

const COLORS: Record<ToastType, string> = {
  success: 'bg-accent-mint/90 text-ink',
  error: 'bg-red-600/90 text-white',
  info: 'bg-accent-purple/90 text-white',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    addToastFn = add;
    return () => {
      addToastFn = null;
    };
  }, [add]);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-soft backdrop-blur-md text-sm font-medium animate-toastIn ${COLORS[t.type]}`}
          role="status"
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
            {ICONS[t.type]}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
