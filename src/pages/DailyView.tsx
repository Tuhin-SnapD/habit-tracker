import { useMemo } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { useUIStore } from '../store/useUIStore';
import { DateNav } from '../components/DateNav';
import { HabitList } from '../components/HabitList';
import { SectionHeader } from '../components/SectionHeader';
import { ProgressRing } from '../components/charts/ProgressRing';
import { getCurrentStreak } from '../lib/streaks';

export function DailySection() {
  const habits = useHabitStore((s) => s.habits.filter((h) => !h.archived));
  const completions = useHabitStore((s) => s.completions);
  const selectedDate = useUIStore((s) => s.selectedDate);

  const { doneCount, rate, bestStreak } = useMemo(() => {
    const set = new Set(
      completions
        .filter((c) => c.date === selectedDate)
        .map((c) => c.habitId)
    );
    const dc = habits.filter((h) => set.has(h.id)).length;
    const streaks = habits.map((h) =>
      getCurrentStreak(h.id, completions, selectedDate)
    );
    return {
      doneCount: dc,
      rate: habits.length ? dc / habits.length : 0,
      bestStreak: streaks.length ? Math.max(...streaks) : 0,
    };
  }, [habits, completions, selectedDate]);

  if (habits.length === 0) {
    return (
      <section id="today" className="scroll-mt-28">
        <HabitList />
      </section>
    );
  }

  return (
    <section id="today" className="scroll-mt-28">
      <SectionHeader
        eyebrow="Action"
        title="Today"
        meta={<DateNav step="day" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HabitList />
        </div>

        <aside className="space-y-4">
          <div className="card p-6 flex flex-col items-center text-center">
            <ProgressRing percent={rate} size={140} label="Progress" />
            <div className="display text-2xl mt-4">
              {doneCount}{' '}
              <span className="text-muted text-base font-sans">
                / {habits.length} done
              </span>
            </div>
          </div>

          <div className="card p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
              Best current streak
            </p>
            <p className="display text-3xl mt-1">{bestStreak}d</p>
            <p className="text-xs text-muted mt-1">
              The habit you've kept going the longest right now.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
