import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import BookingSteps from '../components/BookingSteps';
import { ArrowLeft, Film, Calendar, Clock, MapPin, Ticket } from 'lucide-react';

const CONVENIENCE_FEE_RATE = 0.05;

export default function BookingSummary() {
  const navigate = useNavigate();
  const { booking, totalAmount } = useContext(BookingContext);

  if (!booking?.seats?.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-display text-3xl text-cream-100">No seats selected yet</p>
        <Link to="/" className="rounded-lg bg-crimson-600 px-5 py-2.5 text-sm font-semibold text-cream-50">
          Browse Movies
        </Link>
      </div>
    );
  }

  const convenienceFee = Math.round(totalAmount * CONVENIENCE_FEE_RATE);
  const grandTotal = totalAmount + convenienceFee;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-sm text-cream-300/60 hover:text-crimson-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to seats
      </button>

      <BookingSteps current={3} />

      <div className="overflow-hidden rounded-2xl border border-ink-500/60 bg-ink-800/60 shadow-card">
        <div className="border-b border-dashed border-ink-500/60 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-crimson-600/15 text-crimson-400">
              <Film className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-3xl tracking-wide text-cream-50">{booking.movie.title}</h1>
              <span className="mt-1 inline-block rounded-full bg-crimson-600/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-crimson-300">
                {booking.movie.genre}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-cream-200/80 sm:grid-cols-3">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-crimson-400" />{booking.show.date}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-crimson-400" />{booking.show.time}</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-crimson-400" />{booking.show.screen}</span>
          </div>

          <div className="mt-5 flex items-start gap-2">
            <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-crimson-400" />
            <p className="text-sm text-cream-200/80">
              Seats: <span className="font-semibold text-cream-50">{booking.seats.map((s) => s.id).join(', ')}</span>
              <span className="ml-1.5 text-cream-300/50">({booking.seats.length} ticket{booking.seats.length !== 1 ? 's' : ''})</span>
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream-300/50">Price Breakdown</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-cream-200/80">
              <span>Tickets ({booking.seats.length})</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-cream-200/80">
              <span>Convenience fee</span>
              <span>₹{convenienceFee}</span>
            </div>
            <div className="flex justify-between border-t border-ink-500/60 pt-2.5 font-display text-2xl tracking-wide text-cream-50">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/booking/payment', { state: { grandTotal } })}
            className="mt-8 w-full rounded-lg bg-crimson-600 py-3 text-sm font-semibold text-cream-50 shadow
                       transition-all hover:bg-crimson-500 hover:shadow-glow"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
