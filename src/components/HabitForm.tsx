import { useState, type FormEvent } from 'react';
import { useHabitStore, MAX_HABITS } from '../store/useHabitStore';
import { CATEGORIES } from '../lib/categories';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { confirm } from './ConfirmDialog';

const COLORS = ['#A7D7C5', '#F4C7A1', '#C9B6E4', '#A9C6E8', '#E8B4BC', '#6B5BD1'];
const ICONS = ['💪', '📚', '🧘', '💧', '🏃', '✍️', '🥗', '😴', '☀️', '🎯', '🧠', '🪴', '🤸', '🎨', '🎵', '✨'];

type Props = { editingId: string | null; onClose: () => void };

export function HabitForm({ editingId, onClose }: Props) {
  const habit = useHabitStore((s) =>
    editingId ? s.habits.find((h) => h.id === editingId) ?? null : null
  );
  const activeCount = useHabitStore(
    (s) => s.habits.filter((h) => !h.archived).length
  );
  const addHabit = useHabitStore((s) => s.addHabit);
  const editHabit = useHabitStore((s) => s.editHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);
  const trapRef = useFocusTrap<HTMLFormElement>();

  const [name, setName] = useState(habit?.name ?? '');
  const [category, setCategory] = useState<string>(habit?.category ?? 'Health');
  const [icon, setIcon] = useState(habit?.icon ?? '✨');
  const [color, setColor] = useState(habit?.color ?? COLORS[0]);
  const [targetPerWeek, setTargetPerWeek] = useState<number | ''>(
    habit?.targetPerWeek ?? ''
  );
  const [error, setError] = useState<string | null>(null);

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    const payload = {
      name: name.trim(),
      category,
      icon,
      color,
      targetPerWeek: targetPerWeek === '' ? undefined : Number(targetPerWeek),
    };
    if (habit) {
      editHabit(habit.id, payload);
    } else {
      const ok = addHabit(payload);
      if (!ok) {
        setError(`Habit limit (${MAX_HABITS}) reached. Archive one to add more.`);
        return;
      }
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!habit) return;
    const confirmed = await confirm({
      title: 'Delete habit',
      message: `Delete "${habit.name}" and all its history? This cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
    });
    if (confirmed) {
      deleteHabit(habit.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-form-title"
    >
      <form
        ref={trapRef}
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSave}
        className="card w-full max-w-md p-6 space-y-4 shadow-soft animate-fadeUp max-h-[90vh] overflow-y-auto scroll-area"
        style={{ animationDuration: '0.3s' }}
      >
        <div className="flex items-center justify-between">
          <h3 id="habit-form-title" className="display text-2xl">
            {habit ? 'Edit habit' : 'New habit'}
          </h3>
          <span className="text-xs text-muted">
            {activeCount}/{MAX_HABITS}
          </span>
        </div>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            placeholder="e.g. Drink water"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend className="text-xs uppercase tracking-wider text-muted">Icon</legend>
          <div className="flex flex-wrap gap-2 mt-1" role="radiogroup">
            {ICONS.map((i) => (
              <button
                type="button"
                key={i}
                onClick={() => setIcon(i)}
                role="radio"
                aria-checked={icon === i}
                aria-label={`Icon ${i}`}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition ${
                  icon === i
                    ? 'border-accent-purple bg-white dark:bg-white/10 shadow-card'
                    : 'border-transparent bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xs uppercase tracking-wider text-muted">Color</legend>
          <div className="flex gap-2 mt-1" role="radiogroup">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                role="radio"
                aria-checked={color === c}
                className={`w-10 h-10 rounded-full border-2 transition ${
                  color === c ? 'border-ink dark:border-canvas scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted">
            Weekly target (optional)
          </span>
          <input
            type="number"
            min={1}
            max={7}
            value={targetPerWeek}
            onChange={(e) =>
              setTargetPerWeek(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="e.g. 5"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-muted/25 bg-white/80 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          {habit ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              Delete
            </button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm hover:bg-muted/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-ink text-canvas text-sm font-medium hover:opacity-90 shadow-card transition active:scale-[0.97]"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
