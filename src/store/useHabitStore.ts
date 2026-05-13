import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Habit, Completion, Settings, EmailJSConfig } from '../lib/types';
import { STARTER_HABITS } from '../lib/starterHabits';

export const MAX_HABITS = 99;

type Theme = 'light' | 'dark';

type HabitState = {
  habits: Habit[];
  completions: Completion[];
  settings: Settings;
  addHabit: (h: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => boolean;
  editHabit: (id: string, patch: Partial<Habit>) => void;
  archiveHabit: (id: string) => void;
  unarchiveHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  seedStarterHabits: () => void;
  setTheme: (t: Theme) => void;
  setBackupEmail: (email: string) => void;
  setEmailJSConfig: (config: EmailJSConfig) => void;
  completeOnboarding: (data: {
    name: string;
    email: string;
    reportTime: string;
  }) => void;
  markReportSent: (date: string) => void;
  exportJSON: () => string;
  importJSON: (raw: string) => { ok: true } | { ok: false; error: string };
  resetAll: () => void;
};

const makeHabit = (
  h: Omit<Habit, 'id' | 'createdAt' | 'archived'>
): Habit => ({
  ...h,
  id: nanoid(8),
  createdAt: new Date().toISOString(),
  archived: false,
});

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: [],
      settings: { theme: 'light', weekStartsOn: 1 },

      addHabit: (h) => {
        const active = get().habits.filter((x) => !x.archived).length;
        if (active >= MAX_HABITS) return false;
        set((s) => ({ habits: [...s.habits, makeHabit(h)] }));
        return true;
      },

      editHabit: (id, patch) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),

      archiveHabit: (id) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, archived: true } : h
          ),
        })),

      unarchiveHabit: (id) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, archived: false } : h
          ),
        })),

      deleteHabit: (id) =>
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
          completions: s.completions.filter((c) => c.habitId !== id),
        })),

      toggleCompletion: (habitId, date) =>
        set((s) => {
          const exists = s.completions.some(
            (c) => c.habitId === habitId && c.date === date
          );
          return {
            completions: exists
              ? s.completions.filter(
                  (c) => !(c.habitId === habitId && c.date === date)
                )
              : [...s.completions, { habitId, date }],
          };
        }),

      seedStarterHabits: () => {
        const slots = MAX_HABITS - get().habits.filter((h) => !h.archived).length;
        const toAdd = STARTER_HABITS.slice(0, Math.max(0, slots));
        set((s) => ({ habits: [...s.habits, ...toAdd.map(makeHabit)] }));
      },

      setTheme: (theme) =>
        set((s) => ({ settings: { ...s.settings, theme } })),

      setBackupEmail: (backupEmail) =>
        set((s) => ({ settings: { ...s.settings, backupEmail } })),

      setEmailJSConfig: (emailjs) =>
        set((s) => ({ settings: { ...s.settings, emailjs } })),

      completeOnboarding: ({ name, email, reportTime }) =>
        set((s) => ({
          settings: {
            ...s.settings,
            onboarded: true,
            name,
            backupEmail: email,
            reportTime,
          },
        })),

      markReportSent: (date) =>
        set((s) => ({
          settings: { ...s.settings, lastReportSentDate: date },
        })),

      exportJSON: () => {
        const { habits, completions, settings } = get();
        return JSON.stringify(
          { version: 1, exportedAt: new Date().toISOString(), habits, completions, settings },
          null,
          2
        );
      },

      importJSON: (raw) => {
        try {
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed.habits) || !Array.isArray(parsed.completions)) {
            return { ok: false, error: 'Invalid file: missing habits or completions.' };
          }
          set({
            habits: parsed.habits,
            completions: parsed.completions,
            settings: parsed.settings ?? get().settings,
          });
          return { ok: true };
        } catch (e) {
          return { ok: false, error: (e as Error).message };
        }
      },

      resetAll: () =>
        set({
          habits: [],
          completions: [],
          settings: { theme: 'light', weekStartsOn: 1 },
        }),
    }),
    {
      name: 'levelup.v1',
      version: 1,
    }
  )
);
