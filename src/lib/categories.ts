export const CATEGORIES = [
  'Health',
  'Work',
  'Personal',
  'Learning',
  'Wellness',
] as const;

export type Category = (typeof CATEGORIES)[number];
