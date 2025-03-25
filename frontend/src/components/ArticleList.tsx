import { useState } from 'react';
import { useGetArticlesQuery, useDeleteArticleMutation, useGenerateSummaryMutation, useCreateEmbeddingMutation } from '../services/articleApi';
import EditArticle from './EditArticle';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

export default function ArticleList() {
  const { data: articles, isLoading, error } = useGetArticlesQuery();
  const [deleteArticle] = useDeleteArticleMutation();
  const [generateSummary] = useGenerateSummaryMutation();
  const [createEmbedding] = useCreateEmbeddingMutation();
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const [summaryDialog, setSummaryDialog] = useState<{
    isOpen: boolean;
    summary: string;
    title: string;
  }>({
    isOpen: false,
    summary: '',
    title: '',
  });

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
                onClick={() => handleGenerateSummary(article._id, article.title)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Generate Summary
              </button>
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
              <button
                onClick={() => handleCreateEmbedding(article._id)}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Generate Embedding
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
    </div>
  );
} 