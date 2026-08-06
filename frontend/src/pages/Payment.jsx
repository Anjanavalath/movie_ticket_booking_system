import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import API from '../services/api';
import { BookingContext } from '../context/BookingContext';
import BookingSteps from '../components/BookingSteps';
import toast from 'react-hot-toast';
import { CreditCard, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, totalAmount, setLastBookingId, clearBooking } = useContext(BookingContext);

  const grandTotal = location.state?.grandTotal ?? totalAmount;

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  if (!booking?.seats?.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-display text-3xl text-cream-100">Nothing to pay for yet</p>
        <Link to="/" className="rounded-lg bg-crimson-600 px-5 py-2.5 text-sm font-semibold text-cream-50">
          Browse Movies
        </Link>
      </div>
    );
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Card fields above are demo-only and are never sent anywhere — this
      // confirms the reservation via the real booking endpoint.
      const res = await API.post('/bookings', {
        show_id: booking.show.show_id,
        seats: booking.seats.map((s) => s.id),
        total_amount: grandTotal,
      });
      setLastBookingId(res.data.booking_id);
      toast.success('Payment successful!');
      navigate(`/booking/confirmation/${res.data.booking_id}`);
    } catch (err) {
      const message = err.response?.data?.detail || 'Payment failed. Please try again.';
      toast.error(message);
      if (err.response?.status === 400) {
        // Someone else grabbed one of these seats — send the user back to pick again.
        clearBooking();
        navigate(`/movies/${booking.movie.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-sm text-cream-300/60 hover:text-crimson-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to summary
      </button>

      <BookingSteps current={4} />

      <div className="rounded-2xl border border-ink-500/60 bg-ink-800/60 p-6 shadow-card sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl tracking-wide text-cream-50">Payment</h1>
          <span className="font-display text-2xl tracking-wide text-crimson-400">₹{grandTotal}</span>
        </div>

        <form onSubmit={handlePay} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream-200/80">Name on Card</label>
            <input
              type="text"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-ink-500/60 bg-ink-800 px-3.5 py-2.5 text-sm text-cream-50
                         placeholder:text-cream-300/30 focus:border-crimson-600 focus:outline-none focus:ring-1 focus:ring-crimson-600"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream-200/80">Card Number</label>
            <div className="relative">
              <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-300/40" />
              <input
                type="text"
                required
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                minLength={19}
                className="w-full rounded-lg border border-ink-500/60 bg-ink-800 py-2.5 pl-10 pr-3 text-sm text-cream-50
                           placeholder:text-cream-300/30 focus:border-crimson-600 focus:outline-none focus:ring-1 focus:ring-crimson-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cream-200/80">Expiry</label>
              <input
                type="text"
                required
                inputMode="numeric"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                minLength={5}
                className="w-full rounded-lg border border-ink-500/60 bg-ink-800 px-3.5 py-2.5 text-sm text-cream-50
                           placeholder:text-cream-300/30 focus:border-crimson-600 focus:outline-none focus:ring-1 focus:ring-crimson-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cream-200/80">CVV</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-300/40" />
                <input
                  type="password"
                  required
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="•••"
                  minLength={3}
                  className="w-full rounded-lg border border-ink-500/60 bg-ink-800 py-2.5 pl-10 pr-3 text-sm text-cream-50
                             placeholder:text-cream-300/30 focus:border-crimson-600 focus:outline-none focus:ring-1 focus:ring-crimson-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-crimson-600 py-3 text-sm font-semibold text-cream-50 shadow
                       transition-all hover:bg-crimson-500 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Processing…' : `Pay ₹${grandTotal}`}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-cream-300/40">
            <ShieldCheck className="h-3.5 w-3.5" /> Demo checkout — no real charge is made.
          </p>
        </form>
      </div>
    </div>
  );
}
