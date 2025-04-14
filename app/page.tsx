import Navigation from "./components/Navigation";
import MovieGrid from "./components/MovieGrid";
import { fetchMovies } from "./services/movieService";

export default async function Home() {
  const { results: movies } = await fetchMovies('popular');

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-background z-10"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Watch Movies & TV Shows
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Stream your favorite content in HD quality
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 transform hover:scale-105">
                Start Watching
              </button>
              <button className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Popular Movies</h2>
        <MovieGrid initialMovies={movies} />
      </div>
    </main>
  );
}
