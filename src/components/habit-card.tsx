'use client';

import { useHabitOS } from '@/lib/habitos-context';
import { HabitIcon } from '@/lib/icons';

export default function HabitCard({ habitId }: { habitId: string }) {
  const { habits, toggleHabit, getStreak } = useHabitOS();
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return null;

  const isDone = habit.completedDates.includes(new Date().toISOString().split('T')[0]);
  const { current: streak } = getStreak(habitId);
  const completionRate = habit.completedDates.length > 0
    ? Math.min(100, Math.round((habit.completedDates.length / 30) * 100))
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all group">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
        >
          <HabitIcon name={habit.icon} className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{habit.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-gray-400">{habit.frequency}</span>
            {streak > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                {streak}d streak
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => toggleHabit(habitId)}
          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
            isDone
              ? 'bg-emerald-500 border-emerald-500 text-white scale-100'
              : 'border-gray-200 hover:border-emerald-300 group-hover:border-gray-300 hover:scale-110'
          }`}
          style={isDone ? { boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)' } : {}}
        >
          {isDone && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%`, backgroundColor: habit.color }}
          />
        </div>
        <span className="text-[11px] text-gray-400 tabular-nums">{completionRate}%</span>
      </div>
    </div>
  );
}
