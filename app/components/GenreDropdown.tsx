'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface GenreDropdownProps {
  onSelect: (genre: string) => void;
  showAsDropdown?: boolean;
}

export default function GenreDropdown({ onSelect, showAsDropdown = true }: GenreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isGenrePage = pathname.includes('/movies/genre/');
  const currentGenreId = isGenrePage ? pathname.split('/').pop() : 'all';

  const genres = [
    { id: 'all', name: 'All Genres' },
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '18', name: 'Drama' },
    { id: '14', name: 'Fantasy' },
    { id: '27', name: 'Horror' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Science Fiction' },
    { id: '53', name: 'Thriller' }
  ];

  const selectedGenre = genres.find(g => g.id === currentGenreId) || genres[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenreSelect = (genreId: string) => {
    if (genreId === 'all') {
      router.push('/movies');
    } else {
      router.push(`/movies/genre/${genreId}`);
    }
    setIsOpen(false);
    onSelect(genreId);
  };

  if (!showAsDropdown && isGenrePage) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <span className="text-purple-400">{selectedGenre.name}</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-background-light px-4 py-2 rounded-lg border border-purple-600/30 hover:border-purple-400/50 transition-all duration-300"
      >
        <span className="text-gray-300">{selectedGenre.name}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-48 bg-background-light border border-purple-600/30 rounded-lg shadow-lg py-1 z-50">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreSelect(genre.id)}
              className={`w-full text-left px-4 py-2 transition-colors duration-200 ${
                genre.id === currentGenreId
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-gray-300 hover:text-purple-400 hover:bg-purple-500/10'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 