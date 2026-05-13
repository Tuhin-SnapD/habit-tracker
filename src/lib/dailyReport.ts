import { format } from 'date-fns';
import type { Habit, Completion } from './types';
import { toDateKey, fromKey } from './dates';
import { getCurrentStreak, getLongestStreak } from './streaks';

export function buildDailyReport(
  name: string | undefined,
  habits: Habit[],
  completions: Completion[],
  date: string = toDateKey()
): { subject: string; body: string } {
  const active = habits.filter((h) => !h.archived);
  const completedSet = new Set(
    completions.filter((c) => c.date === date).map((c) => c.habitId)
  );
  const done = active.filter((h) => completedSet.has(h.id));
  const pending = active.filter((h) => !completedSet.has(h.id));

  const bestStreak = active.length
    ? Math.max(...active.map((h) => getCurrentStreak(h.id, completions, date)))
    : 0;
  const longestEver = active.length
    ? Math.max(...active.map((h) => getLongestStreak(h.id, completions)))
    : 0;

  const friendlyDate = format(fromKey(date), 'EEEE, MMMM d');
  const subject = `LevelUp daily report — ${friendlyDate}`;

  const greeting = name ? `Hi ${name},` : 'Hi,';
  const lines = [
    greeting,
    '',
    `Here is your LevelUp report for ${friendlyDate}.`,
    '',
    `Completed (${done.length}/${active.length}):`,
    ...(done.length ? done.map((h) => `  - ${h.name}`) : ['  (nothing yet today)']),
    '',
    `Still pending (${pending.length}):`,
    ...(pending.length ? pending.map((h) => `  - ${h.name}`) : ['  (all done - nice work!)']),
    '',
    `Best current streak: ${bestStreak} day${bestStreak === 1 ? '' : 's'}`,
    `Longest ever:       ${longestEver} day${longestEver === 1 ? '' : 's'}`,
    '',
    'Keep building momentum.',
    '— LevelUp',
  ];

  return { subject, body: lines.join('\n') };
}
