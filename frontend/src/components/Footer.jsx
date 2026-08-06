import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, MessageCircle, Send, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-500/60 bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-2xl tracking-widest text-cream-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson-600">
                <Clapperboard className="h-5 w-5 text-cream-50" />
              </span>
              Cine<span className="text-crimson-500">Pass</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-300/60">
              Your seat is waiting. Discover what's playing and book the perfect show, in seconds.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-wide text-cream-100">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream-300/60">
              <li><Link to="/" className="transition-colors hover:text-crimson-400">Now Showing</Link></li>
              <li><Link to="/login" className="transition-colors hover:text-crimson-400">Login</Link></li>
              <li><Link to="/register" className="transition-colors hover:text-crimson-400">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-wide text-cream-100">Genres</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream-300/60">
              <li>Action</li>
              <li>Sci-Fi</li>
              <li>Drama</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-wide text-cream-100">Stay Connected</h4>
            <div className="mt-4 flex gap-3">
              {[MessageCircle, Send, Globe].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-500/60 text-cream-300/70
                             transition-colors hover:border-crimson-600 hover:text-crimson-400"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-500/60 pt-6 text-xs text-cream-300/50 sm:flex-row">
          <p>© {new Date().getFullYear()} CinePass. All rights reserved.</p>
          <p className="font-display tracking-widest text-cream-300/40">GRAB YOUR POPCORN 🍿</p>
        </div>
      </div>
    </footer>
  );
}
