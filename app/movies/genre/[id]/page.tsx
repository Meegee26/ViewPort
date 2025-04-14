'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from "../../../components/Navigation";
import MovieRow from "../../../components/MovieRow";
import GenreDropdown from "../../../components/GenreDropdown";
import { fetchMovies } from "../../../services/movieService";
import Link from 'next/link';

const genreSubCategories: { [key: string]: { name: string; combinations: number[] }[] } = {
  '28': [ // Action
    { name: 'Action Thrillers', combinations: [28, 53] },
    { name: 'Action Adventure', combinations: [28, 12] },
    { name: 'Sci-Fi Action', combinations: [28, 878] },
    { name: 'Action Comedy', combinations: [28, 35] },
    { name: 'Crime Action', combinations: [28, 80] }
  ],
  '35': [ // Comedy
    { name: 'Romantic Comedy', combinations: [35, 10749] },
    { name: 'Action Comedy', combinations: [35, 28] },
    { name: 'Family Comedy', combinations: [35, 10751] },
    { name: 'Adventure Comedy', combinations: [35, 12] },
    { name: 'Crime Comedy', combinations: [35, 80] }
  ],
  '18': [ // Drama
    { name: 'Romance Drama', combinations: [18, 10749] },
    { name: 'Crime Drama', combinations: [18, 80] },
    { name: 'Family Drama', combinations: [18, 10751] },
    { name: 'Historical Drama', combinations: [18, 36] },
    { name: 'Mystery Drama', combinations: [18, 9648] }
  ],
  '27': [ // Horror
    { name: 'Horror Thriller', combinations: [27, 53] },
    { name: 'Supernatural Horror', combinations: [27, 14] },
    { name: 'Mystery Horror', combinations: [27, 9648] },
    { name: 'Sci-Fi Horror', combinations: [27, 878] },
    { name: 'Horror Comedy', combinations: [27, 35] }
  ],
  '10749': [ // Romance
    { name: 'Romantic Comedy', combinations: [10749, 35] },
    { name: 'Romantic Drama', combinations: [10749, 18] },
    { name: 'Fantasy Romance', combinations: [10749, 14] },
    { name: 'Historical Romance', combinations: [10749, 36] },
    { name: 'Teen Romance', combinations: [10749, 10751] }
  ]
};

const genreNames: { [key: string]: string } = {
  '28': 'Action',
  '35': 'Comedy',
  '18': 'Drama',
  '27': 'Horror',
  '10749': 'Romance',
  '12': 'Adventure',
  '16': 'Animation',
  '80': 'Crime',
  '14': 'Fantasy',
  '878': 'Science Fiction',
  '53': 'Thriller',
  '10751': 'Family'
};

export default function GenrePage() {
  const params = useParams();
  const genreId = params.id as string;
  const [movies, setMovies] = useState<{ [key: string]: any[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      if (!genreId || !genreNames[genreId]) {
        setError('Invalid genre selected');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const subCategories = genreSubCategories[genreId] || [];
        
        const mainGenreMovies = await fetchMovies('discover', 1, { 
          with_genres: genreId 
        });
        
        const subCategoryPromises = subCategories.map(async category => {
          const response = await fetchMovies('discover', 1, { 
            with_genres: category.combinations.join(',')
          });
          return {
            name: category.name,
            movies: response.results
          };
        });

        const subCategoryResults = await Promise.all(subCategoryPromises);
        
        const allMovies = {
          [`Popular ${genreNames[genreId]} Movies`]: mainGenreMovies.results,
          ...subCategoryResults.reduce((acc, { name, movies }) => {
            acc[name] = movies;
            return acc;
          }, {} as { [key: string]: any[] })
        };

        setMovies(allMovies);
      } catch (error) {
        console.error('Error fetching genre movies:', error);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenreMovies();
  }, [genreId]);

  const renderHeader = () => (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <Link 
          href="/movies"
          className="text-3xl font-bold text-white hover:text-purple-400 transition-colors"
        >
          Movies
        </Link>
        <span className="text-gray-400 text-2xl mx-2">/</span>
        <GenreDropdown onSelect={() => {}} showAsDropdown={false} />
      </div>
    </div>
  );

  if (error) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="max-w-[95%] mx-auto py-12 px-4">
          {renderHeader()}
          <p className="text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="max-w-[95%] mx-auto py-12 px-4">
        {renderHeader()}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          Object.entries(movies).map(([category, movieList]) => (
            movieList && movieList.length > 0 && (
              <MovieRow 
                key={category}
                title={category}
                movies={movieList}
              />
            )
          ))
        )}
      </div>
    </main>
  );
} 