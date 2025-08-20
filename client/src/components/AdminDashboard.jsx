// src/components/AdminDashboard.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dummyNews } from '../data/dummyNews';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState(dummyNews);
  const [editingNews, setEditingNews] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Define fixed categories for a professional news app
  const fixedCategories = ['Politics', 'Business', 'Technology', 'Health', 'Entertainment', 'Sports', 'Science', 'World'];
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    fullContent: '',
    category: '',
    imageUrl: '',
    author: ''
  });

  if (!currentUser) {
    navigate('/admin/login');
    return null;
  }

  // Get unique categories from existing news + fixed categories
  const allCategories = ['All', ...fixedCategories, 
    ...new Set(dummyNews.map(news => news.category).filter(cat => !fixedCategories.includes(cat)))
  ];

  // Filter news by selected category
  const filteredNews = selectedCategory === 'All' 
    ? newsList 
    : newsList.filter(news => news.category === selectedCategory);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      summary: news.summary,
      fullContent: news.fullContent || news.content,
      category: news.category,
      imageUrl: news.imageUrl,
      author: news.author || ''
    });
    setImagePreview(news.imageUrl);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      setNewsList(newsList.filter(news => news.id !== id));
    }
  };

  const handleAddNewClick = () => {
    setShowAddForm(true);
    setEditingNews(null);
    setFormData({
      title: '',
      summary: '',
      fullContent: '',
      category: '',
      imageUrl: '',
      author: ''
    });
    setImagePreview(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For demo purposes, we'll create a local URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({
        ...prev,
        imageUrl: previewUrl // In real app, this would be the uploaded image URL
      }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingNews) {
      // Update existing news
      setNewsList(newsList.map(news => 
        news.id === editingNews.id 
          ? { 
              ...formData, 
              id: editingNews.id, 
              date: new Date().toISOString(),
              content: formData.fullContent.substring(0, 150) + '...' // Create short content from full content
            }
          : news
      ));
    } else {
      // Add new news
      const newNews = {
        ...formData,
        id: Math.max(...newsList.map(n => n.id)) + 1,
        date: new Date().toISOString(),
        content: formData.fullContent.substring(0, 150) + '...' // Create short content from full content
      };
      setNewsList([newNews, ...newsList]);
    }
    
    setShowAddForm(false);
    setEditingNews(null);
    setFormData({
      title: '',
      summary: '',
      fullContent: '',
      category: '',
      imageUrl: '',
      author: ''
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingNews(null);
    setFormData({
      title: '',
      summary: '',
      fullContent: '',
      category: '',
      imageUrl: '',
      author: ''
    });
    setImagePreview(null);
  };

  // Generate preview news object for right sidebar
  const previewNews = showAddForm ? {
    id: 'preview',
    title: formData.title || 'Preview Title',
    summary: formData.summary || 'Preview summary will appear here...',
    content: formData.fullContent ? formData.fullContent.substring(0, 150) + '...' : 'Preview content will appear here...',
    fullContent: formData.fullContent || 'Full preview content will appear here...',
    category: formData.category || 'General',
    date: new Date().toISOString(),
    imageUrl: imagePreview || 'https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    author: formData.author || 'Admin'
  } : null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex">
          {/* Left: Categories - Fixed */}
          <div className="hidden md:block md:w-1/5 flex-shrink-0">
            <div className="h-[calc(100vh-6rem)] overflow-y-auto py-6 pr-2 scrollbar-hide">
              <div className="bg-white rounded-lg p-4 shadow">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                  {allCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle: News List or Add/Edit Form - Scrollable */}
          <div className="w-full md:w-3/5 flex-shrink-0">
            <div className="h-[calc(100vh-6rem)] overflow-y-auto py-6 scrollbar-hide">
              {showAddForm ? (
                // Add/Edit Form (expanded in middle section)
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                      {editingNews ? 'Edit News' : 'Add New News'}
                    </h2>
                    <button
                      onClick={cancelForm}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select a category</option>
                          {fixedCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                        {formData.category === 'Other' && (
                          <input
                            type="text"
                            name="customCategory"
                            placeholder="Enter custom category"
                            onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Summary *</label>
                      <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        required
                        placeholder="Brief summary that will appear in news listings"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                      <textarea
                        name="fullContent"
                        value={formData.fullContent}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="8"
                        required
                        placeholder="Full article content that will appear on the news detail page"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document *</label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*,video/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="w-full border-2 border-dashed border-gray-300 rounded-md px-3 py-8 text-center hover:border-blue-500 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p className="text-sm text-gray-600">Click to upload image or video</p>
                            <p className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, MP4, MOV</p>
                          </div>
                        </button>
                        {imagePreview && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-1">Preview:</p>
                            {imagePreview.type?.includes('video') ? (
                              <video src={imagePreview} controls className="w-full h-32 object-cover rounded" />
                            ) : (
                              <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded" />
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                        <input
                          type="text"
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          placeholder="Author name"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {editingNews ? 'Update News' : 'Add News'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelForm}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // News List
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        {selectedCategory === 'All' ? 'All News' : `${selectedCategory} News`}
                      </h2>
                      <button
                        onClick={handleAddNewClick}
                        className="md:hidden bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Add News
                      </button>
                    </div>
                    
                    {filteredNews.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No news found in this category.</p>
                    ) : (
                      <div className="space-y-6">
                        {filteredNews.map(news => (
                          <div key={news.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md mb-2">
                                  {news.category}
                                </span>
                                <h3 className="text-lg font-semibold">{news.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(news.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(news)}
                                  className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(news.id)}
                                  className="text-red-600 hover:text-red-800 px-2 py-1 rounded text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-700 line-clamp-2">{news.summary}</p>
                            {news.imageUrl && (
                              <img
                                src={news.imageUrl}
                                alt={news.title}
                                className="w-full h-48 object-cover rounded mt-3"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Add News Button or Preview - Fixed */}
          <div className="hidden md:block md:w-1/5 flex-shrink-0">
            <div className="h-[calc(100vh-6rem)] overflow-y-auto py-6 pl-2 scrollbar-hide">
              {showAddForm && previewNews ? (
                // Preview of the news being edited/created
                <div className="bg-white rounded-lg p-4 shadow sticky top-6">
                  <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={previewNews.imageUrl}
                      alt={previewNews.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md mb-1">
                        {previewNews.category}
                      </span>
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(previewNews.date).toLocaleDateString()}
                      </p>
                      <h3 className="font-semibold text-sm mb-2">{previewNews.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{previewNews.summary}</p>
                      <p className="text-xs text-gray-700 line-clamp-3">{previewNews.content}</p>
                      <p className="text-xs text-gray-500 mt-2">By {previewNews.author}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      This is how your news will appear to readers. Changes update in real-time.
                    </p>
                  </div>
                </div>
              ) : (
                // Add News Button (when not editing/creating)
                <div className="bg-white rounded-lg p-4 shadow sticky top-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  
                  <button
                    onClick={handleAddNewClick}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New News
                    </div>
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Click the button to create a new news article. The form will appear in the main content area.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;