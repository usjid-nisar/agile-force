import { useState } from 'react';
import { useSearchArticlesQuery } from '../services/articleApi';

export default function ArticleSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading, error } = useSearchArticlesQuery(searchQuery, {
    skip: !searchQuery,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {isLoading && <div>Searching...</div>}
      {error && <div>Error searching articles</div>}
      
      {searchResults && searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Search Results</h3>
          {searchResults.map((article) => (
            <div key={article._id} className="bg-white shadow rounded-lg p-4">
              <h4 className="text-md font-semibold">{article.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{article.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 