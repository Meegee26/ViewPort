'use client';

import { useState } from 'react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import { fetchMovies } from '../services/movieService';

interface MovieGridProps {
  initialMovies: Movie[];
}

export default function MovieGrid({ initialMovies }: MovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const { results: newMovies } = await fetchMovies('popular', nextPage);
      setMovies([...movies, ...newMovies]);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            'Load More'
          )}
        </button>
      </div>
    </div>
  );
} 