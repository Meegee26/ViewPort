'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Movie } from '../types/movie';
import { getImageUrl, getMovieVideos, getGenres } from '../services/movieService';
import MovieModal from './MovieModal';
import { useIsMobile } from '../hooks/useMediaQuery';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(75, 85, 99, 0.1);
    border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.5);
    border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(75, 85, 99, 0.7);
  }
`;

const tooltipStyles = {
  content: "bg-gray-900/90 text-white border border-purple-500/30 backdrop-blur-sm px-3 py-1.5 text-sm rounded-lg shadow-lg z-[99999]",
  arrow: "fill-gray-900/90"
};

interface MovieCardProps {
  movie: Movie;
}

const MoviePlaceholder = ({ title }: { title: string }) => {
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
      className="relative group rounded-md overflow-hidden w-full h-full transition-transform duration-300"
      style={{ 
        background: `linear-gradient(to bottom, ${bgColor}, hsl(265, 70%, 30%))`,
      }}
    >
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
          <span className="text-5xl font-bold text-white/90">{firstLetter}</span>
        </div>
        <h3 className="text-white text-center font-medium text-sm line-clamp-2">{title}</h3>
      </div>
    </div>
  );
};

export default function MovieCard({ movie }: MovieCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [trailer, setTrailer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const isMobile = useIsMobile();
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverPositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const imageUrl = getImageUrl(movie.poster_path);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  
  const genres = getGenres(movie.genre_ids);
  const description = movie.overview?.trim() || "No description available for this title yet. Stay tuned for updates!";
  const hasGenres = genres && genres.length > 0;

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleMouseEnter = async (e: React.MouseEvent) => {
    if (isMobile) return;
    
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      hoverPositionRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top
      };
    }
    
    hoverTimeoutRef.current = setTimeout(async () => {
      setIsHovered(true);
      await fetchTrailer();
    }, 300);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
    setTrailer(null);
  };

  const fetchTrailer = async () => {
    if (!isLoading && !trailer) {
      setIsLoading(true);
      try {
        const videoData = await getMovieVideos(movie.id);
        if (videoData) {
          setTrailer(videoData);
        }
      } catch (error) {
        console.error('Failed to fetch trailer:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getPreviewStyle = () => {
    const { x, y } = hoverPositionRef.current;
    
    const previewWidth = 450;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let leftPosition = x;
    
    if (x - previewWidth/2 < 20) {
      leftPosition = previewWidth/2 + 20;
    }
    
    if (x + previewWidth/2 > windowWidth - 20) {
      leftPosition = windowWidth - previewWidth/2 - 20;
    }
    
    const previewHeight = 350; // approximate height
    let topPosition = y - (previewHeight/4);
    let transform = 'translate(-50%, 0)';
    
    if (topPosition < 20) {
      topPosition = y;
      transform = 'translate(-50%, 0)';
    }
    
    if (topPosition + previewHeight > windowHeight - 20) {
      topPosition = windowHeight - previewHeight - 20;
    }
    
    return {
      position: 'fixed',
      top: `${topPosition}px`,
      left: `${leftPosition}px`,
      transform,
      width: `${previewWidth}px`,
      zIndex: 9999
    } as React.CSSProperties;
  };

  const HoverPreview = () => {
    if (!isHovered || !isBrowser || isMobile) return null;
    
    return createPortal(
      <div style={getPreviewStyle()}>
        <TooltipProvider>
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.7)] backdrop-blur-sm">
            <div className="aspect-[16/9] relative">
              {trailer ? (
                <iframe
                  key={trailer.key}
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=0&modestbranding=1&loop=1&playlist=${trailer.key}&mute=0&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
                  className="absolute top-0 left-0 w-full h-full rounded-t-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  loading="eager"
                  frameBorder="0"
                  allowFullScreen
                />
              ) : (
                <img
                  src={movie.backdrop_path ? (getImageUrl(movie.backdrop_path, 'original') || undefined) : undefined}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-t-2xl transform transition-transform hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button 
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-3 transition-all duration-300 transform hover:scale-105 hover:rotate-3"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className={tooltipStyles.content} sideOffset={5}>
                      <p>Play</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button 
                        className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl p-3 transition-all duration-300 transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className={tooltipStyles.content} sideOffset={5}>
                      <p>Add to List</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button 
                        className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl p-3 transition-all duration-300 transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className={tooltipStyles.content} sideOffset={5}>
                      <p>Like</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button 
                        className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl p-3 transition-all duration-300 transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className={tooltipStyles.content} sideOffset={5}>
                      <p>Not for Me</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <button 
                      className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl p-3 transition-all duration-300 transform hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(true);
                        setIsHovered(false);
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className={tooltipStyles.content} sideOffset={5}>
                    <p>More Info</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <h3 className="text-white font-bold text-2xl mb-3 tracking-wide">{movie.title}</h3>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg font-medium">
                    {Math.floor(movie.vote_average * 10)}% Rating
                  </span>
                  <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-lg">{year}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hasGenres ? (
                    genres.map((genre, index) => (
                      <span key={index} className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-md text-xs font-medium">
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-md text-xs font-medium">
                      Genre Unknown
                    </span>
                  )}
                </div>
              </div>
              <div className="max-h-24 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-gray-300 leading-relaxed bg-gray-800/30 p-3 rounded-xl">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>,
      document.body
    );
  };

  const ModalPortal = () => {
    if (!showModal || !isBrowser) return null;
    
    return createPortal(
      <MovieModal
        movie={movie}
        onClose={() => setShowModal(false)}
      />,
      document.body
    );
  };

  return (
    <>
      <style jsx global>{scrollbarStyles}</style>
      <div
        ref={cardRef}
        className="relative group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          setShowModal(true);
          setIsHovered(false);
        }}
      >
        {/* Regular card */}
        <div className={`transition-all duration-300 ${
          isHovered && !isMobile ? 'invisible' : 'visible'
        }`}>
          <div className="aspect-[2/3] bg-background-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={movie.title}
                className="w-full h-full object-cover transform transition-transform hover:scale-105"
              />
            ) : (
              <MoviePlaceholder 
                title={movie.title} 
              />
            )}
          </div>
        </div>

        {/* Render the hover preview using portal */}
        <HoverPreview />
      </div>

      {/* Render MovieModal using portal */}
      <ModalPortal />
    </>
  );
} 