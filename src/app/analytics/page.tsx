'use client';

import HabitNav from '@/components/habit-nav';
import { useHabitOS } from '@/lib/habitos-context';

export default function AnalyticsPage() {
  const { habits, getWeekData } = useHabitOS();
  const weekData = getWeekData();
  const maxCompleted = Math.max(...weekData.map((d) => d.completed), 1);

  const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  const avgCompletionsPerHabit = habits.length > 0 ? Math.round(totalCompletions / habits.length) : 0;
  const bestDay = weekData.reduce((a, b) => (b.completed > a.completed ? b : a), weekData[0]);
  const completionRate = habits.length > 0
    ? Math.round((weekData.reduce((s, d) => s + d.completed, 0) / (habits.length * 7)) * 100)
    : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <HabitNav />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Analytics</h2>
          <p className="text-sm text-gray-500 mb-6">Your habit insights</p>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 mb-1">Total Completions</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{totalCompletions}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 mb-1">Avg / Habit</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{avgCompletionsPerHabit}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 mb-1">Best Day</p>
              <p className="text-2xl font-bold text-gray-900">{bestDay?.day || '-'}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 mb-1">Weekly Rate</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{completionRate}%</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Weekly Breakdown</h3>
            <div className="space-y-3">
              {weekData.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-10">{day.day}</span>
                  <div className="flex-1 h-6 rounded-md bg-gray-50 overflow-hidden">
                    <div
                      className="h-full rounded-md bg-emerald-400 transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${(day.completed / maxCompleted) * 100}%`, minWidth: day.completed > 0 ? '24px' : '0' }}
                    >
                      {day.completed > 0 && (
                        <span className="text-xs font-medium text-white tabular-nums">{day.completed}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Per Habit Breakdown</h3>
            <div className="space-y-3">
              {habits.map((h) => {
                const rate = h.completedDates.length > 0 ? Math.min(100, Math.round((h.completedDates.length / 30) * 100)) : 0;
                return (
                  <div key={h.id} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 w-40 truncate">{h.name}</span>
                    <div className="flex-1 h-4 rounded-md bg-gray-50 overflow-hidden">
                      <div className="h-full rounded-md transition-all duration-500" style={{ width: `${rate}%`, backgroundColor: h.color }} />
                    </div>
                    <span className="text-xs text-gray-400 tabular-nums w-8 text-right">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
