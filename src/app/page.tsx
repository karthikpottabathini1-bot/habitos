'use client';

import { useState } from 'react';
import HabitNav from '@/components/habit-nav';
import HabitCard from '@/components/habit-card';
import WeeklyChart from '@/components/weekly-chart';
import StreakLeaderboard from '@/components/streak-leaderboard';
import { useHabitOS } from '@/lib/habitos-context';
import { HabitIcon, type IconName } from '@/lib/icons';

const ICON_QUICK: IconName[] = ['meditation', 'book', 'water', 'walk', 'code', 'journal', 'stretch', 'learn', 'phone-off', 'calendar'];

export default function HabitOSPage() {
  const { habits, addHabit, getTodayProgress } = useHabitOS();
  const { completed, total } = getTodayProgress();
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const maxStreak = habits.reduce((max, h) => {
    const sorted = [...h.completedDates].sort().reverse();
    let s = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (sorted[i] === expected.toISOString().split('T')[0]) s++;
      else break;
    }
    return Math.max(max, s);
  }, 0);

  const longestHabit = habits.find((h) => {
    const sorted = [...h.completedDates].sort().reverse();
    let s = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (sorted[i] === expected.toISOString().split('T')[0]) s++;
      else break;
    }
    return s === maxStreak;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState<IconName>('star');

  const handleAdd = () => {
    if (newName.trim()) {
      addHabit(newName.trim(), newIcon);
      setNewName('');
      setNewIcon('star');
      setShowAddForm(false);
    }
  };

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex h-screen bg-gray-50">
      <HabitNav />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Good {today.getHours() < 12 ? 'morning' : today.getHours() < 18 ? 'afternoon' : 'evening'}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{dayName}, {dateStr}</p>
            </div>
            <div className="flex items-center gap-3">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Habit
                </button>
              ) : (
                <div className="flex flex-col gap-2 bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex gap-1 flex-wrap">
                    {ICON_QUICK.map((name) => (
                      <button
                        key={name}
                        onClick={() => setNewIcon(name)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          newIcon === name ? 'bg-gray-100 ring-2 ring-gray-300 scale-110' : 'hover:bg-gray-50'
                        }`}
                        style={{ color: newIcon === name ? '#374151' : '#9ca3af' }}
                      >
                        <HabitIcon name={name} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                      placeholder="Habit name..."
                      className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
                      autoFocus
                    />
                    <button onClick={handleAdd} className="px-3 py-1 rounded bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors cursor-pointer">
                      Add
                    </button>
                    <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
                JD
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-xs text-gray-400">Today's Progress</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900 tabular-nums">{completed}</span>
                <span className="text-lg text-gray-300 mb-0.5">/ {total}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-400">Longest Active Streak</span>
              </div>
              <span className="text-3xl font-bold text-gray-900 tabular-nums">{maxStreak}</span>
              <span className="text-sm text-gray-400 ml-1">days</span>
              {longestHabit && maxStreak > 0 && (
                <p className="text-xs text-gray-400 mt-1 truncate">{longestHabit.name}</p>
              )}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <span className="text-xs text-gray-400">Total Habits</span>
              </div>
              <span className="text-3xl font-bold text-gray-900 tabular-nums">{total}</span>
              <span className="text-sm text-gray-400 ml-1">tracked</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">All Habits</h3>
            <span className="text-xs text-gray-400">{habits.length} habit{habits.length !== 1 ? 's' : ''}</span>
          </div>

          {habits.length === 0 ? (
            <div className="text-center py-16 mb-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M7 20h10" /><path d="M12 20v-6" /><path d="M12 14c0-4 4-6 8-6-2 4-2 8 0 12-4 0-8-2-8-6z" /><path d="M12 14c0-4-4-6-8-6 2 4 2 8 0 12 4 0 8-2 8-6z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm mb-4">No habits yet. Start your first one!</p>
              <button onClick={() => setShowAddForm(true)} className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors cursor-pointer">
                Add Your First Habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {habits.map((habit) => (
                <HabitCard key={habit.id} habitId={habit.id} />
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"><WeeklyChart /></div>
            <StreakLeaderboard />
          </div>
        </div>
      </main>
    </div>
  );
}
