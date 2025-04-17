'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Movie } from '../types/movie';
import Navigation from '../components/Navigation';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../services/movieService';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchMovies(query, page);
        setMovies(data.results);
        setTotalResults(data.total_results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Failed to search movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  const loadMoreMovies = async () => {
    if (page >= totalPages) return;

    try {
      const nextPage = page + 1;
      const data = await searchMovies(query, nextPage);
      setMovies((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more movies:', error);
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {query ? (
          <>
            <h1 className="text-3xl font-bold text-white mb-2">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-400 mb-8">
              {totalResults} {totalResults === 1 ? 'result' : 'results'} found
            </p>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : movies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {movies.map((movie) => (
                    <div key={movie.id} className="flex-none">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>

                {page < totalPages && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={loadMoreMovies}
                      className="bg-purple-600/40 hover:bg-purple-600/60 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 transform hover:scale-105"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <svg
                  className="w-16 h-16 text-gray-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-xl text-gray-400">No results found for "{query}"</p>
                <p className="text-gray-500 mt-2">Try different keywords or check spelling</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <svg
              className="w-16 h-16 text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-xl text-gray-400">Enter a search term to find movies</p>
          </div>
        )}
      </div>
    </main>
  );
}
