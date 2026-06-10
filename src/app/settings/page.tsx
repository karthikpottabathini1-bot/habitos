'use client';

import { useState } from 'react';
import HabitNav from '@/components/habit-nav';
import { useHabitOS } from '@/lib/habitos-context';

export default function SettingsPage() {
  const { habits } = useHabitOS();
  const [theme, setTheme] = useState('light');
  const [reminders, setReminders] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <HabitNav />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Settings</h2>
          <p className="text-sm text-gray-500 mb-6">Configure your preferences</p>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Profile</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-lg font-bold text-white">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-400">john@habitos.app</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Display Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-300"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Theme</span>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark (coming soon)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Daily Reminders</span>
                  <button
                    onClick={() => setReminders(!reminders)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${reminders ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${reminders ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Data</h3>
              <div className="text-sm text-gray-500">
                <p>{habits.length} habits tracked</p>
                <p className="mt-1">Data stored locally in your browser</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
