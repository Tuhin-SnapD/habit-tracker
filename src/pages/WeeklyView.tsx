import { useMemo, useState, memo } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { useUIStore } from '../store/useUIStore';
import { SectionHeader } from '../components/SectionHeader';
import {
  weekDates,
  weekdayLabels,
  fromKey,
  toDateKey,
  isFutureDate,
  shiftDays,
  getForwardDate,
} from '../lib/dates';
import { buildCompletionSet } from '../lib/streaks';
import { scrollToSection } from '../hooks/useActiveSection';
import { format } from 'date-fns';

export function WeekSection() {
  const habits = useHabitStore((s) => s.habits.filter((h) => !h.archived));
  const completions = useHabitStore((s) => s.completions);
  const toggle = useHabitStore((s) => s.toggleCompletion);
  const setSelectedDate = useUIStore((s) => s.setSelectedDate);
  const weekStartsOn = useHabitStore((s) => s.settings.weekStartsOn);

  const [anchor, setAnchor] = useState(() => toDateKey());

  const days = useMemo(
    () => weekDates(anchor, weekStartsOn),
    [anchor, weekStartsOn]
  );
  const labels = useMemo(() => weekdayLabels(weekStartsOn), [weekStartsOn]);
  const today = toDateKey();
  const completionSet = useMemo(
    () => buildCompletionSet(completions),
    [completions]
  );

  const totalCells = habits.length * 7;
  const weekDone = useMemo(
    () =>
      days.reduce(
        (sum, d) =>
          sum +
          habits.filter((h) => completionSet.has(`${h.id}|${d}`)).length,
        0
      ),
    [days, habits, completionSet]
  );
  const weekRate = totalCells ? weekDone / totalCells : 0;
  const forwardWeek = getForwardDate('week', anchor, weekStartsOn);

  return (
    <section id="week" className="scroll-mt-28">
      <SectionHeader
        eyebrow="Momentum"
        title="This week"
        meta={
          <div className="card flex items-center gap-1 p-1">
            <button
              onClick={() => setAnchor(shiftDays(anchor, -7))}
              className="w-9 h-9 rounded-full hover:bg-muted/10 text-lg transition flex items-center justify-center"
              aria-label="Previous week"
            >
              ‹
            </button>
            <span className="text-sm font-medium min-w-[8.5rem] text-center">
              {format(fromKey(days[0]), 'MMM d')} –{' '}
              {format(fromKey(days[6]), 'MMM d')}
            </span>
            <button
              onClick={() => forwardWeek && setAnchor(forwardWeek)}
              disabled={!forwardWeek}
              className="w-9 h-9 rounded-full hover:bg-muted/10 text-lg transition flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next week"
              title={forwardWeek ? undefined : "Can't navigate past today"}
            >
              ›
            </button>
          </div>
        }
      />

      {habits.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          Add a habit on the Today section to see your week.
        </div>
      ) : (
        <div className="card p-4 md:p-6 space-y-4">
          <div className="flex items-baseline justify-between px-1">
            <p className="text-xs uppercase tracking-wider text-muted">
              Completion this week
            </p>
            <p className="text-sm">
              <span className="display text-xl">{weekDone}</span>
              <span className="text-muted">
                {' '}
                / {totalCells} ({Math.round(weekRate * 100)}%)
              </span>
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              className="min-w-fit grid gap-1 sm:gap-1.5 items-center"
              style={{
                gridTemplateColumns:
                  'minmax(120px, 1fr) repeat(7, minmax(36px, 44px))',
              }}
            >
              <div />
              {days.map((d, i) => {
                const isToday = d === today;
                return (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDate(d);
                      scrollToSection('today');
                    }}
                    className={`text-center py-1.5 rounded-lg transition ${
                      isToday
                        ? 'bg-accent-purple/10 text-accent-purple font-semibold'
                        : 'text-muted hover:bg-muted/10'
                    }`}
                    title={`Jump to ${d}`}
                  >
                    <div className="uppercase tracking-wider text-[10px]">
                      {labels[i]}
                    </div>
                    <div className="text-sm font-semibold mt-0.5">
                      {format(fromKey(d), 'd')}
                    </div>
                  </button>
                );
              })}

              {habits.map((h) => (
                <WeekRow
                  key={h.id}
                  habitId={h.id}
                  name={h.name}
                  icon={h.icon}
                  color={h.color}
                  days={days}
                  today={today}
                  completionSet={completionSet}
                  onToggle={(d) => toggle(h.id, d)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

type WeekRowProps = {
  habitId: string;
  name: string;
  icon: string;
  color: string;
  days: string[];
  today: string;
  completionSet: Set<string>;
  onToggle: (date: string) => void;
};

const WeekRow = memo(function WeekRow({
  habitId,
  name,
  icon,
  color,
  days,
  today,
  completionSet,
  onToggle,
}: WeekRowProps) {
  return (
    <>
      <div
        className="flex items-center gap-2 pr-3 py-2 truncate"
        style={{ borderLeft: `4px solid ${color}`, paddingLeft: 10 }}
      >
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <span className="text-sm truncate">{name}</span>
      </div>
      {days.map((d) => {
        const done = completionSet.has(`${habitId}|${d}`);
        const isToday = d === today;
        const future = isFutureDate(d);
        return (
          <button
            key={d}
            onClick={() => !future && onToggle(d)}
            disabled={future}
            aria-label={
              future ? `${name} on ${d} (future)` : `${name} on ${d}${done ? ' (done)' : ''}`
            }
            aria-pressed={done}
            title={future ? "Can't mark a future date" : undefined}
            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center justify-center transition-all duration-200 border ${
              done
                ? 'text-white border-transparent shadow-card'
                : future
                ? 'border-dashed border-muted/15 bg-transparent text-muted/40 cursor-not-allowed'
                : `${isToday ? 'border-accent-purple/40 bg-white/50 dark:bg-white/5' : 'border-muted/15 bg-white/40 dark:bg-white/5'} hover:border-accent-purple/60`
            }`}
            style={done ? { backgroundColor: color } : undefined}
          >
            {done ? '✓' : ''}
          </button>
        );
      })}
    </>
  );
});
