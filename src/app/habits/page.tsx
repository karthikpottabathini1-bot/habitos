'use client';

import { useState } from 'react';
import HabitNav from '@/components/habit-nav';
import { useHabitOS } from '@/lib/habitos-context';
import { HabitIcon } from '@/lib/icons';

export default function HabitsPage() {
  const { habits, toggleHabit, deleteHabit, getStreak } = useHabitOS();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <HabitNav />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">My Habits</h2>
          <p className="text-sm text-gray-500 mb-6">Manage all your tracked habits</p>

          <div className="space-y-2">
            {habits.map((habit) => {
              const { current: streak } = getStreak(habit.id);
              const isDone = habit.completedDates.includes(new Date().toISOString().split('T')[0]);
              return (
                <div key={habit.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${habit.color}15`, color: habit.color }}>
                    <HabitIcon name={habit.icon} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">{habit.name}</h3>
                    <p className="text-xs text-gray-400">
                      {habit.frequency} · {streak > 0 ? `${streak}d streak` : 'No streak yet'} · {habit.completedDates.length} total
                    </p>
                  </div>
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    {isDone ? 'Done today' : 'Mark done'}
                  </button>
                  {confirmDelete === habit.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => { deleteHabit(habit.id); setConfirmDelete(null); }}
                        className="px-2 py-1 rounded text-xs bg-red-500 text-white cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(habit.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {habits.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No habits yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
