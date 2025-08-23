export default function DeniedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-3">You chose not to proceed</h1>
        <p className="text-gray-300 mb-6">
          No problem. You can return to the homepage or enter later.
        </p>
        <div className="space-x-3">
          <a
            href="/"
            className="inline-block rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-medium"
          >
            Go to homepage
          </a>
          <a
            href="/content-warning"
            className="inline-block rounded-lg bg-gray-700 hover:bg-gray-600 px-4 py-2 font-medium"
          >
            Change my choice
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          Tip: If you don’t see the prompt again, clear cookies for this site to reset the choice.
        </p>
      </div>
    </main>
  );
}
