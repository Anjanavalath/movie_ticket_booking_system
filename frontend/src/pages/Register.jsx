import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, Popcorn } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', { name, email, password });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-2">
      {/* Left Decorative Panel */}
      <div className="relative hidden overflow-hidden bg-stone-200/50 lg:flex lg:flex-col lg:justify-between lg:p-12 border-r border-stone-300/60">
        <div className="absolute inset-0 bg-spotlight" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-red-800/10 blur-3xl" />

        {/* Content Starts Direct with Hero Text (Duplicate Logo Removed) */}
        <div className="relative my-auto">
          <Popcorn className="h-10 w-10 text-red-800" />
          <h2 className="mt-6 font-display text-5xl leading-[1.05] tracking-wide text-stone-900 font-bold">
            Reserve Your<br />Front Row.
          </h2>
          <p className="mt-4 max-w-sm text-stone-600 text-sm">
            Create your CinePass account to start booking tickets for the movies you don't want to miss.
          </p>
        </div>

        <p className="relative text-xs uppercase tracking-widest font-semibold text-stone-500">
          Premium Cinema Experience
        </p>
      </div>

      {/* Form Panel */}
      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display text-4xl font-bold tracking-wide text-stone-900">Create Account</h1>
            <p className="mt-2 text-sm text-stone-600">Join CinePass and never miss opening night.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-stone-300 bg-stone-200/60 py-2.5 pl-10 pr-3 text-sm text-stone-900
                             placeholder:text-stone-500 transition-colors focus:border-red-800 focus:outline-none
                             focus:ring-1 focus:ring-red-800"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-stone-300 bg-stone-200/60 py-2.5 pl-10 pr-3 text-sm text-stone-900
                             placeholder:text-stone-500 transition-colors focus:border-red-800 focus:outline-none
                             focus:ring-1 focus:ring-red-800"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stone-300 bg-stone-200/60 py-2.5 pl-10 pr-10 text-sm text-stone-900
                             placeholder:text-stone-500 transition-colors focus:border-red-800 focus:outline-none
                             focus:ring-1 focus:ring-red-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-red-800 py-3 text-sm font-semibold text-white shadow-md
                         transition-all hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-stone-900 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}