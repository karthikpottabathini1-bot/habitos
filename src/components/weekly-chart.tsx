'use client';

import { useHabitOS } from '@/lib/habitos-context';

export default function WeeklyChart() {
  const { getWeekData } = useHabitOS();
  const weekData = getWeekData();
  const maxCompleted = Math.max(...weekData.map((d) => d.completed), 1);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">This Week</h3>
        <span className="text-[11px] text-gray-400">
          {weekData[0].date} — {weekData[6].date}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3 h-32">
        {weekData.map((day) => {
          const height = (day.completed / maxCompleted) * 100;
          const isToday = day.date === today.split('-').slice(1, 3).join('/');
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[11px] font-medium tabular-nums text-gray-500">
                {day.completed > 0 ? day.completed : ''}
              </span>
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isToday
                      ? 'bg-gradient-to-t from-emerald-400 to-emerald-300'
                      : day.completed > 0
                        ? 'bg-emerald-100'
                        : 'bg-gray-50'
                  }`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-[11px] font-medium ${isToday ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {day.day}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
