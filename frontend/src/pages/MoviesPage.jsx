import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Film, SlidersHorizontal, Popcorn, Frown } from 'lucide-react';
import toast from 'react-hot-toast';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';

const GENRES = ['Action', 'Sci-Fi', 'Drama'];

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (params) => {
    setLoading(true);
    try {
      const res = await API.get('/movies', { params });
      setMovies(res.data);
    } catch (err) {
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  // Debounced so typing in the hero search doesn't fire a request per keystroke.
  // Same endpoint, same params, same behavior — just fewer network calls.
  useEffect(() => {
    const handle = setTimeout(() => {
      fetchMovies({ search, genre });
    }, 350);
    return () => clearTimeout(handle);
  }, [search, genre]);

  return (
    <div>
      <HeroBanner onSearch={setSearch} />

      <div id="now-showing" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-crimson-400">In theatres now</span>
            <h2 className="mt-1 flex items-center gap-2 font-display text-4xl tracking-wide text-cream-50">
              <Film className="h-7 w-7 text-crimson-500" /> Now Showing
            </h2>
          </div>

          {/* Genre filter chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 pr-1 text-xs font-medium text-cream-300/50">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
            </span>
            <button
              onClick={() => setGenre('')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                genre === ''
                  ? 'bg-crimson-600 text-cream-50'
                  : 'border border-ink-500/60 text-cream-300/70 hover:border-crimson-600 hover:text-crimson-300'
              }`}
            >
              All Genres
            </button>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  genre === g
                    ? 'bg-crimson-600 text-cream-50'
                    : 'border border-ink-500/60 text-cream-300/70 hover:border-crimson-600 hover:text-crimson-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-500/60 py-20 text-center">
            <Frown className="h-10 w-10 text-cream-300/30" />
            <p className="font-display text-2xl tracking-wide text-cream-200/70">No movies found</p>
            <p className="text-sm text-cream-300/50">Try a different title or clear your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Value props — grounded in what CinePass actually offers today */}
        <div className="mt-20 grid grid-cols-1 gap-6 border-t border-ink-500/60 pt-14 sm:grid-cols-3">
          {[
            { icon: Popcorn, title: 'Fresh Titles Daily', desc: 'New releases added to the catalog as soon as they drop.' },
            { icon: SlidersHorizontal, title: 'Find It Fast', desc: 'Search by title or filter by genre to skip the scrolling.' },
            { icon: Film, title: 'One-Tap Booking', desc: 'Pick a movie and lock in your seat in a couple of clicks.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-ink-500/60 bg-ink-800/60 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson-600/15 text-crimson-400">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-xl tracking-wide text-cream-50">{title}</h3>
              <p className="mt-1.5 text-sm text-cream-300/60">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
