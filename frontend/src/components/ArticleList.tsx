import { useState } from 'react';
import { useGetArticlesQuery, useDeleteArticleMutation } from '../services/articleApi';
import EditArticle from './EditArticle';

export default function ArticleList() {
  const { data: articles, isLoading, error } = useGetArticlesQuery();
  const [deleteArticle] = useDeleteArticleMutation();
  const [editingArticle, setEditingArticle] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading articles</div>;

  return (
    <div className="space-y-4">
      {articles?.map((article) => (
        <div key={article._id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
              <p className="mt-2 text-gray-600 line-clamp-3">{article.content}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingArticle(article._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => deleteArticle(article._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          
          {editingArticle === article._id && (
            <EditArticle
              article={article}
              onClose={() => setEditingArticle(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
} 