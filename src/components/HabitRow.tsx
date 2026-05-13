import { useHabitStore } from '../store/useHabitStore';
import { toDateKey, isFutureDate } from '../lib/dates';
import type { Habit } from '../lib/types';

type Props = { habit: Habit; date?: string; onEdit: () => void };

export function HabitRow({ habit, date, onEdit }: Props) {
  const key = date ?? toDateKey();
  const future = isFutureDate(key);
  const done = useHabitStore((s) =>
    s.completions.some((c) => c.habitId === habit.id && c.date === key)
  );
  const toggle = useHabitStore((s) => s.toggleCompletion);
  const archive = useHabitStore((s) => s.archiveHabit);

  return (
    <li
      className={`card flex items-center gap-4 p-4 transition ${
        future ? 'opacity-60' : 'hover:shadow-soft'
      }`}
      style={{ borderLeft: `4px solid ${habit.color}` }}
    >
      <button
        onClick={() => !future && toggle(habit.id, key)}
        disabled={future}
        aria-label={
          future
            ? "Can't mark a future date"
            : done
            ? 'Mark not done'
            : 'Mark done'
        }
        title={future ? "Can't mark a future date" : undefined}
        className={`w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0 transition ${
          done
            ? 'text-white shadow-card'
            : future
            ? 'text-muted/40 border-2 border-dashed border-muted/25 cursor-not-allowed'
            : 'text-muted border-2 border-muted/30 hover:border-accent-purple hover:text-accent-purple'
        }`}
        style={done ? { backgroundColor: habit.color } : undefined}
      >
        {done ? '✓' : future ? '·' : ''}
      </button>
      <span className="text-2xl shrink-0">{habit.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{habit.name}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
          {habit.category}
        </div>
      </div>
      <button
        onClick={onEdit}
        className="text-sm text-muted hover:text-accent-purple px-2 py-1 transition"
      >
        Edit
      </button>
      <button
        onClick={() => {
          if (confirm(`Archive "${habit.name}"?`)) archive(habit.id);
        }}
        className="text-sm text-muted hover:text-ink px-2 py-1 transition hidden sm:inline"
      >
        Archive
      </button>
    </li>
  );
}
