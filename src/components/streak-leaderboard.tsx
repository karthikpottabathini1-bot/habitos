'use client';

import { useHabitOS } from '@/lib/habitos-context';
import { HabitIcon } from '@/lib/icons';

export default function StreakLeaderboard() {
  const { getTopStreaks } = useHabitOS();
  const top = getTopStreaks();

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Top Streaks</h3>
      {top.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          Complete a habit to start a streak
        </p>
      ) : (
        <div className="space-y-3">
          {top.map(({ habit, streak }, i) => (
            <div key={habit.id} className="flex items-center gap-3">
              <span className={`text-xs font-bold w-5 ${
                i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-gray-400'
              }`}>
                {i + 1}
              </span>
              <span style={{ color: habit.color }}>
                <HabitIcon name={habit.icon} className="w-4 h-4" />
              </span>
              <span className="text-sm text-gray-700 flex-1 truncate">{habit.name}</span>
              <span className="text-xs font-semibold text-amber-600 tabular-nums flex items-center gap-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                {streak}d
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
