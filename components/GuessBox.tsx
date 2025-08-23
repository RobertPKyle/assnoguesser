'use client';
import { useEffect, useMemo, useState } from 'react';
import { normalizeAnswer } from '@/lib/normalize';

export default function GuessBox({
  acceptedAnswers,
  onCorrect,
}: {
  acceptedAnswers: string[];
  onCorrect: () => void;
}) {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const normalizedSet = useMemo(
    () => new Set(acceptedAnswers.map(normalizeAnswer)),
    [acceptedAnswers]
  );

  useEffect(() => setFeedback(null), [guess]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = normalizedSet.has(normalizeAnswer(guess));
    if (ok) {
      setFeedback('Correct!');
      onCorrect();
    } else {
      setFeedback('Nope — keep gooning....I mean guessing!');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Guess the Ass…"
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-medium"
      >
        Guess
      </button>
      {feedback && <div className="text-sm text-gray-300">{feedback}</div>}
    </form>
  );
}
