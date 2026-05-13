import { useState, memo } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { toDateKey, isFutureDate } from '../lib/dates';
import { confirm } from './ConfirmDialog';
import type { Habit } from '../lib/types';

type Props = { habit: Habit; date?: string; onEdit: () => void };

export const HabitRow = memo(function HabitRow({ habit, date, onEdit }: Props) {
  const key = date ?? toDateKey();
  const future = isFutureDate(key);
  const done = useHabitStore((s) =>
    s.completions.some((c) => c.habitId === habit.id && c.date === key)
  );
  const toggle = useHabitStore((s) => s.toggleCompletion);
  const archive = useHabitStore((s) => s.archiveHabit);

  const [bouncing, setBouncing] = useState(false);

  const handleToggle = () => {
    if (future) return;
    setBouncing(true);
    toggle(habit.id, key);
    setTimeout(() => setBouncing(false), 350);
  };

  const handleArchive = async () => {
    const confirmed = await confirm({
      title: 'Archive habit',
      message: `Archive "${habit.name}"? It will be hidden from your daily view but its history will be preserved.`,
      confirmLabel: 'Archive',
      danger: false,
    });
    if (confirmed) archive(habit.id);
  };

  return (
    <li
      className={`card flex items-center gap-4 p-4 transition-all duration-200 ${
        future ? 'opacity-60' : 'hover:shadow-soft'
      }`}
      style={{ borderLeft: `4px solid ${habit.color}` }}
    >
      <button
        onClick={handleToggle}
        disabled={future}
        aria-label={
          future
            ? "Can't mark a future date"
            : done
            ? `Mark ${habit.name} not done`
            : `Mark ${habit.name} done`
        }
        aria-pressed={done}
        title={future ? "Can't mark a future date" : undefined}
        className={`w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0 transition-all duration-200 ${
          bouncing ? 'animate-checkBounce' : ''
        } ${
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
      <span className="text-2xl shrink-0" aria-hidden="true">{habit.icon}</span>
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${done && !future ? 'line-through opacity-60' : ''}`}>
          {habit.name}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">
          {habit.category}
        </div>
      </div>
      <button
        onClick={onEdit}
        className="text-sm text-muted hover:text-accent-purple px-2 py-1 transition rounded-lg hover:bg-accent-purple/10"
        aria-label={`Edit ${habit.name}`}
      >
        Edit
      </button>
      <button
        onClick={handleArchive}
        className="text-sm text-muted hover:text-ink dark:hover:text-canvas px-2 py-1 transition rounded-lg hover:bg-muted/10"
        aria-label={`Archive ${habit.name}`}
      >
        Archive
      </button>
    </li>
  );
});
