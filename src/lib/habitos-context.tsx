'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { IconName } from './icons';

export interface Habit {
  id: string;
  name: string;
  icon: IconName;
  frequency: 'daily' | 'weekly';
  createdAt: string;
  completedDates: string[];
  color: string;
}

const DEFAULT_COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#ef4444', '#6366f1'];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function makeSeedDates(...daysAgoList: number[]): string[] {
  return daysAgoList.map((n) => daysAgo(n));
}

const SEED_HABITS: Habit[] = [
  { id: 'h1', name: 'Morning Meditation', icon: 'meditation', frequency: 'daily', createdAt: daysAgo(30), completedDates: makeSeedDates(0,1,2,3,4,5,6,7,10,12,13,15,18,20,22), color: '#8b5cf6' },
  { id: 'h2', name: 'Read 30 Minutes', icon: 'book', frequency: 'daily', createdAt: daysAgo(25), completedDates: makeSeedDates(0,1,2,3,4,5,6,7), color: '#3b82f6' },
  { id: 'h3', name: 'Drink 8 Glasses of Water', icon: 'water', frequency: 'daily', createdAt: daysAgo(10), completedDates: makeSeedDates(0,1,2,3,5,6,8), color: '#06b6d4' },
  { id: 'h4', name: 'Evening Walk', icon: 'walk', frequency: 'daily', createdAt: daysAgo(50), completedDates: makeSeedDates(0,1,2,3,4,6,7,8,10,14), color: '#22c55e' },
  { id: 'h5', name: 'Code Review', icon: 'code', frequency: 'daily', createdAt: daysAgo(40), completedDates: makeSeedDates(0,1,2,3,4,5,6,7,8,9,10,12,15), color: '#f59e0b' },
  { id: 'h6', name: 'Journal Writing', icon: 'journal', frequency: 'daily', createdAt: daysAgo(15), completedDates: makeSeedDates(0,1,3,4,5), color: '#ec4899' },
  { id: 'h7', name: 'Stretch for 10 Minutes', icon: 'stretch', frequency: 'daily', createdAt: daysAgo(8), completedDates: [], color: '#14b8a6' },
  { id: 'h8', name: 'Learn a New Word', icon: 'learn', frequency: 'daily', createdAt: daysAgo(20), completedDates: makeSeedDates(0,1,2,3,4,7,9,11), color: '#f97316' },
  { id: 'h9', name: 'No Social Media After 9PM', icon: 'phone-off', frequency: 'daily', createdAt: daysAgo(35), completedDates: makeSeedDates(0,1,2,3,4,5,6,8,10,12,14), color: '#ef4444' },
  { id: 'h10', name: 'Weekly Planning', icon: 'calendar', frequency: 'weekly', createdAt: daysAgo(60), completedDates: [daysAgo(0)], color: '#6366f1' },
];

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function calcStreak(completedDates: string[]): { current: number; best: number } {
  if (completedDates.length === 0) return { current: 0, best: 0 };
  const sorted = [...new Set(completedDates)].sort().reverse();
  let current = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (sorted[i] === expected.toISOString().split('T')[0]) {
      current++;
    } else {
      break;
    }
  }
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }
  best = Math.max(best, current);
  return { current, best };
}

interface HabitOSContextType {
  habits: Habit[];
  addHabit: (name: string, icon: IconName) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date?: string) => void;
  isCompletedToday: (habitId: string) => boolean;
  getStreak: (habitId: string) => { current: number; best: number };
  getWeekData: () => { day: string; date: string; completed: number; total: number }[];
  getTodayProgress: () => { completed: number; total: number };
  getTopStreaks: () => { habit: Habit; streak: number }[];
}

const HabitOSContext = createContext<HabitOSContextType | null>(null);

function loadFromStorage(): Habit[] {
  if (typeof window === 'undefined') return SEED_HABITS;
  try {
    const raw = localStorage.getItem('habitos');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return SEED_HABITS;
}

function saveToStorage(habits: Habit[]) {
  try {
    localStorage.setItem('habitos', JSON.stringify(habits));
  } catch { /* ignore */ }
}

export function HabitOSProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHabits(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(habits);
  }, [habits, hydrated]);

  const addHabit = useCallback((name: string, icon: IconName) => {
    setHabits((prev) => [
      {
        id: `h_${Date.now()}`,
        name: name.trim(),
        icon,
        frequency: 'daily',
        createdAt: todayStr(),
        completedDates: [],
        color: DEFAULT_COLORS[prev.length % DEFAULT_COLORS.length],
      },
      ...prev,
    ]);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleHabit = useCallback((id: string, date?: string) => {
    const targetDate = date || todayStr();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const done = h.completedDates.includes(targetDate);
        return {
          ...h,
          completedDates: done
            ? h.completedDates.filter((d) => d !== targetDate)
            : [...h.completedDates, targetDate],
        };
      })
    );
  }, []);

  const isCompletedToday = useCallback(
    (habitId: string) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return false;
      return habit.completedDates.includes(todayStr());
    },
    [habits]
  );

  const getStreak = useCallback(
    (habitId: string) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return { current: 0, best: 0 };
      return calcStreak(habit.completedDates);
    },
    [habits]
  );

  const getWeekData = useCallback(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const completed = habits.filter((h) => h.completedDates.includes(dateStr)).length;
      return {
        day: days[d.getDay()],
        date: `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`,
        completed,
        total: habits.length,
      };
    });
  }, [habits]);

  const getTodayProgress = useCallback(() => {
    const today = todayStr();
    const completed = habits.filter((h) => h.completedDates.includes(today)).length;
    return { completed, total: habits.length };
  }, [habits]);

  const getTopStreaks = useCallback(() => {
    return habits
      .map((habit) => ({ habit, streak: calcStreak(habit.completedDates).current }))
      .filter((s) => s.streak > 0)
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);
  }, [habits]);

  if (!hydrated) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
            H
          </div>
          <span className="text-gray-400 text-sm">Loading HabitOS...</span>
        </div>
      </div>
    );
  }

  return (
    <HabitOSContext.Provider
      value={{
        habits,
        addHabit,
        deleteHabit,
        toggleHabit,
        isCompletedToday,
        getStreak,
        getWeekData,
        getTodayProgress,
        getTopStreaks,
      }}
    >
      {children}
    </HabitOSContext.Provider>
  );
}

export function useHabitOS() {
  const ctx = useContext(HabitOSContext);
  if (!ctx) throw new Error('useHabitOS must be used within HabitOSProvider');
  return ctx;
}
