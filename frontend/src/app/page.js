'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';

const perfumeImages = [
  'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/208052/pexels-photo-208052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1233414/pexels-photo-1233414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [perfumes, setPerfumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % perfumeImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError('');
    setShowResults(true);
    
    try {
      // === THIS IS THE CORRECTED PART ===
      // This now points to your working FastAPI backend endpoint
      const response = await fetch(`http://localhost:8000/search/${searchQuery}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch perfume recommendations. Is the backend running?');
      }
      
      const data = await response.json();
      // Your backend returns data in a `results` key
      setPerfumes(data.results || []);
    } catch (err) {
      setError('Unable to fetch recommendations. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setShowResults(false);
    setPerfumes([]);
    setSearchQuery('');
    setError('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Carousel */}
      <div className="absolute inset-0 w-full h-full">
        {perfumeImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-2000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      {/* Main Content */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-700 ease-in-out ${showResults ? 'pt-24 pb-12' : 'pt-4 pb-4'}`}>
        <div className={`text-center max-w-4xl mx-auto w-full transition-all duration-700 ease-in-out ${showResults ? 'flex-shrink-0' : 'flex-grow flex flex-col justify-center'}`}>
          <h1 className={`font-serif font-light text-gray-100 mb-6 tracking-wide transition-all duration-500 ${showResults ? 'text-4xl' : 'text-6xl md:text-8xl'}`}>
            ScentSphere
          </h1>
          <p className={`text-gray-200 font-light tracking-wide transition-all duration-500 ${showResults ? 'text-lg mb-8' : 'text-xl md:text-2xl mb-12'}`}>
            Discover your signature scent.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe a mood, occasion, or note..."
                disabled={isLoading}
                className="w-full pl-16 pr-8 py-5 text-lg bg-white bg-opacity-10 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-full text-gray-100 placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-400 focus:bg-opacity-15 transition-all duration-300 hover:bg-opacity-15 hover:border-opacity-50"
              />
              {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
                  <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
                </div>
              )}
            </div>
          </form>
          
          {!showResults ? (
            <div className="mt-8">
              <p className="text-gray-300 text-sm font-light tracking-wider">
                Press Enter to begin your scent journey
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <button
                onClick={clearResults}
                className="text-purple-400 hover:text-purple-300 text-sm font-light tracking-wider transition-colors duration-200"
              >
                ← Start a new search
              </button>
            </div>
          )}
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="w-full max-w-6xl mx-auto px-4 py-12 flex-grow">
            {isLoading && (
              <div className="text-center py-20">
                <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-300 text-lg">Finding your perfect scents...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-20">
                <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-300 text-lg">{error}</p>
                </div>
              </div>
            )}

            {!isLoading && !error && perfumes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {perfumes.map((perfume, index) => (
                  <div
                    key={index}
                    className="bg-white bg-opacity-5 backdrop-blur-md rounded-lg p-6 border border-gray-300 border-opacity-20 hover:bg-opacity-10 hover:border-opacity-30 transition-all duration-300 group"
                  >
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={perfume['Image URL']}
                        alt={perfume.Name}
                        className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xl font-serif text-gray-100 group-hover:text-purple-300 transition-colors duration-200">
                      {perfume.Name}
                    </h3>
                    <p className="text-purple-400 font-medium">
                      {perfume.Brand}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {perfume['Main Accords']?.slice(0, 4).map((note, noteIndex) => (
                        <span
                          key={noteIndex}
                          className="px-3 py-1 bg-purple-600 bg-opacity-30 text-purple-200 text-xs rounded-full"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
             {!isLoading && !error && perfumes.length === 0 && showResults && (
                <div className="text-center py-20">
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8 max-w-md mx-auto">
                        <p className="text-gray-300 text-lg">No perfumes found for your search.</p>
                    </div>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
