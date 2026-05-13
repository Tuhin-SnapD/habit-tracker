import type { Completion } from './types';
import { shiftDays, toDateKey } from './dates';

/**
 * Build a lookup map from completions: habitId → Set<dateKey>.
 * Pass this into streak functions to avoid O(N) set rebuilds per call.
 */
export function buildCompletionMap(
  completions: Completion[]
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const c of completions) {
    let set = map.get(c.habitId);
    if (!set) {
      set = new Set();
      map.set(c.habitId, set);
    }
    set.add(c.date);
  }
  return map;
}

/**
 * Build a flat Set of "habitId|date" keys for O(1) completion checks.
 */
export function buildCompletionSet(completions: Completion[]): Set<string> {
  return new Set(completions.map((c) => `${c.habitId}|${c.date}`));
}

export function getCurrentStreak(
  _habitId: string,
  dateSet: Set<string>,
  today: string = toDateKey()
): number {
  let cursor = today;
  if (!dateSet.has(cursor)) {
    cursor = shiftDays(cursor, -1);
    if (!dateSet.has(cursor)) return 0;
  }
  let streak = 0;
  while (dateSet.has(cursor)) {
    streak++;
    cursor = shiftDays(cursor, -1);
  }
  return streak;
}

export function getLongestStreak(
  _habitId: string,
  dateSet: Set<string>
): number {
  const dates = Array.from(dateSet).sort();
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
  _habitId: string,
  dateSet: Set<string>,
  windowDays: number,
  today: string = toDateKey()
): number {
  if (windowDays <= 0) return 0;
  let done = 0;
  for (let i = 0; i < windowDays; i++) {
    if (dateSet.has(shiftDays(today, -i))) done++;
  }
  return done / windowDays;
}

export function getCompletionsInWindow(
  _habitId: string,
  dateSet: Set<string>,
  windowDays: number,
  today: string = toDateKey()
): number {
  let count = 0;
  for (let i = 0; i < windowDays; i++) {
    if (dateSet.has(shiftDays(today, -i))) count++;
  }
  return count;
}

/** Batch-compute all stats for multiple habits in a single pass. */
export type HabitStats = {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  completionsInWindow: number;
};

export function batchComputeStats(
  habitIds: string[],
  completionMap: Map<string, Set<string>>,
  windowDays: number,
  today: string = toDateKey()
): Map<string, HabitStats> {
  const result = new Map<string, HabitStats>();
  for (const id of habitIds) {
    const dateSet = completionMap.get(id) ?? new Set();
    result.set(id, {
      currentStreak: getCurrentStreak(id, dateSet, today),
      longestStreak: getLongestStreak(id, dateSet),
      completionRate: getCompletionRate(id, dateSet, windowDays, today),
      completionsInWindow: getCompletionsInWindow(id, dateSet, windowDays, today),
    });
  }
  return result;
}
