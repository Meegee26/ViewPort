'use client';

import { useState, useEffect } from 'react';
import Navigation from "../components/Navigation";
import MovieRow from "../components/MovieRow";
import GenreDropdown from "../components/GenreDropdown";
import { fetchMovies } from "../services/movieService";

export default function MoviesPage() {
  const [movies, setMovies] = useState<{
    popular: any[];
    upcoming: any[];
    trending: any[];
    action: any[];
    comedy: any[];
    drama: any[];
  }>({
    popular: [],
    upcoming: [],
    trending: [],
    action: [],
    comedy: [],
    drama: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllMovies = async () => {
      setIsLoading(true);
      try {
        const [
          popularMovies,
          upcomingMovies,
          trendingMovies,
          actionMovies,
          comedyMovies,
          dramaMovies
        ] = await Promise.all([
          fetchMovies('popular'),
          fetchMovies('upcoming'),
          fetchMovies('popular', 2),
          fetchMovies('discover', 1, { with_genres: '28' }),
          fetchMovies('discover', 1, { with_genres: '35' }),
          fetchMovies('discover', 1, { with_genres: '18' })
        ]);

        setMovies({
          popular: popularMovies.results,
          upcoming: upcomingMovies.results,
          trending: trendingMovies.results,
          action: actionMovies.results,
          comedy: comedyMovies.results,
          drama: dramaMovies.results
        });
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="max-w-[95%] mx-auto py-12 px-4">
        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-3xl font-bold text-white">Movies:</h1>
          <GenreDropdown onSelect={() => {}} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            <MovieRow title="Popular Movies" movies={movies.popular} />
            <MovieRow title="Trending Now" movies={movies.trending} />
            <MovieRow title="Upcoming Releases" movies={movies.upcoming} />
            <MovieRow title="Action & Adventure" movies={movies.action} />
            <MovieRow title="Comedy" movies={movies.comedy} />
            <MovieRow title="Drama" movies={movies.drama} />
          </>
        )}
      </div>
    </main>
  );
} 