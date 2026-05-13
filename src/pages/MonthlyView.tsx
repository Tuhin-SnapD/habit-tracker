import { useMemo, useState } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { useUIStore } from '../store/useUIStore';
import { SectionHeader } from '../components/SectionHeader';
import {
  monthGrid,
  weekdayLabels,
  fromKey,
  toDateKey,
  isFutureDate,
  shiftMonths,
  getForwardDate,
} from '../lib/dates';
import { scrollToSection } from '../hooks/useActiveSection';
import { format } from 'date-fns';

export function MonthSection() {
  const habits = useHabitStore((s) => s.habits.filter((h) => !h.archived));
  const completions = useHabitStore((s) => s.completions);
  const setSelectedDate = useUIStore((s) => s.setSelectedDate);
  const weekStartsOn = useHabitStore((s) => s.settings.weekStartsOn);

  const [anchor, setAnchor] = useState(() => toDateKey());

  const cells = useMemo(
    () => monthGrid(anchor, weekStartsOn),
    [anchor, weekStartsOn]
  );
  const labels = useMemo(() => weekdayLabels(weekStartsOn), [weekStartsOn]);
  const today = toDateKey();
  const totalHabits = habits.length;

  const dayCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of completions) {
      if (habits.some((h) => h.id === c.habitId)) {
        counts[c.date] = (counts[c.date] ?? 0) + 1;
      }
    }
    return counts;
  }, [completions, habits]);

  const inMonthCells = cells.filter((c) => c.inMonth);
  const inMonthPast = inMonthCells.filter((c) => !isFutureDate(c.date));
  const monthDone = inMonthPast.reduce(
    (sum, c) => sum + (dayCounts[c.date] ?? 0),
    0
  );
  const monthTotal = inMonthPast.length * totalHabits;
  const monthRate = monthTotal ? monthDone / monthTotal : 0;
  const forwardMonth = getForwardDate('month', anchor, weekStartsOn);

  return (
    <section id="month" className="scroll-mt-28">
      <SectionHeader
        eyebrow="The long view"
        title={format(fromKey(anchor), 'MMMM yyyy')}
        meta={
          <div className="card flex items-center gap-1 p-1">
            <button
              onClick={() => setAnchor(shiftMonths(anchor, -1))}
              className="w-8 h-8 rounded-full hover:bg-muted/10 text-lg"
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className="text-sm font-medium min-w-[8rem] text-center display">
              {format(fromKey(anchor), 'MMMM yyyy')}
            </span>
            <button
              onClick={() => forwardMonth && setAnchor(forwardMonth)}
              disabled={!forwardMonth}
              className="w-8 h-8 rounded-full hover:bg-muted/10 text-lg disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next month"
              title={forwardMonth ? undefined : "Can't navigate past today"}
            >
              ›
            </button>
          </div>
        }
      />

      {totalHabits === 0 ? (
        <div className="card p-10 text-center text-muted">
          Add a habit on the Today section to see your month.
        </div>
      ) : (
        <div className="card p-4 md:p-6 space-y-4">
          <div className="flex items-baseline justify-between px-1">
            <p className="text-xs uppercase tracking-wider text-muted">
              Month so far
            </p>
            <p className="text-sm">
              <span className="display text-xl">{monthDone}</span>
              <span className="text-muted">
                {' '}
                / {monthTotal} ({Math.round(monthRate * 100)}%)
              </span>
            </p>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] uppercase tracking-wider text-muted">
            {labels.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map(({ date, inMonth }) => {
              const count = dayCounts[date] ?? 0;
              const pct = totalHabits > 0 ? count / totalHabits : 0;
              const isToday = date === today;
              const future = isFutureDate(date);
              return (
                <button
                  key={date}
                  onClick={() => {
                    if (future) return;
                    setSelectedDate(date);
                    scrollToSection('today');
                  }}
                  disabled={future}
                  className={`aspect-square rounded-xl p-2 flex flex-col items-start justify-between text-left transition ${
                    !inMonth ? 'opacity-30' : ''
                  } ${
                    future
                      ? 'cursor-not-allowed opacity-50'
                      : inMonth
                      ? 'hover:ring-2 hover:ring-accent-purple/40'
                      : ''
                  } ${isToday ? 'ring-2 ring-accent-purple' : ''}`}
                  style={{
                    background: future
                      ? 'rgba(255,255,255,0.25)'
                      : pct === 0
                      ? 'rgba(255,255,255,0.5)'
                      : gradientShade(pct),
                    backgroundImage: future
                      ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(139,132,124,0.08) 5px, rgba(139,132,124,0.08) 10px)'
                      : undefined,
                  }}
                  title={
                    future
                      ? `${date} — future date`
                      : `${date}: ${count}/${totalHabits} done`
                  }
                >
                  <div className="text-xs font-medium">
                    {format(fromKey(date), 'd')}
                  </div>
                  {inMonth && !future && count > 0 && (
                    <div
                      className="text-[10px] self-end font-medium"
                      style={{ color: pct > 0.5 ? 'white' : '#1F1B2D' }}
                    >
                      {count}/{totalHabits}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted text-center pt-2">
            Click any day to jump to the Today section.
          </p>
        </div>
      )}
    </section>
  );
}

function gradientShade(pct: number): string {
  const clamped = Math.max(0, Math.min(1, pct));
  const r1 = 243, g1 = 213, b1 = 221;
  const r2 = 107, g2 = 91, b2 = 209;
  const r = Math.round(r1 + (r2 - r1) * clamped);
  const g = Math.round(g1 + (g2 - g1) * clamped);
  const b = Math.round(b1 + (b2 - b1) * clamped);
  return `rgb(${r}, ${g}, ${b})`;
}
