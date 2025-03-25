import { useState } from 'react';
import { useSearchArticlesQuery } from '../services/articleApi';

interface SearchParams {
  query: string;
  limit: number;
}

export default function ArticleSearch() {
  const [searchInput, setSearchInput] = useState('');
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [searchLimit, setSearchLimit] = useState(5);
  const [debouncedSearch, setDebouncedSearch] = useState<SearchParams>({
    query: '',
    limit: 5
  });

  const { data: searchResults, isLoading, error, isFetching } = useSearchArticlesQuery(
    debouncedSearch,
    {
      skip: !debouncedSearch.query || debouncedSearch.query.length < 2,
    }
  );

  // Debounce the search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = window.setTimeout(() => {
      if (value.trim().length >= 2) {
        setDebouncedSearch({
          query: value.trim(),
          limit: searchLimit
        });
      }
    }, 500);
    
    setTimeoutId(newTimeoutId);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setSearchLimit(newLimit);
    
    // Immediately trigger new search with updated limit if we have a valid query
    if (debouncedSearch.query.length >= 2) {
      setDebouncedSearch(prev => ({
        ...prev,
        limit: newLimit
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search articles (minimum 2 characters)..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-4 pr-10 py-2"
              minLength={2}
            />
            {(isLoading || isFetching) && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            )}
          </div>
          <select
            value={searchLimit}
            onChange={handleLimitChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2"
          >
            <option value={5}>5 results</option>
            <option value={10}>10 results</option>
            <option value={15}>15 results</option>
            <option value={20}>20 results</option>
          </select>
        </div>
        {error && (
          <div className="text-red-600 text-sm">
            {error instanceof Error ? error.message : 'Error performing search'}
          </div>
        )}
        {searchInput && searchInput.length < 2 && (
          <div className="text-gray-600 text-sm">
            Please enter at least 2 characters to search
          </div>
        )}
      </div>

      {!isLoading && !error && searchResults && (
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            <>
              <h3 className="text-lg font-medium">
                Search Results ({searchResults.length})
              </h3>
              {searchResults.map((article) => (
                <div 
                  key={article._id} 
                  className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="text-md font-semibold text-gray-900">
                    {article.title}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {article.content}
                  </p>
                  {article.summary && (
                    <p className="mt-1 text-xs text-gray-500">
                      Summary: {article.summary}
                    </p>
                  )}
                </div>
              ))}
            </>
          ) : debouncedSearch.query.length >= 2 ? (
            <div className="text-gray-600 text-center py-4">
              No articles found matching your search
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 