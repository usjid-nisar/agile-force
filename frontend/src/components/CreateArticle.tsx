import { useState } from 'react';
import { useCreateArticleMutation } from '../services/articleApi';

export default function CreateArticle() {
  const [createArticle] = useCreateArticleMutation();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createArticle(formData).unwrap();
      setFormData({ title: '', content: '', description: '' });
    } catch (err) {
      console.error('Failed to create article:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-xl rounded-2xl p-10 animate-fade-in transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Article</h2>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
            placeholder="Enter article title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
            placeholder="Brief description of the article"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
            placeholder="Write your article content here..."
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02]"
        >
          Create Article
        </button>
      </form>
    </div>
  );
} 