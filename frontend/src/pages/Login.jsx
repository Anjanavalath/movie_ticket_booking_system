import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Clapperboard, Ticket } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      login(response.data.access_token);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-2">
      {/* Decorative panel */}
      <div className="relative hidden overflow-hidden bg-ink-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-spotlight" />
        <div className="absolute inset-0 bg-film-grain opacity-[0.05] mix-blend-overlay" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-crimson-700/25 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2 font-display text-2xl tracking-widest text-black">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson-600">
            <Clapperboard className="h-5 w-5 text-cream-50" />
          </span>
          Cine<span className="text-crimson-500">Pass</span>
        </Link>

        <div className="relative">
          <Ticket className="h-10 w-10 text-crimson-500" />
          <h2 className="mt-6 font-display text-5xl leading-[1.05] tracking-wide text-cream-50">
            The Lights Are<br />Dimming.
          </h2>
          <p className="mt-4 max-w-sm text-cream-200/60">
            Sign back in to pick up right where you left off — your watchlist and bookings are waiting.
          </p>
        </div>

        <p className="relative text-xs uppercase tracking-widest text-cream-300/40">Premium Cinema Experience</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display text-4xl tracking-wide text-cream-50">Welcome Back</h1>
            <p className="mt-2 text-sm text-cream-300/60">Sign in to continue booking your next show.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cream-200/80">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-300/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-ink-500/60 bg-ink-800 py-2.5 pl-10 pr-3 text-sm text-cream-50
                             placeholder:text-cream-300/30 transition-colors focus:border-crimson-600 focus:outline-none
                             focus:ring-1 focus:ring-crimson-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-cream-200/80">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-300/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-ink-500/60 bg-ink-800 py-2.5 pl-10 pr-10 text-sm text-cream-50
                             placeholder:text-cream-300/30 transition-colors focus:border-crimson-600 focus:outline-none
                             focus:ring-1 focus:ring-crimson-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-300/40 hover:text-cream-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-crimson-600 py-3 text-sm font-semibold text-cream-50 shadow
                         transition-all hover:bg-crimson-500 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-cream-300/60">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-crimson-400 hover:text-crimson-300 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
