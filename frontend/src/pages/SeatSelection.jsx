import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { BookingContext } from '../context/BookingContext';
import BookingSteps from '../components/BookingSteps';
import toast from 'react-hot-toast';
import { Armchair, ArrowLeft, Clapperboard } from 'lucide-react';

const MAX_SEATS = 8;

export default function SeatSelection() {
  const navigate = useNavigate();
  const { booking, setSeats } = useContext(BookingContext);

  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!booking?.show?.show_id) return;
    setLoading(true);
    API.get(`/shows/${booking.show.show_id}/seats`)
      .then((res) => setRows(res.data.rows))
      .catch(() => toast.error('Failed to load seat map'))
      .finally(() => setLoading(false));
  }, [booking?.show?.show_id]);

  // Guard: land here directly (refresh/deep link) without a showtime chosen yet.
  if (!booking?.show) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-display text-3xl text-cream-100">No showtime selected</p>
        <p className="text-sm text-cream-300/60">Pick a movie and showtime first.</p>
        <Link to="/" className="rounded-lg bg-crimson-600 px-5 py-2.5 text-sm font-semibold text-cream-50">
          Browse Movies
        </Link>
      </div>
    );
  }

  const toggleSeat = (seatId, price, isBooked) => {
    if (isBooked) return;
    setSelected((prev) => {
      const exists = prev.find((s) => s.id === seatId);
      if (exists) return prev.filter((s) => s.id !== seatId);
      if (prev.length >= MAX_SEATS) {
        toast.error(`You can select up to ${MAX_SEATS} seats`);
        return prev;
      }
      return [...prev, { id: seatId, price }];
    });
  };

  const total = selected.reduce((sum, s) => sum + s.price, 0);

  const handleContinue = () => {
    if (selected.length === 0) {
      toast.error('Select at least one seat');
      return;
    }
    setSeats(selected);
    navigate('/booking/summary');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to={`/movies/${booking.movie.id}`} className="mb-6 flex w-fit items-center gap-1.5 text-sm text-cream-300/60 hover:text-crimson-400">
        <ArrowLeft className="h-4 w-4" /> Change showtime
      </Link>

      <BookingSteps current={2} />

      <div className="text-center">
        <h1 className="font-display text-3xl tracking-wide text-cream-50">{booking.movie.title}</h1>
        <p className="mt-1 text-sm text-cream-300/60">
          {booking.show.date} &middot; {booking.show.time} &middot; {booking.show.screen}
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Clapperboard className="h-8 w-8 animate-pulse text-crimson-500" />
        </div>
      ) : (
        <>
          {/* Screen */}
          <div className="mx-auto mt-10 mb-8 max-w-xl">
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-transparent via-crimson-600 to-transparent shadow-glow" />
            <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-cream-300/40">Screen</p>
          </div>

          <div className="flex flex-col items-center gap-2.5 overflow-x-auto pb-4">
            {rows.map((row) => (
              <div key={row.row} className="flex items-center gap-3">
                <span className="w-6 shrink-0 text-center text-xs font-bold text-cream-300/50">{row.row}</span>
                <div className="flex gap-1.5">
                  {row.seats.map((seat) => {
                    const isSelected = selected.some((s) => s.id === seat.id);
                    return (
                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat.id, row.price, seat.booked)}
                        disabled={seat.booked}
                        title={`${seat.id} · ${row.category} · ₹${row.price}`}
                        className={`flex h-7 w-7 items-center justify-center rounded-t-md border text-[10px] transition-all ${
                          seat.booked
                            ? 'cursor-not-allowed border-ink-500/40 bg-ink-700 text-cream-300/20'
                            : isSelected
                            ? 'border-crimson-500 bg-crimson-600 text-cream-50 scale-110'
                            : row.category === 'Premium'
                            ? 'border-gold-600/50 bg-gold-500/10 text-gold-400 hover:bg-gold-500/25'
                            : 'border-ink-500/60 bg-ink-800 text-cream-300/60 hover:border-crimson-500 hover:text-crimson-300'
                        }`}
                      >
                        <Armchair className="h-3.5 w-3.5" />
                      </button>
                    );
                  })}
                </div>
                <span className="w-16 shrink-0 text-xs text-cream-300/40">{row.category}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-cream-300/60">
            <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-t-md border border-ink-500/60 bg-ink-800" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-t-md border border-crimson-500 bg-crimson-600" /> Selected</span>
            <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-t-md border border-ink-500/40 bg-ink-700" /> Booked</span>
            <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-t-md border border-gold-600/50 bg-gold-500/10" /> Premium</span>
          </div>

          {/* Sticky summary bar */}
          <div className="sticky bottom-4 mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-ink-500/60 bg-ink-800/95 p-4 shadow-card backdrop-blur sm:flex-row sm:px-6">
            <div className="text-sm text-cream-200/80">
              <span className="font-semibold text-cream-50">{selected.length}</span> seat{selected.length !== 1 ? 's' : ''} selected
              {selected.length > 0 && (
                <span className="ml-2 text-cream-300/50">({selected.map((s) => s.id).join(', ')})</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-display text-2xl tracking-wide text-cream-50">₹{total}</span>
              <button
                onClick={handleContinue}
                className="rounded-lg bg-crimson-600 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow
                           transition-all hover:bg-crimson-500 hover:shadow-glow disabled:opacity-40"
                disabled={selected.length === 0}
              >
                Continue
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
