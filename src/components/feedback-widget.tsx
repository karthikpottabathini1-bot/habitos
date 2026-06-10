'use client';

import { useState } from 'react';

const LUMIN_URL = 'https://lumin-dun.vercel.app';

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    try {
      await fetch(`${LUMIN_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name.trim() || 'habitos_user', content: feedback.trim() }),
      });
      setSent(true);
      setFeedback('');
      setName('');
      setTimeout(() => { setSent(false); setOpen(false); }, 2000);
    } catch {
      alert('Failed to send feedback');
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Request a Feature</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          {sent ? (
            <div className="text-center py-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" className="mx-auto mb-2"><polyline points="20 6 9 17 4 12" /></svg>
              <p className="text-sm text-gray-600">Sent! Lumin will review it.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-300"
              />
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What feature would you like to see?"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-300 resize-none h-24"
              />
              <button
                onClick={handleSubmit}
                disabled={!feedback.trim()}
                className="w-full py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Send to Lumin
              </button>
              <p className="text-[11px] text-gray-400 text-center">Sent directly to Lumin for processing</p>
            </div>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:scale-110 transition-all cursor-pointer flex items-center justify-center"
        title="Request a feature"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </>
  );
}
