'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';

// A new component for the pulsing "skeleton" placeholders while loading
const SkeletonCard = () => (
  <div className="bg-white/5 p-6 rounded-2xl border border-gray-800 animate-pulse">
    <div className="w-full h-48 bg-gray-700 rounded-lg mx-auto"></div>
    <div className="border-t border-gray-700 pt-4 mt-4">
      <div className="h-6 w-3/4 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-700 rounded mb-3"></div>
      <div className="flex flex-wrap gap-2">
        <div className="h-5 w-16 bg-gray-700 rounded-full"></div>
        <div className="h-5 w-20 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [mood, setMood] = useState('');
  const [perfumes, setPerfumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!mood) {
      setError('Please enter a mood or occasion.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPerfumes([]);
    setHasSearched(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/search/${mood}`);
      if (!response.ok) throw new Error('Server response was not ok.');
      const data = await response.json();
      setPerfumes(data.results);
    } catch (error) {
      console.error('Failed to fetch perfumes:', error);
      setError('Could not fetch perfumes. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-black text-white font-sans relative overflow-hidden">
      <div className="w-full max-w-5xl text-center z-10">
        {/* Glassmorphism Container */}
        <div className="bg-black/30 backdrop-blur-xl p-8 sm:p-12 rounded-2xl border border-white/10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3 tracking-tighter">
            ScentSphere
          </h1>
          <p className="text-md sm:text-lg text-gray-300 mb-8">
            Discover your next signature fragrance through the power of AI.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-10">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g., romantic, fresh, professional..."
              className="flex-grow p-4 text-lg bg-white/5 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isLoading ? 'Searching...' : 'Discover'}
            </button>
          </form>

          {/* Display Area */}
          <div className="min-h-[400px] text-left">
            {error && <p className="text-center text-red-400">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Render 3 skeleton cards while loading
                <Fragment>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </Fragment>
              ) : (
                perfumes.map((perfume, index) => (
                  <div 
                    key={index} 
                    className="bg-white/5 p-5 rounded-xl border border-gray-800 flex flex-col gap-4 transition-all duration-300 transform hover:scale-[1.03] hover:border-purple-500/50 fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Image
                      src={perfume['Image URL']}
                      alt={`Bottle of ${perfume.Name}`}
                      width={200}
                      height={200}
                      className="w-full h-48 object-contain rounded-md"
                    />
                    <div className="border-t border-gray-700 pt-4">
                      <h2 className="text-xl font-bold text-purple-300 truncate" title={perfume.Name}>{perfume.Name}</h2>
                      <p className="text-sm text-gray-400 mb-3">by {perfume.Brand}</p>
                      <div className="flex flex-wrap gap-2">
                        {perfume['Main Accords']?.slice(0, 3).map(accord => (
                          <span key={accord} className="bg-purple-900/50 text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">
                            {accord}
                          </span>
                        ))}
                      </div>
                      <a 
                        href={perfume['Purchase URL']} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block w-full mt-4 text-center bg-gray-700/50 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))
              )}
              {hasSearched && !isLoading && perfumes.length === 0 && !error && (
                <div className="col-span-full text-center py-16">
                   <p className="text-gray-500">No fragrances found. Try a different mood like "casual" or "night out".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
