import React from 'react';
import { Ticket, Search } from 'lucide-react';

export default function HeroBanner({ onSearch }) {
  return (
    <section className="relative overflow-hidden border-b border-ink-500/60">
      {/* Spotlight + grain backdrop */}
      <div className="absolute inset-0 bg-spotlight" />
      <div className="absolute inset-0 bg-film-grain opacity-[0.04] mix-blend-overlay" />
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-crimson-700/20 blur-3xl" />
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <span className="mb-5 flex items-center gap-2 rounded-full border border-crimson-700/50 bg-crimson-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-crimson-300">
          <Ticket className="h-3.5 w-3.5" />
          Now booking for tonight
        </span>

        <h1 className="text-shadow-marquee font-display text-5xl leading-none tracking-wide text-cream-50 sm:text-6xl lg:text-7xl">
          Every Seat Tells
          <br />
          <span className="text-crimson-500">A Story</span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-cream-200/70 sm:text-lg">
          Browse what's playing, pick your favorite, and reserve your seat in
          under a minute. Premium screens. Zero queues.
        </p>

        {/* Live search hooked into the real movie list below */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 flex w-full max-w-lg items-center gap-2 rounded-xl border border-ink-500/60 bg-ink-800/80 p-2 shadow-card backdrop-blur"
        >
          <Search className="ml-2 h-5 w-5 shrink-0 text-cream-300/50" />
          <input
            type="text"
            placeholder="Search for a movie title..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-transparent py-2 text-sm text-cream-50 placeholder:text-cream-300/40 focus:outline-none"
          />
        </form>

        <a
          href="#now-showing"
          className="mt-6 text-xs font-semibold uppercase tracking-widest text-cream-300/50 transition-colors hover:text-crimson-400"
        >
          ↓ Scroll to Now Showing
        </a>
      </div>
    </section>
  );
}
