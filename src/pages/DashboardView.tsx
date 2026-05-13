import { useMemo, useState } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import {
  getCurrentStreak,
  getLongestStreak,
  getCompletionRate,
  getCompletionsInWindow,
} from '../lib/streaks';
import { toDateKey } from '../lib/dates';
import { SectionHeader } from '../components/SectionHeader';
import { StatTile } from '../components/StatTile';
import { CompletionBar } from '../components/charts/CompletionBar';
import { CategoryBar } from '../components/charts/CategoryBar';
import { TopBottomList } from '../components/TopBottomList';

type Window = 7 | 30 | 90;
const WINDOWS: Window[] = [7, 30, 90];

export function InsightsSection() {
  const habits = useHabitStore((s) => s.habits.filter((h) => !h.archived));
  const completions = useHabitStore((s) => s.completions);
  const [windowDays, setWindowDays] = useState<Window>(30);
  const today = toDateKey();

  const stats = useMemo(() => {
    const streaks = habits.map((h) => getCurrentStreak(h.id, completions, today));
    const longestStreaks = habits.map((h) => getLongestStreak(h.id, completions));
    const bestCurrent = streaks.length ? Math.max(...streaks) : 0;
    const bestEver = longestStreaks.length ? Math.max(...longestStreaks) : 0;
    const totalCompletions = habits.reduce(
      (sum, h) => sum + getCompletionsInWindow(h.id, completions, windowDays, today),
      0
    );
    return { bestCurrent, bestEver, totalCompletions };
  }, [habits, completions, today, windowDays]);

  const barData = useMemo(
    () =>
      habits
        .map((h) => ({
          name: h.name,
          value: getCompletionsInWindow(h.id, completions, windowDays, today),
          color: h.color,
        }))
        .sort((a, b) => b.value - a.value),
    [habits, completions, windowDays, today]
  );

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const h of habits) {
      const v = getCompletionsInWindow(h.id, completions, windowDays, today);
      map.set(h.category, (map.get(h.category) ?? 0) + v);
    }
    return Array.from(map.entries())
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);
  }, [habits, completions, windowDays, today]);

  const ranked = useMemo(() => {
    return habits
      .map((h) => ({
        name: h.name,
        icon: h.icon,
        color: h.color,
        rate: getCompletionRate(h.id, completions, windowDays, today),
      }))
      .sort((a, b) => b.rate - a.rate);
  }, [habits, completions, windowDays, today]);

  const top = ranked.slice(0, 3);
  const bottom = ranked.length > 3 ? ranked.slice(-3).reverse() : [];

  return (
    <section id="insights" className="scroll-mt-28">
      <SectionHeader
        eyebrow="Analysis"
        title="Insights"
        meta={
          <div className="card flex items-center gap-1 p-1">
            {WINDOWS.map((w) => (
              <button
                key={w}
                onClick={() => setWindowDays(w)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  windowDays === w
                    ? 'bg-ink text-canvas shadow-card'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Last {w}d
              </button>
            ))}
          </div>
        }
      />

      {habits.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          Add a habit on the Today section to unlock insights.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatTile
              label="Active habits"
              value={habits.length}
              accent="#A9C6E8"
            />
            <StatTile
              label="Best current streak"
              value={`${stats.bestCurrent}d`}
              accent="#F4C7A1"
            />
            <StatTile
              label="Longest ever"
              value={`${stats.bestEver}d`}
              accent="#C9B6E4"
            />
            <StatTile
              label={`Last ${windowDays}d completions`}
              value={stats.totalCompletions}
              accent="#6B5BD1"
            />
          </div>

          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 card p-5">
              <h3 className="display text-xl mb-3">
                Completions per habit
              </h3>
              <CompletionBar data={barData} max={windowDays} />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <TopBottomList
                title="Top performers"
                entries={top}
                emptyHint="Track for a few days to surface your strongest habits."
              />
              <TopBottomList
                title="Needs attention"
                entries={bottom}
                emptyHint="Add a few more habits to see the lagging set."
              />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="display text-xl mb-3">By category</h3>
            <CategoryBar data={categoryData} />
          </div>
        </div>
      )}
    </section>
  );
}
