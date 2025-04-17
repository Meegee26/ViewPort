import { Suspense } from 'react';
import SearchResults from './SearchResults';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-10">Loading search results...</div>}>
      <SearchResults />
    </Suspense>
  );
}
