import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { BookingContext } from '../context/BookingContext';
import toast from 'react-hot-toast';
import { CheckCircle2, Calendar, Clock, MapPin, Ticket, Clapperboard, Download } from 'lucide-react';

export default function TicketConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { booking, clearBooking } = useContext(BookingContext);

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    API.get(`/bookings/${bookingId}`)
      .then((res) => {
        if (!cancelled) setRecord(res.data);
      })
      .catch(() => {
        if (!cancelled) toast.error('Could not load this booking');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const handleDone = () => {
    clearBooking();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Clapperboard className="h-8 w-8 animate-pulse text-crimson-500" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-display text-3xl text-cream-100">Booking not found</p>
        <Link to="/" className="rounded-lg bg-crimson-600 px-5 py-2.5 text-sm font-semibold text-cream-50">
          Back to Home
        </Link>
      </div>
    );
  }

  // Movie/show details only exist for the tab that made this booking
  // (kept in-memory + sessionStorage). The record itself — seats, amount,
  // status, timestamp — always comes from the real API response above.
  const movie = booking?.movie;
  const show = booking?.show;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-crimson-600/15">
          <CheckCircle2 className="h-9 w-9 text-crimson-500" />
        </span>
        <h1 className="mt-4 font-display text-4xl tracking-wide text-cream-50">You're All Set!</h1>
        <p className="mt-1 text-sm text-cream-300/60">Your booking is confirmed. Enjoy the show.</p>
      </div>

      {/* Ticket stub */}
      <div className="relative overflow-hidden rounded-2xl border border-ink-500/60 bg-ink-800 shadow-card">
        <div className="bg-gradient-to-br from-crimson-800 via-crimson-900 to-ink-900 p-6 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cream-200/70">CinePass Ticket</p>
          <h2 className="mt-2 font-display text-3xl tracking-wide text-cream-50">
            {movie?.title ?? 'Your Show'}
          </h2>
          {movie?.genre && (
            <span className="mt-2 inline-block rounded-full bg-cream-100/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream-100">
              {movie.genre}
            </span>
          )}
        </div>

        {/* Perforation */}
        <div className="relative h-0">
          <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-ink-900" />
          <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-ink-900" />
          <div className="absolute left-3 right-3 -top-[1px] border-t-2 border-dashed border-ink-500" />
        </div>

        <div className="grid grid-cols-2 gap-5 p-6 sm:p-8">
          {show?.date && (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream-300/40">
                <Calendar className="h-3.5 w-3.5" /> Date
              </p>
              <p className="mt-1 text-sm font-medium text-cream-100">{show.date}</p>
            </div>
          )}
          {show?.time && (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream-300/40">
                <Clock className="h-3.5 w-3.5" /> Time
              </p>
              <p className="mt-1 text-sm font-medium text-cream-100">{show.time}</p>
            </div>
          )}
          {show?.screen && (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream-300/40">
                <MapPin className="h-3.5 w-3.5" /> Screen
              </p>
              <p className="mt-1 text-sm font-medium text-cream-100">{show.screen}</p>
            </div>
          )}
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream-300/40">
              <Ticket className="h-3.5 w-3.5" /> Seats
            </p>
            <p className="mt-1 text-sm font-medium text-cream-100">{record.seats.join(', ')}</p>
          </div>

          <div className="col-span-2 flex items-center justify-between border-t border-ink-500/60 pt-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-cream-300/40">Booking Ref</p>
              <p className="mt-1 font-mono text-xs text-cream-200/70">{record.booking_id}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-cream-300/40">Amount Paid</p>
              <p className="mt-1 font-display text-2xl tracking-wide text-crimson-400">₹{record.total_amount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => window.print()}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-ink-500/60 py-3
                     text-sm font-semibold text-cream-100 transition-colors hover:border-crimson-600 hover:text-crimson-300"
        >
          <Download className="h-4 w-4" /> Save / Print Ticket
        </button>
        <button
          onClick={handleDone}
          className="flex-1 rounded-lg bg-crimson-600 py-3 text-sm font-semibold text-cream-50 shadow
                     transition-all hover:bg-crimson-500 hover:shadow-glow"
        >
          Book Another Movie
        </button>
      </div>
    </div>
  );
}
