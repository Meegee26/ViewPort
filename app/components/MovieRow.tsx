'use client';

import { useRef } from 'react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -1000 : 1000;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative mb-16 group">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      <div className="relative">
        {/* Left scroll button */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background via-background/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-full w-12 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Right scroll button */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background via-background/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-full w-12 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Movies container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth relative"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            maskImage: 'linear-gradient(to right, black 0%, black 98%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 0%, black 98%, transparent 100%)'
          }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-[180px]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 