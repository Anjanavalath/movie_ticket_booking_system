import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Languages, Star, Calendar, Ticket, Film } from 'lucide-react';

// A small deterministic "poster" gradient so every card without a real
// poster image still feels distinct instead of repeating one placeholder.
const POSTER_THEMES = [
  'from-crimson-800 via-ink-800 to-ink-900',
  'from-ink-800 via-crimson-900 to-ink-900',
  'from-crimson-900 via-ink-700 to-ink-900',
  'from-ink-700 via-crimson-800 to-ink-900',
];

function themeFor(id) {
  const str = String(id ?? '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return POSTER_THEMES[hash % POSTER_THEMES.length];
}

export default function MovieCard({ movie }) {
  const {
    id,
    title,
    genre,
    language,
    duration_mins,
    poster,
    rating,
    release_date,
  } = movie;

  return (
    <div
      className="group relative flex flex-col bg-ink-800 rounded-2xl overflow-hidden border border-ink-500/60
                 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 hover:border-crimson-600/60
                 transition-all duration-300 ease-out animate-fadeUp"
    >
      {/* Poster */}
      <Link to={`/movies/${id}`} className={`relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-br ${themeFor(id ?? title)}`}>
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-cream-200/50">
            <Film className="h-12 w-12" strokeWidth={1.25} />
            <span className="font-display text-2xl tracking-widest">CinePass</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-transparent" />

        <span className="absolute left-3 top-3 rounded-full bg-crimson-600/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream-50 shadow">
          {genre}
        </span>

        {rating != null && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink-900/80 px-2.5 py-1 text-xs font-semibold text-gold-400 backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            {rating}
          </span>
        )}
      </Link>

      {/* Ticket-stub perforation divider */}
      <div className="relative h-0">
        <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-ink-900" />
        <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-ink-900" />
        <div className="absolute left-3 right-3 -top-[1px] border-t-2 border-dashed border-ink-500" />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-1 font-display text-2xl tracking-wide text-cream-50">
            <Link to={`/movies/${id}`} className="hover:text-crimson-400">{title}</Link>
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-cream-300/70">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-crimson-400" />
              {duration_mins} mins
            </span>
            <span className="flex items-center gap-1">
              <Languages className="h-3.5 w-3.5 text-crimson-400" />
              {language}
            </span>
            {release_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-crimson-400" />
                {release_date}
              </span>
            )}
          </div>
        </div>

        <Link
          to={`/movies/${id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-crimson-600 py-2.5
                     text-sm font-semibold text-cream-50 shadow transition-all duration-200
                     hover:bg-crimson-500 hover:shadow-glow active:scale-[0.98]"
        >
          <Ticket className="h-4 w-4" />
          Book Now
        </Link>
      </div>
    </div>
  );
}
