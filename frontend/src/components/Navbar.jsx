import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Clapperboard, LogOut, LogIn, UserPlus, Menu, X, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-ink-500/60 bg-ink-900/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-2 font-display text-2xl tracking-widest text-black"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson-600 shadow-glow transition-transform group-hover:scale-105">
            <Clapperboard className="h-5 w-5 text-cream-50" />
          </span>
          Cine<span className="text-crimson-500">Pass</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 sm:flex">
          {token ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-crimson-700/60 bg-crimson-600/10 px-4 py-2
                         text-sm font-medium text-crimson-300 transition-colors hover:bg-crimson-600 hover:text-cream-50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-cream-200/80 transition-colors hover:text-cream-50"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 rounded-lg bg-crimson-600 px-4 py-2 text-sm font-semibold text-cream-50
                           shadow transition-all hover:bg-crimson-500 hover:shadow-glow"
              >
                <UserPlus className="h-4 w-4" /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-500/60 text-cream-100 sm:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      
      <div
        className={`overflow-hidden border-t border-ink-500/60 bg-ink-900 transition-[max-height] duration-300 ease-in-out sm:hidden ${
          open ? 'max-h-60' : 'max-h-0 border-t-0'
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-cream-200/80 hover:bg-ink-800"
          >
            <Ticket className="h-4 w-4" /> Now Showing
          </Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-crimson-600 px-3 py-2.5 text-sm font-semibold text-cream-50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-cream-200/80 hover:bg-ink-800"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-crimson-600 px-3 py-2.5 text-sm font-semibold text-cream-50"
              >
                <UserPlus className="h-4 w-4" /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
