import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, Film } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await API.get('/movies', { params: { search, genre } });
      setMovies(res.data);
    } catch (err) {
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [search, genre]);

  return (
    <div className="py-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold flex items-center gap-2 text-white">
          <Film className="text-indigo-500" /> Now Showing
        </h1>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm w-full focus:outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Drama">Drama</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading catalog...</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 rounded-xl border border-gray-700 p-5 flex flex-col justify-between hover:border-indigo-500 transition">
              <div>
                <span className="text-xs bg-indigo-900 text-indigo-300 font-semibold px-2.5 py-1 rounded-full uppercase">
                  {movie.genre}
                </span>
                <h3 className="text-xl font-bold mt-3 text-white">{movie.title}</h3>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{movie.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
                <span>⏱️ {movie.duration_mins} mins</span>
                <button
                  onClick={() => toast.success(`Selected ${movie.title} for booking!`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition"
                >
                  Book Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}