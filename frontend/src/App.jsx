import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { user, token } = useAuth?.() || {};
  const isAuthenticated = token || user || localStorage.getItem('token');
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login and remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-stone-100 text-stone-900 font-sans">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#f5f5f4', // stone-100
                  color: '#1c1917',     // stone-900
                  border: '1px solid #d6d3d1', // stone-300
                },
                success: {
                  iconTheme: { primary: '#991b1b', secondary: '#ffffff' }, // crimson red
                },
              }}
            />
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<MoviesPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movies/:id" element={<MovieDetails />} />

                {/* Protected Booking Flow Routes */}
                <Route
                  path="/movies/:id/seats"
                  element={
                    <ProtectedRoute>
                      <SeatSelection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking/summary"
                  element={
                    <ProtectedRoute>
                      <BookingSummary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking/payment"
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking/confirmation/:bookingId"
                  element={
                    <ProtectedRoute>
                      <TicketConfirmation />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}