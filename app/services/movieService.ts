import { Movie, MovieResponse } from '../types/movie';

const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL;
const BASE_URL = 'https://api.themoviedb.org/3';

const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

export const getGenres = (genreIds: number[]) => {
  if (!genreIds || !Array.isArray(genreIds)) {
    return [];
  }
  return genreIds.map(id => genreMap[id as keyof typeof genreMap]).filter(Boolean);
};

export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return null;
  return `${IMAGE_URL}/${size}${path}`;
};

interface FetchMoviesOptions {
  with_genres?: string;
  page?: number;
}

export async function fetchMovies(
  type: 'popular' | 'top_rated' | 'upcoming' | 'discover' | 'search',
  page: number = 1,
  options: FetchMoviesOptions = {}
): Promise<MovieResponse> {
  let url = '';
  const params = new URLSearchParams({
    api_key: API_KEY as string,
    language: 'en-US',
    page: page.toString(),
  });

  Object.entries(options).forEach(([key, value]) => {
    if (value) params.append(key, value.toString());
  });

  switch (type) {
    case 'popular':
      url = `${BASE_URL}/movie/popular`;
      break;
    case 'top_rated':
      url = `${BASE_URL}/movie/top_rated`;
      break;
    case 'upcoming':
      url = `${BASE_URL}/movie/upcoming`;
      break;
    case 'discover':
      url = `${BASE_URL}/discover/movie`;
      break;
    case 'search':
      url = `${BASE_URL}/search/movie`;
      break;
    default:
      url = `${BASE_URL}/movie/popular`;
  }

  try {
    const response = await fetch(`${url}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { 
      page: page,
      results: [], 
      total_pages: 0, 
      total_results: 0 
    };
  }
}

export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  if (!query) return { page: 1, results: [], total_pages: 0, total_results: 0 };

  const response = await fetch(
    `${API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to search movies');
  }

  return response.json();
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  const response = await fetch(
    `${API_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }

  return response.json();
};

export const getMovieVideos = async (id: number) => {
  const response = await fetch(
    `${API_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie videos');
  }

  interface VideoResult {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
  }

  const data = await response.json();
  const videos = data.results as VideoResult[];
  const trailer = videos.find(
    (video) =>
      video.type === 'Trailer' && video.site === 'YouTube' && video.official
  ) ||
    videos.find(
      (video) => video.type === 'Teaser' && video.site === 'YouTube'
    ) ||
    videos.find((video) => video.site === 'YouTube');

  return trailer || null;
};

export const getMovieCredits = async (id: number) => {
  const response = await fetch(
    `${API_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie credits');
  }

  const data = await response.json();
  
  const director = data.crew.find((person: any) => person.job === 'Director');
  
  const cast = data.cast.slice(0, 3).map((person: any) => ({
    id: person.id,
    name: person.name,
    character: person.character,
    profile_path: person.profile_path,
  }));

  return {
    director,
    cast
  };
}; 