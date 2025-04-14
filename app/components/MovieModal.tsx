'use client';

import { useEffect, useState } from 'react';
import { Movie } from '../types/movie';
import { getMovieVideos, getImageUrl, getGenres, getMovieCredits } from '../services/movieService';

const scrollbarStyles = `
  /* Global scrollbar styles for the modal */
  .modal-content ::-webkit-scrollbar,
  .modal-content::-webkit-scrollbar {
    width: 8px;
  }
  
  .modal-content ::-webkit-scrollbar-track,
  .modal-content::-webkit-scrollbar-track {
    background: rgba(128, 90, 213, 0.1);
    border-radius: 8px;
  }
  
  .modal-content ::-webkit-scrollbar-thumb,
  .modal-content::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 8px;
  }
  
  .modal-content ::-webkit-scrollbar-thumb:hover,
  .modal-content::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.5);
  }
`;

const BackdropPlaceholder = ({ title }: { title: string }) => {
  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 35%)`;
  };

  const bgColor = getColorFromString(title);

  return (
    <div 
      className="w-full h-full flex items-center justify-center"
      style={{ 
        background: `linear-gradient(135deg, ${bgColor}, hsl(265, 70%, 30%))`,
      }}
    >
      <h1 className="text-5xl md:text-7xl font-bold text-white/40 tracking-wider px-6 text-center">
        {title}
      </h1>
    </div>
  );
};

const PosterPlaceholder = ({ title, year }: { title: string, year: string }) => {
  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 35%)`;
  };

  const bgColor = getColorFromString(title);
  const firstLetter = title.charAt(0).toUpperCase();

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center rounded-xl overflow-hidden"
      style={{ 
        background: `linear-gradient(to bottom right, ${bgColor}, hsl(265, 70%, 30%))`,
      }}
    >
      <div className="text-6xl font-bold text-white/90 mb-4 bg-white/10 w-24 h-24 flex items-center justify-center rounded-full">
        {firstLetter}
      </div>
      <div className="px-4 py-2 text-center">
        <h3 className="text-lg text-white font-bold">{title}</h3>
        {year && <p className="text-purple-300 text-sm mt-1">{year}</p>}
      </div>
    </div>
  );
};

interface MovieModalProps {
  movie: ExtendedMovie;
  onClose: () => void;
}

interface ExtendedMovie extends Movie {
  vote_count: number;
  popularity: number;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Director {
  id: number;
  name: string;
  profile_path: string | null;
}

interface Genre {
  id: number;
  name: string;
}

interface Credits {
  director: Director | null;
  cast: CastMember[];
}

interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const [trailer, setTrailer] = useState<VideoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<Credits>({ director: null, cast: [] });
  const [genreList, setGenreList] = useState<Genre[]>([]);
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const genres = getGenres(movie.genre_ids || []);
  const rating = Math.floor(movie.vote_average * 10);
  
  const getRatingStyles = (score: number) => {
    if (score >= 75) {
      return {
        background: 'bg-gradient-to-r from-green-500 to-emerald-600',
        text: 'text-emerald-50',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
      };
    } else if (score >= 60) {
      return {
        background: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        text: 'text-yellow-50',
        glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]'
      };
    } else {
      return {
        background: 'bg-gradient-to-r from-red-500 to-red-600',
        text: 'text-red-50',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
      };
    }
  };

  const ratingStyles = getRatingStyles(rating);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatReleaseDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [videoData, creditsData] = await Promise.all([
          getMovieVideos(movie.id),
          getMovieCredits(movie.id)
        ]);
        
        setTrailer(videoData);
        setCredits(creditsData);
        
        if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
          const genreMapping: Record<number, string> = {
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
            878: 'Science Fiction',
            10770: 'TV Movie',
            53: 'Thriller',
            10752: 'War',
            37: 'Western'
          };
          
          const genreObjects = movie.genre_ids.map(id => ({
            id,
            name: genreMapping[id] || 'Unknown'
          }));
          
          setGenreList(genreObjects);
        }
      } catch (error) {
        console.error('Failed to fetch movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movie.id, movie.genre_ids]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      <style jsx global>{scrollbarStyles}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="relative bg-gradient-to-br from-background via-background/95 to-background/90 rounded-2xl overflow-hidden w-[95vw] max-w-7xl mx-4 max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.7)]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-all duration-300 transform hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col h-[90vh] modal-content">
            {/* Video/Image Section */}
            <div className="relative w-full aspect-video bg-black">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : trailer ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : backdropUrl ? (
                <img
                  src={backdropUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BackdropPlaceholder title={movie.title} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
              
              {/* Action Buttons - Overlay on video */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </button>
                <button className="bg-gray-700/80 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to List
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="flex gap-8 items-start">
                {/* Poster */}
                <div className="hidden lg:block flex-shrink-0">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      className="w-64 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-64 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden">
                      <PosterPlaceholder 
                        title={movie.title} 
                        year={year ? year.toString() : ''} 
                      />
                    </div>
                  )}
                </div>

                {/* Movie Details */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-wide flex items-center gap-4">
                      {movie.title}
                      <span className="text-2xl text-gray-400 font-normal">({year})</span>
                      <div className={`flex items-center gap-2 ${ratingStyles.background} ${ratingStyles.glow} px-4 py-2 rounded-xl ml-2 transition-all duration-300`}>
                        <svg className={`w-6 h-6 ${ratingStyles.text}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className={`text-2xl font-bold ${ratingStyles.text}`}>{rating}%</span>
                      </div>
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {genres.map((genreName, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-purple-900 bg-opacity-50 text-purple-100 rounded-full hover:bg-purple-800 transition-colors"
                        >
                          {genreName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Overview</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      {movie.overview || "No overview available for this title."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-gray-400 font-medium mb-1">Release Date</h3>
                        <p className="text-white">{formatReleaseDate(movie.release_date)}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 font-medium mb-1">Director</h3>
                        {credits.director ? (
                          <p className="text-white">{credits.director.name}</p>
                        ) : (
                          <p className="text-gray-500">Unknown</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-gray-400 font-medium mb-1">Main Cast</h3>
                        {credits.cast && credits.cast.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {credits.cast.map(actor => (
                              <div key={actor.id} className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                                  {actor.profile_path ? (
                                    <img 
                                      src={getImageUrl(actor.profile_path, 'w200') || ''}
                                      alt={actor.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                      {actor.name.substring(0, 1)}
                                    </div>
                                  )}
                                </div>
                                <p className="text-white text-sm">
                                  <span>{actor.name}</span>
                                  <span className="text-gray-400 text-xs ml-1">
                                    ({actor.character})
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No cast information</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 