import { useState } from 'react';
import { useHabitStore, MAX_HABITS } from '../store/useHabitStore';
import { useUIStore } from '../store/useUIStore';
import { HabitForm } from './HabitForm';
import { HabitRow } from './HabitRow';

const FEATURES = [
  'Track up to 99 habits in one dashboard',
  'Automatic streaks and weekly progress',
  'Daily, weekly, and monthly views',
  'Soft, distraction-free design',
];

export function HabitList() {
  const habits = useHabitStore((s) => s.habits.filter((h) => !h.archived));
  const seedStarterHabits = useHabitStore((s) => s.seedStarterHabits);
  const selectedDate = useUIStore((s) => s.selectedDate);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setIsOpen(true);
  };
  const openEdit = (id: string) => {
    setEditingId(id);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  if (habits.length === 0) {
    return (
      <section className="relative">
        <div className="blob bg-accent-blush -top-10 -left-10 w-72 h-72" />
        <div className="blob bg-accent-lilac -bottom-10 -right-10 w-80 h-80" />
        <div className="relative card p-10 md:p-14 text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-purple font-medium">
            Stay consistent
          </p>
          <h2 className="display text-4xl md:text-5xl leading-tight">
            Turn your day{' '}
            <span className="italic text-accent-purple">into a game.</span>
          </h2>
          <p className="text-muted max-w-md mx-auto">
            Build momentum with a system that makes progress impossible to miss.
            Start with the essentials, or design your own.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={seedStarterHabits}
              className="px-6 py-3 rounded-full bg-ink text-canvas font-medium hover:opacity-90 shadow-card transition"
            >
              Start with 8 healthy habits
            </button>
            <button
              onClick={openAdd}
              className="px-6 py-3 rounded-full bg-white/60 text-ink font-medium hover:bg-white border border-muted/20 transition"
            >
              Add your own
            </button>
          </div>

          <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6 pt-6 max-w-lg mx-auto text-left">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-accent-purple/15 text-accent-purple flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {isOpen && <HabitForm editingId={editingId} onClose={close} />}
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="display text-2xl">
          Your habits{' '}
          <span className="text-muted text-sm font-sans font-normal">
            ({habits.length}/{MAX_HABITS})
          </span>
        </h2>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-full bg-ink text-canvas text-sm hover:opacity-90 shadow-card transition"
        >
          + Add habit
        </button>
      </div>

      <ul className="space-y-2">
        {habits.map((h) => (
          <HabitRow
            key={h.id}
            habit={h}
            date={selectedDate}
            onEdit={() => openEdit(h.id)}
          />
        ))}
      </ul>

      {isOpen && <HabitForm editingId={editingId} onClose={close} />}
    </section>
  );
}
