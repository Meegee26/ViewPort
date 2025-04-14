'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import ViewPortLogo from './ViewPortLogo';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isActive = (path: string) => {
    if (path === '/movies' && pathname === '/movies') return true;
    if (path === '/movies' && pathname.startsWith('/movies/genre/')) return true;
    return pathname === path;
  };

  const getLinkClasses = (path: string) => {
    return isActive(path)
      ? "text-purple-400 block py-2 px-3 font-medium"
      : "text-gray-300 hover:text-purple-300 block py-2 px-3 transition-colors duration-300 font-medium";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-background-light border-b border-purple-900/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <ViewPortLogo />
            </Link>
            <div className="hidden md:block ml-12">
              <div className="flex items-baseline space-x-6">
                <Link
                  href="/movies"
                  className={getLinkClasses("/movies")}
                >
                  Movies
                </Link>
                <Link
                  href="/tv-shows"
                  className={getLinkClasses("/tv-shows")}
                >
                  TV Shows
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background-light text-white placeholder-gray-400 px-4 py-3 rounded-lg border-2 border-purple-600/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 hover:border-purple-300/70 transition-all duration-300"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-purple-400 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background-light border-t border-purple-900/50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/movies"
              className={getLinkClasses("/movies")}
            >
              Movies
            </Link>
            <Link
              href="/tv-shows"
              className={getLinkClasses("/tv-shows")}
            >
              TV Shows
            </Link>
            <div className="px-3 py-2">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies, TV shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    ref={searchInputRef}
                    className="w-full bg-background-card text-white placeholder-gray-400 px-4 py-3 rounded-lg border-2 border-purple-600/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 hover:border-purple-300/70 transition-all duration-300"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 