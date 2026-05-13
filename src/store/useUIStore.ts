import { create } from 'zustand';
import { toDateKey } from '../lib/dates';

type UIState = {
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  goToday: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  selectedDate: toDateKey(),
  setSelectedDate: (d) => set({ selectedDate: d }),
  goToday: () => set({ selectedDate: toDateKey() }),
}));
