import type { Completion } from './types';
import { shiftDays, toDateKey } from './dates';

const completionSet = (habitId: string, completions: Completion[]): Set<string> =>
  new Set(completions.filter((c) => c.habitId === habitId).map((c) => c.date));

export function getCurrentStreak(
  habitId: string,
  completions: Completion[],
  today: string = toDateKey()
): number {
  const set = completionSet(habitId, completions);
  let cursor = today;
  if (!set.has(cursor)) {
    cursor = shiftDays(cursor, -1);
    if (!set.has(cursor)) return 0;
  }
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = shiftDays(cursor, -1);
  }
  return streak;
}

export function getLongestStreak(
  habitId: string,
  completions: Completion[]
): number {
  const dates = completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.date)
    .sort();
  if (dates.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    if (shiftDays(dates[i - 1], 1) === dates[i]) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}

export function getCompletionRate(
  habitId: string,
  completions: Completion[],
  windowDays: number,
  today: string = toDateKey()
): number {
  if (windowDays <= 0) return 0;
  const set = completionSet(habitId, completions);
  let done = 0;
  for (let i = 0; i < windowDays; i++) {
    if (set.has(shiftDays(today, -i))) done++;
  }
  return done / windowDays;
}

export function getCompletionsInWindow(
  habitId: string,
  completions: Completion[],
  windowDays: number,
  today: string = toDateKey()
): number {
  const set = completionSet(habitId, completions);
  let count = 0;
  for (let i = 0; i < windowDays; i++) {
    if (set.has(shiftDays(today, -i))) count++;
  }
  return count;
}
