import { useState } from 'react';
import { useGetArticlesQuery, useDeleteArticleMutation, useGenerateSummaryMutation, useCreateEmbeddingMutation } from '../services/articleApi';
import EditArticle from './EditArticle';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface SummaryDialogState {
  isOpen: boolean;
  title: string;
  summary: string;
}

interface EditDialogState {
  isOpen: boolean;
  article: Article | null;
}

export default function ArticleList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');
  const itemsPerPage = 6;

  const { data: articles, isLoading, error } = useGetArticlesQuery();
  const [deleteArticle] = useDeleteArticleMutation();
  const [generateSummary] = useGenerateSummaryMutation();
  const [createEmbedding] = useCreateEmbeddingMutation();
  const [summaryDialog, setSummaryDialog] = useState<SummaryDialogState>({
    isOpen: false,
    title: '',
    summary: ''
  });
  const [editDialog, setEditDialog] = useState<EditDialogState>({
    isOpen: false,
    article: null
  });

  // Filter and search articles
  const filteredArticles = articles?.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'long' && article.content.length > 1000) ||
      (filter === 'short' && article.content.length <= 1000);
    return matchesSearch && matchesFilter;
  }) || [];

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedArticles.length / itemsPerPage);
  const paginatedArticles = sortedArticles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleGenerateSummary = async (id: string, title: string) => {
    try {
      const result = await generateSummary(id).unwrap();
      setSummaryDialog({
        isOpen: true,
        summary: result.summary,
        title: title,
      });
      toast.success('Summary generated successfully!');
    } catch (err) {
      console.error('Failed to generate summary:', err);
      toast.error('Failed to generate summary');
    }
  };

  const handleCreateEmbedding = async (id: string) => {
    try {
      await createEmbedding(id).unwrap();
      // You might want to show a success message here
    } catch (err) {
      console.error('Failed to create embedding:', err);
    }
  };

  const handleViewSummary = (article: Article) => {
    setSummaryDialog({
      isOpen: true,
      title: article.title,
      summary: article.summary || 'No summary available'
    });
  };

  const handleEdit = (article: Article) => {
    setEditDialog({
      isOpen: true,
      article: article
    });
  };

  const handleCloseEdit = () => {
    setEditDialog({
      isOpen: false,
      article: null
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id).unwrap();
        toast.success('Article deleted successfully');
      } catch (error) {
        toast.error('Failed to delete article');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading articles</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
        
        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="all">All Articles</option>
            <option value="long">Long Articles</option>
            <option value="short">Short Articles</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          Failed to load articles
        </div>
      ) : paginatedArticles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No articles found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article, index) => (
              <div
                key={article._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {article.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.content}
                  </p>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewSummary(article)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                    >
                      View Summary
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-md bg-white shadow-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-md shadow-sm transition-all duration-200 
                    ${page === i + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-md bg-white shadow-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Summary Dialog */}
      <Dialog
        open={summaryDialog.isOpen}
        onClose={() => setSummaryDialog(prev => ({ ...prev, isOpen: false }))}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-xl rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Summary of "{summaryDialog.title}"
            </Dialog.Title>
            
            <div className="mt-2">
              <p className="text-gray-600">{summaryDialog.summary}</p>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                onClick={() => setSummaryDialog(prev => ({ ...prev, isOpen: false }))}
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Dialog */}
      {editDialog.isOpen && editDialog.article && (
        <EditArticle
          article={editDialog.article}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  );
} 