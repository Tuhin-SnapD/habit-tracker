import type { Habit } from './types';

type StarterHabit = Omit<Habit, 'id' | 'createdAt' | 'archived'>;

export const STARTER_HABITS: StarterHabit[] = [
  {
    name: 'Drink 8 glasses of water',
    category: 'Health',
    icon: '💧',
    color: '#A9C6E8',
    targetPerWeek: 7,
  },
  {
    name: 'Move for 20+ minutes',
    category: 'Health',
    icon: '🏃',
    color: '#A7D7C5',
    targetPerWeek: 5,
  },
  {
    name: 'Sleep 7–8 hours',
    category: 'Health',
    icon: '😴',
    color: '#C9B6E4',
    targetPerWeek: 7,
  },
  {
    name: 'Eat fruits and vegetables',
    category: 'Health',
    icon: '🥗',
    color: '#A7D7C5',
    targetPerWeek: 7,
  },
  {
    name: 'Read 10 pages',
    category: 'Learning',
    icon: '📚',
    color: '#F4C7A1',
    targetPerWeek: 5,
  },
  {
    name: 'Meditate 10 minutes',
    category: 'Wellness',
    icon: '🧘',
    color: '#C9B6E4',
    targetPerWeek: 5,
  },
  {
    name: 'Stretch / mobility',
    category: 'Wellness',
    icon: '🤸',
    color: '#E8B4BC',
    targetPerWeek: 5,
  },
  {
    name: 'Journal / reflect',
    category: 'Personal',
    icon: '✍️',
    color: '#F4C7A1',
    targetPerWeek: 5,
  },
];
