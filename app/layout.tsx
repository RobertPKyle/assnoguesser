import './globals.css';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'Assnoguesser',
  description: "Guess today's Ass!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen max-w-3xl mx-auto p-4">
          <header className="py-6">
            <h1 className="text-3xl font-bold tracking-tight">🍑 Assnoguesser</h1>
            <p className="text-sm text-gray-400">A new ass every day. Guess together with the world.</p>
           <br></br>
           <a
            href="https://buymeacoffee.com/assnoguesser"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 rounded-lg bg-yellow-400 text-black px-3 py-2 font-semibold hover:bg-yellow-300 transition"
            >
            ☕ Buy me a coffee
             </a>
          </header>
          {children}
          <Analytics />
          <footer className="py-10 text-center text-xs text-gray-500">
          </footer>
        </div>
      </body>
    </html>
  );
}
