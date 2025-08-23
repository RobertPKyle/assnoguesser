'use client';
import { useEffect, useRef, useState } from 'react';

export default function Timer({
  treeId,
  solved,
  onTick,
}: {
  treeId: number | undefined;
  solved: boolean;
  onTick?: (ms: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!treeId) return;
    const startKey = `tree-${treeId}-start`;
    const solvedKey = `tree-${treeId}-solved`;

    if (!localStorage.getItem(startKey)) {
      localStorage.setItem(startKey, String(Date.now()));
    }

    const getElapsed = () => {
      const start = Number(localStorage.getItem(startKey) || Date.now());
      const stop = localStorage.getItem(solvedKey);
      const now = stop ? Number(stop) : Date.now();
      return Math.max(0, now - start);
    };

    const tick = () => {
      const ms = getElapsed();
      setElapsed(ms);
      onTick?.(ms);
      if (!solved) {
        raf.current = requestAnimationFrame(tick);
      }
    };

    tick();
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [treeId, solved, onTick]);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    const millis = Math.floor((ms % 1000) / 10);
    const pad = (n: number, l = 2) => String(n).padStart(l, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${pad(millis)}`;
  };

  return (
    <div className="font-mono text-2xl tabular-nums" aria-live="polite">
      ⏱️ {fmt(elapsed)}
    </div>
  );
}
