'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import GuessBox from '@/components/GuessBox';
import Leaderboard from '@/components/Leaderboard';
import Timer from '@/components/Timer';

type Tree = {
  id: number;
  date: string;
  image_url: string;
  accepted_answers: string[];
  created_at: string;
};

function HomeInner() {
  const params = useSearchParams();
  const [tree, setTree] = useState<Tree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [finalMs, setFinalMs] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [justSolved, setJustSolved] = useState(false);

  const desiredDate = params.get('date') || new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('trees')
        .select('id,date,image_url,accepted_answers,created_at')
        .eq('date', desiredDate)
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        const { data: latest } = await supabase
          .from('trees')
          .select('id,date,image_url,accepted_answers,created_at')
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (latest) setTree(latest);
        else setError('No tree configured.');
      } else {
        setTree(data);
      }
      setLoading(false);
    };

    load();
  }, [desiredDate]);

  useEffect(() => {
    if (!tree) return;
    const solvedKey = `tree-${tree.id}-solved`;
    const v = localStorage.getItem(solvedKey);
    if (v) {
      setSolved(true);
      setFinalMs(Number(v) - Number(localStorage.getItem(`tree-${tree.id}-start`)));
    } else {
      setSolved(false);
      setFinalMs(null);
    }
  }, [tree]);

  const onCorrect = () => {
    if (!tree) return;
    const solvedKey = `tree-${tree.id}-solved`;
    if (!localStorage.getItem(solvedKey)) {
      localStorage.setItem(solvedKey, String(Date.now()));
    }
    setSolved(true);
    setJustSolved(true);
  };

  const onTick = () => {
    if (solved && finalMs == null && tree) {
      const start = Number(localStorage.getItem(`tree-${tree.id}-start`) || Date.now());
      const stop = Number(localStorage.getItem(`tree-${tree.id}-solved`) || Date.now());
      setFinalMs(Math.max(0, stop - start));
    }
  };

  const imgSrc = useMemo(() => {
    if (!tree) return '/placeholder-tree.jpg';
    const v = encodeURIComponent(tree.created_at || tree.date);
    return `${tree.image_url}${tree.image_url.includes('?') ? '&' : '?'}v=${v}`;
  }, [tree]);

  return (
    <main>
      {loading && <div className="p-6">Loading…</div>}
      {error && <div className="p-6 text-red-400">{error}</div>}

      {tree && (
        <div className="space-y-6">
          <div className="aspect-[4/3] relative w-full overflow-hidden rounded-xl border border-gray-800 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgSrc} alt="Today's tree" className="absolute inset-0 h-full w-full object-contain" />
          </div>

          <GuessBox acceptedAnswers={tree.accepted_answers} onCorrect={onCorrect} />

          <div className="flex items-center justify-between">
            <Timer treeId={tree.id} solved={solved} onTick={onTick} />
            <div className="text-sm text-gray-400">Date: {tree.date}</div>
          </div>

          {solved && (
            <div className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-4">
              <h3 className="font-semibold mb-2">You solved it! 🎉 Add your name to the board:</h3>
              <div className="flex items-center gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={async () => {
                    if (!tree || finalMs == null || name.trim().length === 0) return;
                    const { error } = await supabase.from('solves').insert({
                      tree_id: tree.id,
                      name: name.trim().slice(0, 32),
                      time_ms: finalMs,
                    });
                    if (!error) {
                      setName('');
                      setJustSolved(false);
                    } else {
                      alert('Failed to submit your time. Please try again.');
                    }
                  }}
                  disabled={!justSolved && name.trim() === ''}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-medium"
                >
                  Submit
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">(Your time is captured automatically.)</p>
            </div>
          )}

          <Leaderboard treeId={tree.id} />
        </div>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="p-6">Loading…</main>}>
      <HomeInner />
    </Suspense>
  );
}
