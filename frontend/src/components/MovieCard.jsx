import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Languages, Star, Calendar, Ticket, Film } from 'lucide-react';

// Soft, modern gradient placeholders for missing poster images
const POSTER_THEMES = [
  'from-stone-300 via-stone-200 to-stone-400',
  'from-red-100 via-stone-200 to-red-200',
  'from-stone-200 via-stone-300 to-stone-400',
  'from-red-200 via-stone-300 to-stone-200',
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-300/80 bg-stone-200/50 
                 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-red-800/40 
                 hover:shadow-xl hover:shadow-stone-400/20"
    >
      {/* Poster Header */}
      <Link
        to={`/movies/${id}`}
        className={`relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-br ${themeFor(id ?? title)}`}
      >
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-stone-500">
            <Film className="h-12 w-12 text-stone-400" strokeWidth={1.25} />
            <span className="font-display text-2xl font-bold tracking-widest text-stone-600">
              CinePass
            </span>
          </div>
        )}

        {/* Gradient overlay for poster readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />

        {/* Genre Badge */}
        {genre && (
          <span className="absolute left-3 top-3 rounded-full bg-red-800/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
            {genre}
          </span>
        )}

        {/* Rating Badge */}
        {rating != null && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-stone-900/80 px-2.5 py-1 text-xs font-semibold text-amber-400 backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {rating}
          </span>
        )}
      </Link>

      {/* Ticket-stub perforation divider */}
      <div className="relative h-0">
        <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-stone-100" />
        <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-stone-100" />
        <div className="absolute left-3 right-3 -top-[1px] border-t-2 border-dashed border-stone-300" />
      </div>

      {/* Details Container */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-1 font-display text-xl font-bold tracking-wide text-stone-900">
            <Link to={`/movies/${id}`} className="transition-colors hover:text-red-800">
              {title}
            </Link>
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
            {duration_mins && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-red-800" />
                {duration_mins} mins
              </span>
            )}
            {language && (
              <span className="flex items-center gap-1">
                <Languages className="h-3.5 w-3.5 text-red-800" />
                {language}
              </span>
            )}
            {release_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-red-800" />
                {release_date}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/movies/${id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-800 py-2.5
                     text-sm font-semibold text-white shadow transition-all duration-200
                     hover:bg-red-900 hover:shadow-md active:scale-[0.98]"
        >
          <Ticket className="h-4 w-4" />
          Book Now
        </Link>
      </div>
    </div>
  );
}