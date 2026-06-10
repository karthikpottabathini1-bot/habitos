'use client';

import { useState } from 'react';

const LUMIN_URL = 'https://lumin-dun.vercel.app';

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'start' | 'chat' | 'done'>('start');
  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [sending, setSending] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const loadNextQuestion = async (newAnswers: string[]) => {
    setLoading(true);
    try {
      const res = await fetch(`${LUMIN_URL}/api/ai/follow-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request: title, answers: newAnswers }),
      });
      const data = await res.json();
      if (data.done || !data.question) {
        submitRequest(newAnswers);
      } else {
        setCurrentQuestion(data.question);
      }
    } catch {
      submitRequest(newAnswers);
    }
    setLoading(false);
  };

  const handleStart = () => {
    if (!title.trim()) return;
    setStep('chat');
    setAnswers([]);
    loadNextQuestion([]);
  };

  const handleAnswer = (answer?: string) => {
    const a = answer || customInput.trim();
    if (!a) return;
    setCustomInput('');
    const newAnswers = [...answers, a];
    setAnswers(newAnswers);
    setCurrentQuestion('Thinking...');
    loadNextQuestion(newAnswers);
  };

  const submitRequest = async (allAnswers: string[]) => {
    setSending(true);
    try {
      const details = allAnswers.map((a, i) => `Q${i + 1}: ${a}`).join('\n');

      const res = await fetch(`${LUMIN_URL}/api/features`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: title.trim(),
          details,
          username: 'habitos_user',
        }),
      });

      const data = await res.json();
      setRequestId(data.id || 'sent');
      setStep('done');
    } catch {
      alert('Failed to send.');
    }
    setSending(false);
  };

  const reset = () => {
    setStep('start');
    setTitle('');
    setAnswers([]);
    setCurrentQuestion(null);
    setRequestId('');
    setCustomInput('');
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Request a Feature</h3>
              <button onClick={reset} className="text-white/80 hover:text-white cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <p className="text-xs text-white/70 mt-1">Your feedback goes directly to the team</p>
          </div>

          <div className="p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
            {step === 'start' && (
              <div className="space-y-4 pt-2">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs flex-shrink-0">💡</div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-2xl rounded-tl-sm p-3">
                    What feature would you like to see in HabitOS?
                  </p>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  placeholder="e.g. Add dark mode..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-300"
                  autoFocus
                />
                <button
                  onClick={handleStart}
                  disabled={!title.trim()}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 'chat' && (
              <div className="space-y-4 pt-2">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs flex-shrink-0">💡</div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-2xl rounded-tl-sm p-3 font-medium">
                    {title}
                  </p>
                </div>

                {answers.map((a, i) => (
                  <div key={i} className="flex justify-end">
                    <p className="text-sm text-white bg-emerald-500 rounded-2xl rounded-tr-sm p-3 max-w-[80%]">{a}</p>
                  </div>
                ))}

                {loading ? (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
                    <p className="text-sm text-gray-400 italic bg-gray-50 rounded-2xl rounded-tl-sm p-3">Thinking...</p>
                  </div>
                ) : currentQuestion ? (
                  <>
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-2xl rounded-tl-sm p-3">{currentQuestion}</p>
                    </div>
                    <div className="flex gap-2 pl-9">
                      <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAnswer(); }}
                        placeholder="Type your answer..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-300"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAnswer()}
                        disabled={!customInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : null}

                {sending && (
                  <p className="text-center text-sm text-gray-400 py-2">Sending your request to Lumin...</p>
                )}
              </div>
            )}

            {step === 'done' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-900">Request Sent!</p>
                <p className="text-sm text-gray-500">The team will review it soon.</p>
                <p className="text-xs text-gray-400">ID: {requestId}</p>
                <button onClick={reset} className="px-5 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors cursor-pointer">
                  Done
                </button>
              </div>
            )}
          </div>
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
