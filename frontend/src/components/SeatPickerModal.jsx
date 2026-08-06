import React, { useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { X, Check } from 'lucide-react';

const ALL_SEATS = [
  'A1', 'A2', 'A3', 'A4',
  'B1', 'B2', 'B3', 'B4',
  'C1', 'C2', 'C3', 'C4',
  'D1', 'D2', 'D3', 'D4'
];

const SEAT_PRICE = 200; // Price in ₹ per seat

export default function SeatPickerModal({ movie, onClose, onBookingSuccess }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setLoading(true);
    try {
      await API.post('/bookings', {
        show_id: movie.id,
        seats: selectedSeats,
        total_amount: selectedSeats.length * SEAT_PRICE,
      });

      toast.success(`Successfully booked ${selectedSeats.length} seat(s)!`);
      if (onBookingSuccess) onBookingSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Booking failed. Seat may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#fdfbf7] border border-stone-300 rounded-2xl max-w-md w-full p-6 relative text-stone-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-black transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black mb-1">{movie.title}</h2>
        <p className="text-xs text-stone-600 mb-6">Select your preferred seat(s)</p>

        {/* Cinema Screen Indicator */}
        <div className="w-full bg-red-800/10 text-red-900 font-bold text-center text-xs py-1.5 rounded-lg border border-red-800/20 mb-8 tracking-widest uppercase">
          SCREEN THIS WAY
        </div>

        {/* Seat Grid */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {ALL_SEATS.map((seat) => {
            const isSelected = selectedSeats.includes(seat);
            return (
              <button
                key={seat}
                onClick={() => toggleSeat(seat)}
                className={`py-2.5 rounded-xl font-bold text-sm transition ${
                  isSelected
                    ? 'bg-red-800 text-white shadow-md ring-2 ring-red-900'
                    : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                }`}
              >
                {seat}
              </button>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 uppercase font-semibold">Selected ({selectedSeats.length})</p>
            <p className="text-xl font-extrabold text-red-900">
              ₹{selectedSeats.length * SEAT_PRICE}
            </p>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={loading || selectedSeats.length === 0}
            className="flex items-center gap-2 bg-red-800 hover:bg-red-900 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md"
          >
            <Check className="w-4 h-4" />
            {loading ? 'Booking...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}