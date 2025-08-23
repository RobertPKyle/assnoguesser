'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ContentWarningPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [returnTo, setReturnTo] = useState<string>('/');

  useEffect(() => {
    const p = params.get('returnTo');
    if (p && typeof p === 'string' && p.startsWith('/')) {
      setReturnTo(p);
    }
  }, [params]);

  const accept = () => {
    // Set a simple consent cookie for 1 year
    const oneYear = 365 * 24 * 60 * 60;
    document.cookie = `content-ok=true; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
    router.replace(returnTo);
  };

  const deny = () => {
    router.replace('/denied');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-3">May contain adult content</h1>
        <p className="text-gray-300 mb-4">
          The daily image may include material that some viewers could consider mature or sensitive.
          By continuing, you confirm you are of legal age in your jurisdiction and wish to proceed.
        </p>
        <div className="text-xs text-gray-500 mb-6">
          You can change your choice anytime by clearing site cookies in your browser.
        </div>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-medium"
          >
            I understand and want to proceed
          </button>
          <button
            onClick={deny}
            className="rounded-lg bg-gray-700 hover:bg-gray-600 px-4 py-2 font-medium"
          >
            No, take me back
          </button>
        </div>
      </div>
    </main>
  );
}
