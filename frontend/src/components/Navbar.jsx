import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Film, LogOut, LogIn, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-400 hover:text-indigo-300">
        <Film className="w-6 h-6" />
        <span>CinePass</span>
      </Link>

      <div className="flex items-center gap-4">
        {token ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
            >
              <LogIn className="w-4 h-4" /> Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              <UserPlus className="w-4 h-4" /> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}