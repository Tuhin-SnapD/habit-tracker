import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { useUIStore } from '../store/useUIStore';
import { DateNav } from '../components/DateNav';
import { HabitList } from '../components/HabitList';
import { SectionHeader } from '../components/SectionHeader';
import { ProgressRing } from '../components/charts/ProgressRing';
import { buildCompletionMap, getCurrentStreak } from '../lib/streaks';

export function DailySection() {
  const habits = useHabitStore((s) => s.habits.filter((h) => !h.archived));
  const completions = useHabitStore((s) => s.completions);
  const selectedDate = useUIStore((s) => s.selectedDate);

  const [asideEl, setAsideEl] = useState<HTMLDivElement | null>(null);
  const [asideH, setAsideH] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!asideEl) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setAsideH(entry.contentRect.height);
      }
    });
    ro.observe(asideEl);
    return () => ro.disconnect();
  }, [asideEl]);

  const completionMap = useMemo(
    () => buildCompletionMap(completions),
    [completions]
  );

  const { doneCount, rate, bestStreak } = useMemo(() => {
    const dateSet = new Set(
      completions
        .filter((c) => c.date === selectedDate)
        .map((c) => c.habitId)
    );
    const dc = habits.filter((h) => dateSet.has(h.id)).length;
    const streaks = habits.map((h) =>
      getCurrentStreak(h.id, completionMap.get(h.id) ?? new Set(), selectedDate)
    );
    return {
      doneCount: dc,
      rate: habits.length ? dc / habits.length : 0,
      bestStreak: streaks.length ? Math.max(...streaks) : 0,
    };
  }, [habits, completions, selectedDate, completionMap]);

  if (habits.length === 0) {
    return (
      <section id="today" className="scroll-mt-28">
        <HabitList />
      </section>
    );
  }

  const leftStyle: CSSProperties | undefined = asideH
    ? ({ '--aside-h': `${asideH}px` } as CSSProperties)
    : undefined;

  return (
    <section id="today" className="scroll-mt-28">
      <SectionHeader
        eyebrow="Action"
        title="Today"
        meta={<DateNav step="day" />}
      />

      <div className="grid lg:grid-cols-3 gap-6 lg:items-start">
        <div
          className="lg:col-span-2 min-h-0 lg:h-[var(--aside-h)]"
          style={leftStyle}
        >
          <HabitList />
        </div>

        <div ref={setAsideEl} className="space-y-4">
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
        </div>
      </div>
    </section>
  );
}
