import { createContext, useState, useEffect } from 'react';

export const BookingContext = createContext();

const STORAGE_KEY = 'cinepass_booking_draft';

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const BookingProvider = ({ children }) => {
  const [booking, setBookingState] = useState(loadDraft());

  useEffect(() => {
    if (booking) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
    }
  }, [booking]);

  // movie: the movie object from GET /movies or /movies/:id
  // show: { show_id, date, time, screen } — as returned by GET /movies/:id/shows
  const startBooking = (movie, show) => {
    setBookingState({ movie, show, seats: [] });
  };

  const setSeats = (seats) => {
    setBookingState((prev) => (prev ? { ...prev, seats } : prev));
  };

  const setLastBookingId = (bookingId) => {
    setBookingState((prev) => (prev ? { ...prev, lastBookingId: bookingId } : prev));
  };

  const clearBooking = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setBookingState(null);
  };

  const totalAmount = booking?.seats?.reduce((sum, s) => sum + s.price, 0) ?? 0;

  return (
    <BookingContext.Provider
      value={{ booking, startBooking, setSeats, setLastBookingId, clearBooking, totalAmount }}
    >
      {children}
    </BookingContext.Provider>
  );
};
