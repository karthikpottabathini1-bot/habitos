'use client';

import HabitNav from '@/components/habit-nav';
import { useHabitOS } from '@/lib/habitos-context';
import { HabitIcon } from '@/lib/icons';

export default function CalendarPage() {
  const { habits } = useHabitOS();

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return d.toISOString().split('T')[0];
  });
  const todayStr = today.toISOString().split('T')[0];

  const getCompletions = (date: string) => habits.filter((h) => h.completedDates.includes(date));

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex h-screen bg-gray-50">
      <HabitNav />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Calendar</h2>
          <p className="text-sm text-gray-500 mb-6">{monthName}</p>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {days.map((date) => {
                const completions = getCompletions(date);
                const isToday = date === todayStr;
                const dayNum = parseInt(date.split('-')[2], 10);
                return (
                  <div
                    key={date}
                    className={`aspect-square rounded-lg p-1 flex flex-col ${
                      isToday ? 'bg-emerald-50 ring-2 ring-emerald-200' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`text-xs font-medium ${isToday ? 'text-emerald-700' : 'text-gray-500'}`}>{dayNum}</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                      {completions.slice(0, 4).map((h) => (
                        <span key={h.id} className="w-3 h-3 rounded-full" style={{ backgroundColor: h.color }} title={h.name} />
                      ))}
                      {completions.length > 4 && (
                        <span className="text-[9px] text-gray-400 leading-3">+{completions.length - 4}</span>
                      )}
                    </div>
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
