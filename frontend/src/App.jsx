import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import MoviesPage from './pages/MoviesPage';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import BookingSummary from './pages/BookingSummary';
import Payment from './pages/Payment';
import TicketConfirmation from './pages/TicketConfirmation';

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-ink-900 text-cream-100 font-sans">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1c1616',
                  color: '#fbf8ee',
                  border: '1px solid #332727',
                },
                success: { iconTheme: { primary: '#8B0000', secondary: '#fbf8ee' } },
              }}
            />
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<MoviesPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route path="/movies/:id/seats" element={<SeatSelection />} />
                <Route path="/booking/summary" element={<BookingSummary />} />
                <Route path="/booking/payment" element={<Payment />} />
                <Route path="/booking/confirmation/:bookingId" element={<TicketConfirmation />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}