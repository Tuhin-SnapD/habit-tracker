import { useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useHabitStore } from '../store/useHabitStore';
import { getForwardDate, getBackwardDate, toDateKey } from '../lib/dates';
import { scrollToSection } from './useActiveSection';

const SECTION_KEYS: Record<string, string> = {
  '1': 'today',
  '2': 'week',
  '3': 'month',
  '4': 'insights',
};

type Options = { onNewHabit: () => void; onOpenSettings: () => void };

export function useKeyboardShortcuts({ onNewHabit, onOpenSettings }: Options) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);
      if (isEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (SECTION_KEYS[e.key]) {
        scrollToSection(SECTION_KEYS[e.key]);
        e.preventDefault();
        return;
      }

      const { selectedDate, setSelectedDate, goToday } = useUIStore.getState();
      const weekStartsOn =
        useHabitStore.getState().settings.weekStartsOn;

      if (e.key === 'ArrowLeft') {
        setSelectedDate(getBackwardDate('day', selectedDate));
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowRight') {
        const target = getForwardDate('day', selectedDate, weekStartsOn);
        if (target) setSelectedDate(target);
        e.preventDefault();
        return;
      }
      if (e.key === 't' || e.key === 'T') {
        if (selectedDate !== toDateKey()) goToday();
        e.preventDefault();
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        const active = useHabitStore
          .getState()
          .habits.filter((h) => !h.archived).length;
        if (active < 99) onNewHabit();
        e.preventDefault();
        return;
      }
      if (e.key === ',' || e.key === 's' || e.key === 'S') {
        onOpenSettings();
        e.preventDefault();
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNewHabit, onOpenSettings]);
}
