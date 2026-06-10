'use client';

import { useState } from 'react';

const LUMIN_URL = 'https://lumin-dun.vercel.app';

const FOLLOW_UPS: Record<string, { q: string; responses: string[] }[]> = {
  default: [
    { q: "Great idea! Can you describe what problem this solves for you?", responses: [] },
    { q: "How would you like this to look or work? Any examples?", responses: [] },
    { q: "On a scale of 1-10, how important is this to you?", responses: ["1-3: Nice to have", "4-6: Would use often", "7-8: Pretty important", "9-10: Dealbreaker"] },
  ],
};

function getFollowUps(title: string) {
  const lower = title.toLowerCase();
  const qs = [...FOLLOW_UPS.default];

  if (lower.includes('dark') || lower.includes('theme') || lower.includes('color') || lower.includes('mode')) {
    qs.splice(1, 1, { q: "Which parts should change? (background, text, buttons, all of it?)", responses: ["Background only", "Everything", "Just text areas", "Not sure"] });
  }
  if (lower.includes('export') || lower.includes('csv') || lower.includes('download')) {
    qs.splice(1, 1, { q: "What format? CSV, JSON, or PDF?", responses: ["CSV", "JSON", "PDF", "All three"] });
  }
  if (lower.includes('streak') || lower.includes('badge') || lower.includes('achievement')) {
    qs.splice(1, 1, { q: "What kind? Streak milestones, level badges, or both?", responses: ["Streak milestones", "Level badges", "Both!", "Not sure"] });
  }
  if (lower.includes('widget') || lower.includes('ios') || lower.includes('mobile')) {
    qs.splice(1, 1, { q: "Which platform? iOS, Android, or both?", responses: ["iOS", "Android", "Both", "Web widget"] });
  }
  if (lower.includes('remind') || lower.includes('notification') || lower.includes('alert')) {
    qs.splice(1, 1, { q: "When should reminders happen? Morning, evening, or custom?", responses: ["Morning", "Evening", "Custom time", "Both morning and evening"] });
  }

  return qs;
}

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'start' | 'chat' | 'done'>('start');
  const [title, setTitle] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [requestId, setRequestId] = useState('');
  const [sending, setSending] = useState(false);

  const questions = title ? getFollowUps(title) : FOLLOW_UPS.default;

  const handleStart = () => {
    if (!title.trim()) return;
    setStep('chat');
    setCurrentQ(0);
    setAnswers([]);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      submitRequest(newAnswers);
    }
  };

  const handleCustomAnswer = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = (e.target as HTMLInputElement).value.trim();
      if (val) handleAnswer(val);
    }
  };

  const submitRequest = async (allAnswers: string[]) => {
    setSending(true);
    try {
      const details = allAnswers.map((a, i) => `${questions[i].q}\n→ ${a}`).join('\n\n');

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
      alert('Failed to send. Check your connection.');
    }
    setSending(false);
  };

  const reset = () => {
    setStep('start');
    setTitle('');
    setCurrentQ(0);
    setAnswers([]);
    setRequestId('');
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Request a Feature</h3>
              <button onClick={reset} className="text-white/80 hover:text-white cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <p className="text-xs text-white/70 mt-1">Your feedback goes directly to the team</p>
          </div>

          {/* Body */}
          <div className="p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
            {step === 'start' && (
              <div className="space-y-4 pt-2">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs flex-shrink-0">
                    💡
                  </div>
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

            {step === 'chat' && currentQ < questions.length && (
              <div className="space-y-4 pt-2">
                {/* Previous Q&A */}
                {answers.map((a, i) => (
                  <div key={i}>
                    <div className="flex gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs flex-shrink-0">
                        🤖
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-2xl rounded-tl-sm p-3">
                        {questions[i].q}
                      </p>
                    </div>
                    <div className="flex justify-end mb-2">
                      <p className="text-sm text-white bg-emerald-500 rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                        {a}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Current question */}
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs flex-shrink-0">
                    🤖
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-2xl rounded-tl-sm p-3">
                    {questions[currentQ].q}
                  </p>
                </div>

                {/* Response options */}
                <div className="space-y-1.5 pl-9">
                  {questions[currentQ].responses.length > 0 ? (
                    questions[currentQ].responses.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleAnswer(r)}
                        className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {r}
                      </button>
                    ))
                  ) : (
                    <input
                      type="text"
                      placeholder="Type your answer..."
                      onKeyDown={handleCustomAnswer}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-300"
                      autoFocus
                    />
                  )}
                </div>

                {sending && (
                  <div className="text-center text-sm text-gray-400 py-2">
                    Sending your request...
                  </div>
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
                <div>
                  <p className="text-base font-semibold text-gray-900">Request Sent!</p>
                  <p className="text-sm text-gray-500 mt-1">Your feature request is in review.</p>
                  <p className="text-xs text-gray-400 mt-2">ID: {requestId}</p>
                </div>
                <p className="text-xs text-gray-400">The team will review it and respond soon.</p>
                <button
                  onClick={reset}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors cursor-pointer"
                >
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
