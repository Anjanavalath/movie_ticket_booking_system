import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { BookingContext } from '../context/BookingContext';
import toast from 'react-hot-toast';
import { Film, Clock, Languages, Star, Calendar, ArrowLeft, Clapperboard } from 'lucide-react';

function formatDateLabel(iso) {
  const d = new Date(iso + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d - today) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startBooking } = useContext(BookingContext);

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      API.get(`/movies/${id}`),
      API.get(`/movies/${id}/shows`),
    ])
      .then(([movieRes, showsRes]) => {
        if (cancelled) return;
        setMovie(movieRes.data);
        setShows(showsRes.data.shows);
        setSelectedDate(showsRes.data.shows[0]?.date ?? null);
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load movie details');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const dates = [...new Set(shows.map((s) => s.date))];
  const showsForDate = shows.filter((s) => s.date === selectedDate);

  const handleContinue = () => {
    if (!selectedShow) {
      toast.error('Pick a showtime to continue');
      return;
    }
    startBooking(movie, selectedShow);
    navigate(`/movies/${id}/seats`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Clapperboard className="h-8 w-8 animate-pulse text-crimson-500" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="font-display text-3xl text-cream-100">Movie not found</p>
        <Link to="/" className="text-crimson-400 hover:underline">Back to Now Showing</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/" className="mb-6 flex w-fit items-center gap-1.5 text-sm text-cream-300/60 hover:text-crimson-400">
        <ArrowLeft className="h-4 w-4" /> Back to Now Showing
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        {/* Poster */}
        <div className="mx-auto aspect-[2/3] w-full max-w-xs overflow-hidden rounded-2xl border border-ink-500/60 shadow-card lg:mx-0">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-crimson-900 via-ink-800 to-ink-900 text-cream-200/50">
              <Film className="h-14 w-14" strokeWidth={1.25} />
              <span className="font-display text-2xl tracking-widest">CinePass</span>
            </div>
          )}
        </div>

        {/* Info + showtimes */}
        <div>
          <span className="rounded-full bg-crimson-600/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cream-50">
            {movie.genre}
          </span>
          <h1 className="mt-3 font-display text-5xl tracking-wide text-cream-50">{movie.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-cream-300/70">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-crimson-400" />{movie.duration_mins} mins</span>
            <span className="flex items-center gap-1.5"><Languages className="h-4 w-4 text-crimson-400" />{movie.language}</span>
            {movie.rating != null && (
              <span className="flex items-center gap-1.5 text-gold-400">
                <Star className="h-4 w-4 fill-gold-500 text-gold-500" />{movie.rating}
              </span>
            )}
            {movie.release_date && (
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-crimson-400" />{movie.release_date}</span>
            )}
          </div>

          {movie.description && (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-cream-200/70">{movie.description}</p>
          )}

          <div className="mt-8 rounded-2xl border border-ink-500/60 bg-ink-800/60 p-5 sm:p-6">
            <h2 className="font-display text-2xl tracking-wide text-cream-50">Select Showtime</h2>

            {/* Date tabs */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {dates.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDate(d);
                    setSelectedShow(null);
                  }}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedDate === d
                      ? 'bg-crimson-600 text-cream-50'
                      : 'border border-ink-500/60 text-cream-300/70 hover:border-crimson-600 hover:text-crimson-300'
                  }`}
                >
                  {formatDateLabel(d)}
                </button>
              ))}
            </div>

            {/* Time slots */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              {showsForDate.map((show) => (
                <button
                  key={show.show_id}
                  onClick={() => setSelectedShow(show)}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    selectedShow?.show_id === show.show_id
                      ? 'border-crimson-500 bg-crimson-600/20 text-crimson-200'
                      : 'border-ink-500/60 text-cream-200/80 hover:border-crimson-600'
                  }`}
                >
                  {show.time}
                  <span className="ml-2 text-xs text-cream-300/40">{show.screen}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleContinue}
              className="mt-7 w-full rounded-lg bg-crimson-600 py-3 text-sm font-semibold text-cream-50 shadow
                         transition-all hover:bg-crimson-500 hover:shadow-glow sm:w-auto sm:px-10"
            >
              Continue to Seat Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
