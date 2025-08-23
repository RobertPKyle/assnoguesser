'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type Solve = { id: number; name: string; time_ms: number; created_at: string };

export default function Leaderboard({ treeId }: { treeId?: number }) {
  const [rows, setRows] = useState<Solve[]>([]);

  useEffect(() => {
    if (!treeId) return;

    const load = async () => {
      const { data, error } = await supabase
        .from('solves')
        .select('id,name,time_ms,created_at')
        .eq('tree_id', treeId)
        .order('time_ms', { ascending: true })
        .limit(50);
      if (!error && data) setRows(data);
    };

    load();

    const channel = supabase
      .channel('public:solves')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'solves', filter: `tree_id=eq.${treeId}` },
        (payload: any) => {
          const r = payload.new as Solve & { tree_id: number };
          setRows((prev) => {
            const next = [...prev, { id: r.id, name: r.name, time_ms: r.time_ms, created_at: r.created_at }];
            return next.sort((a, b) => a.time_ms - b.time_ms).slice(0, 50);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [treeId]);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    const millis = Math.floor((ms % 1000) / 10);
    const pad = (n: number, l = 2) => String(n).padStart(l, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${pad(millis)}`;
  };

  if (!treeId) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Leaderboard (you may have to refresh to see new times)</h2>
      <div className="divide-y divide-gray-800 border border-gray-800 rounded-lg overflow-hidden">
        {rows.length === 0 && <div className="p-4 text-sm text-gray-400">No solves yet. Be the first!</div>}
        {rows.map((r, i) => (
          <div key={r.id} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <span className="w-6 text-right text-gray-500">{i + 1}</span>
              <span className="font-medium">{r.name}</span>
            </div>
            <div className="font-mono tabular-nums">{fmt(r.time_ms)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
