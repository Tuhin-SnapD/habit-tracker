import {
  format,
  addDays,
  addMonths,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
  getDay,
} from 'date-fns';

export const toDateKey = (d: Date = new Date()): string => format(d, 'yyyy-MM-dd');
export const fromKey = (key: string): Date => parseISO(key);
export const shiftDays = (key: string, n: number): string =>
  toDateKey(addDays(fromKey(key), n));
export const shiftMonths = (key: string, n: number): string =>
  toDateKey(addMonths(fromKey(key), n));

export const weekDates = (key: string, weekStartsOn: 0 | 1 = 1): string[] => {
  const start = startOfWeek(fromKey(key), { weekStartsOn });
  return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(start, i)));
};

export const monthGrid = (
  key: string,
  weekStartsOn: 0 | 1 = 1
): { date: string; inMonth: boolean }[] => {
  const d = fromKey(key);
  const first = startOfMonth(d);
  const last = endOfMonth(d);
  const leading = (getDay(first) - weekStartsOn + 7) % 7;
  const start = addDays(first, -leading);
  const days = eachDayOfInterval({ start, end: last });
  const trailing = (7 - (days.length % 7)) % 7;
  const all = [
    ...days,
    ...Array.from({ length: trailing }, (_, i) => addDays(last, i + 1)),
  ];
  return all.map((dd) => ({
    date: toDateKey(dd),
    inMonth: dd.getMonth() === first.getMonth(),
  }));
};

export const formatHuman = (key: string, fmt = 'EEE, MMM d'): string =>
  format(fromKey(key), fmt);

export const isFutureDate = (key: string, today: string = toDateKey()): boolean =>
  key > today;

export const weekStartKey = (
  key: string,
  weekStartsOn: 0 | 1 = 1
): string => toDateKey(startOfWeek(fromKey(key), { weekStartsOn }));

export const startOfMonthKey = (key: string): string =>
  toDateKey(startOfMonth(fromKey(key)));

export type NavStep = 'day' | 'week' | 'month';

export const getForwardDate = (
  step: NavStep,
  current: string,
  weekStartsOn: 0 | 1 = 1,
  today: string = toDateKey()
): string | null => {
  if (step === 'day') {
    const next = shiftDays(current, 1);
    return next <= today ? next : null;
  }
  if (step === 'week') {
    const next = shiftDays(current, 7);
    if (weekStartKey(next, weekStartsOn) > today) return null;
    return next > today ? today : next;
  }
  const next = shiftMonths(current, 1);
  if (startOfMonthKey(next) > today) return null;
  return next > today ? today : next;
};

export const getBackwardDate = (
  step: NavStep,
  current: string
): string => {
  if (step === 'day') return shiftDays(current, -1);
  if (step === 'week') return shiftDays(current, -7);
  return shiftMonths(current, -1);
};

export const weekdayLabels = (weekStartsOn: 0 | 1 = 1): string[] => {
  const base = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return Array.from({ length: 7 }, (_, i) => base[(i + weekStartsOn) % 7]);
};
