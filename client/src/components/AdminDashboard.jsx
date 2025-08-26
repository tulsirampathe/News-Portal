// src/components/AdminDashboard.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { dummyNews } from "../data/dummyNews";
import axiosInstance from "../../api/axiosInstance";
import Categories from "./Categories";
import toast from "react-hot-toast";

// Fixed categories for a professional news app
const FIXED_CATEGORIES = [
  "Politics",
  "Business",
  "Technology",
  "Health",
  "Entertainment",
  "Sports",
  "Science",
  "World",
];

const MAX_LENGTH = 300;

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // State management
  const [newsList, setNewsList] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [includeVideo, setIncludeVideo] = useState(false);
  const [includeAudio, setIncludeAudio] = useState(false);
  const [filteredNews, setFilteredNews] = useState([]);
  const [error, setError] = useState("");

  // Refs for file inputs
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // Initial form data
  const initialFormData = {
    title: "",
    summary: "",
    content: "",
    category: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    author: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Get unique categories from existing news + fixed categories
  const allCategories = [
    "All",
    ...FIXED_CATEGORIES,
    ...new Set(
      dummyNews
        .map((news) => news.category)
        .filter((cat) => !FIXED_CATEGORIES.includes(cat))
    ),
  ];

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axiosInstance.get("/news");
        setNewsList(res.data.data);
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on selected category
  useEffect(() => {
    const filtered =
      selectedCategory === "All"
        ? newsList
        : newsList.filter((news) => news.category === selectedCategory);
    setFilteredNews(filtered);
  }, [newsList, selectedCategory]);

  // Redirect if not authenticated
  if (!currentUser) {
    navigate("/admin/login");
    return null;
  }

  // Handlers
  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      summary: news.summary,
      content: news.content,
      category: news.category,
      imageUrl: news.imageUrl,
      videoUrl: news.videoUrl || "",
      audioUrl: news.audioUrl || "",
      author: news.author || "",
    });

    // Set previews based on existing media
    setImagePreview(news.imageUrl);
    setVideoPreview(news.videoUrl || null);
    setAudioPreview(news.audioUrl || null);
    setIncludeVideo(!!news.videoUrl);
    setIncludeAudio(!!news.audioUrl);

    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        await axiosInstance.delete(`/news/${id}`);
        setNewsList(newsList.filter((news) => news._id !== id));
        toast.success("News deleted successfully!");
      } catch (error) {
        const serverResponse = error.response;

        if (serverResponse?.data?.errors) {
          serverResponse.data.errors.forEach((err) => {
            toast.error(err.msg);
          });
        } else if (serverResponse?.data?.error) {
          toast.error(serverResponse.data.error);
        } else {
          toast.error("Failed to delete news. Please try again.");
        }
      }
    }
  };

  const handleAddNewClick = () => {
    setShowAddForm(true);
    setEditingNews(null);
    setFormData(initialFormData);
    setImagePreview(null);
    setVideoPreview(null);
    setAudioPreview(null);
    setIncludeVideo(false);
    setIncludeAudio(false);
  };

  // Generic file upload handler
  const handleFileUpload = (e, fileType, setPreview, acceptedTypes) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith(`${fileType}/`)) {
      alert(`Please select a valid ${fileType} file (${acceptedTypes})`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setFormData((prev) => ({
      ...prev,
      [`${fileType}Url`]: previewUrl,
    }));
  };

  const handleImageUpload = (e) =>
    handleFileUpload(e, "image", setImagePreview, "JPG, PNG");

  const handleVideoUpload = (e) =>
    handleFileUpload(e, "video", setVideoPreview, "MP4, MOV");

  const handleAudioUpload = (e) =>
    handleFileUpload(e, "audio", setAudioPreview, "MP3, WAV");

  // Trigger file input clicks
  const triggerImageInput = () => imageInputRef.current?.click();
  const triggerVideoInput = () => videoInputRef.current?.click();
  const triggerAudioInput = () => audioInputRef.current?.click();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      alert("Please upload an image thumbnail for the news article");
      return;
    }

    try {
      if (editingNews) {
        const response = await axiosInstance.put(
          `/news/${editingNews._id}`,
          formData
        );

        const updatedNews = response.data?.data;

        setNewsList((prevList) =>
          prevList.map((news) =>
            news._id === editingNews._id ? updatedNews : news
          )
        );

        toast.success("News updated successfully!");
      } else {
        const response = await axiosInstance.post("/news", formData);

        const newNews = response.data?.data;
        setNewsList((prevList) => [newNews, ...prevList]);

        toast.success("News created successfully!");
      }

      // Reset form
      setShowAddForm(false);
      setEditingNews(null);
      setFormData(initialFormData);
      setImagePreview(null);
      setVideoPreview(null);
      setAudioPreview(null);
      setIncludeVideo(false);
      setIncludeAudio(false);
    } catch (error) {
      const serverResponse = error.response;

      if (serverResponse?.data?.errors) {
        // Multiple validation errors
        serverResponse.data.errors.forEach((err) => {
          toast.error(err.msg); // or err.message depending on your structure
        });
      } else if (serverResponse?.data?.error) {
        // General server error
        toast.error(serverResponse.data.error);
      } else {
        // Fallback error
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "summary" && value.length > MAX_LENGTH) {
      setError(`Maximum ${MAX_LENGTH} characters allowed.`);
      setFormData({ ...formData, [name]: value.slice(0, MAX_LENGTH) }); // auto-trim
    } else {
      setFormData({ ...formData, [name]: value });
      setError(""); // clear error if within limit
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingNews(null);
    setFormData(initialFormData);
    setImagePreview(null);
    setVideoPreview(null);
    setAudioPreview(null);
    setIncludeVideo(false);
    setIncludeAudio(false);
  };

  // Extracted components for better organization
  const MediaUploadSection = ({
    type,
    includeMedia,
    setIncludeMedia,
    preview,
    triggerInput,
    inputRef,
    handleUpload,
    label,
    acceptedTypes,
  }) => (
    <div className="col-span-1">
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id={`include${type}`}
          checked={includeMedia}
          onChange={(e) => {
            setIncludeMedia(e.target.checked);
            if (!e.target.checked) {
              // Clear preview and form data when unchecked
              const setPreview =
                type === "Video" ? setVideoPreview : setAudioPreview;
              setPreview(null);
              setFormData((prev) => ({
                ...prev,
                [`${type.toLowerCase()}Url`]: "",
              }));
            }
          }}
          className="h-4 w-4 text-blue-600 rounded"
        />
        <label
          htmlFor={`include${type}`}
          className="ml-2 block text-sm font-medium text-gray-700"
        >
          Include {type}
        </label>
      </div>

      {includeMedia && (
        <>
          <input
            type="file"
            name={`${type.toLowerCase()}Url`}
            ref={inputRef}
            onChange={handleUpload}
            accept={`${type.toLowerCase()}/*`}
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerInput}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg px-3 py-8 text-center hover:border-blue-500 transition-colors"
          >
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {type === "Image" && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                )}
                {type === "Video" && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                )}
                {type === "Audio" && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                )}
              </svg>
              <p className="text-sm text-gray-600">Upload {type}</p>
              <p className="text-xs text-gray-500 mt-1">
                {label}: {acceptedTypes}
              </p>
            </div>
          </button>
          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">{type} Preview:</p>
              {type === "Image" && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              {type === "Video" && (
                <video
                  src={preview}
                  controls
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              {type === "Audio" && (
                <audio src={preview} controls className="w-full mt-2" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  const NewsItem = ({ news }) => (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
      {news.imageUrl && (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
            {news.category}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(news)}
              className="text-blue-600 hover:text-blue-800 p-1 rounded"
              title="Edit"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(news._id)}
              className="text-red-600 hover:text-red-800 p-1 rounded"
              title="Delete"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {news.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {news.summary}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>By {news.author || "Admin"}</span>
          <span>{new Date(news.createdAt).toLocaleDateString()}</span>
        </div>

        {(news.videoUrl || news.audioUrl) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {news.videoUrl && <span className="mr-3">Includes video</span>}
              {news.audioUrl && <span>Includes audio</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row">
          {/* Mobile: Categories Horizontal Scroll */}
          <div className="block md:hidden bg-white shadow-sm px-2 py-3 overflow-x-auto whitespace-nowrap">
            <div className="flex gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-700 bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Left: Categories - Fixed */}
          <div className="hidden md:block md:w-1/5 flex-shrink-0">
            <div className="h-[calc(100vh-6rem)] overflow-y-auto py-6 pr-2">
              <div className="bg-white rounded-lg p-4 shadow">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                        selectedCategory === category
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
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
          <div className="w-full md:w-4/5 flex-shrink-0">
            <div className="h-[calc(100vh-6rem)] overflow-y-auto py-6 px-4 md:px-6 scrollbar-hide transition-opacity duration-300">
              {showAddForm ? (
                // Add/Edit Form (expanded in middle section)
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                      {editingNews ? "Edit News" : "Add New News"}
                    </h2>
                    <button
                      onClick={cancelForm}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select a category</option>
                          {FIXED_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Summary <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                          error
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        rows="3"
                        required
                        placeholder="Brief summary that will appear in news listings (max 300 characters)"
                      />
                      <div className="mt-1 text-sm flex justify-between">
                        <span
                          className={error ? "text-red-600" : "text-gray-500"}
                        >
                          {formData.summary.length}/{MAX_LENGTH} characters
                        </span>
                        {error && <span className="text-red-600">{error}</span>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content *
                      </label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="8"
                        required
                        placeholder="Full article content that will appear on the news detail page"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Image Upload (Required) */}
                      <MediaUploadSection
                        type="Image"
                        includeMedia={true}
                        setIncludeMedia={() => {}}
                        preview={imagePreview}
                        triggerInput={triggerImageInput}
                        inputRef={imageInputRef}
                        handleUpload={handleImageUpload}
                        label="Required"
                        acceptedTypes="JPG, PNG"
                      />

                      {/* Video Upload (Optional) */}
                      <MediaUploadSection
                        type="Video"
                        includeMedia={includeVideo}
                        setIncludeMedia={setIncludeVideo}
                        preview={videoPreview}
                        triggerInput={triggerVideoInput}
                        inputRef={videoInputRef}
                        handleUpload={handleVideoUpload}
                        label="Optional"
                        acceptedTypes="MP4, MOV"
                      />

                      {/* Audio Upload (Optional) */}
                      <MediaUploadSection
                        type="Audio"
                        includeMedia={includeAudio}
                        setIncludeMedia={setIncludeAudio}
                        preview={audioPreview}
                        triggerInput={triggerAudioInput}
                        inputRef={audioInputRef}
                        handleUpload={handleAudioUpload}
                        label="Optional"
                        acceptedTypes="MP3, WAV"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Author *
                        </label>
                        <input
                          type="text"
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          placeholder="Author name"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        {editingNews ? "Update News" : "Add News"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelForm}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                      <div className="flex items-baseline">
                        <h2 className="text-xl sm:text-2xl font-bold">
                          {selectedCategory === "All"
                            ? "All News"
                            : `${selectedCategory} News`}
                        </h2>
                        <span className="text-sm font-normal text-gray-500 ml-2 hidden sm:inline">
                          ({filteredNews.length} articles)
                        </span>
                      </div>

                      {/* Mobile article count - shows below on small screens */}
                      <span className="text-sm font-normal text-gray-500 sm:hidden -mt-2">
                        ({filteredNews.length} articles)
                      </span>

                      <button
                        onClick={handleAddNewClick}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center sm:justify-start w-full sm:w-auto"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="hidden sm:inline">Add News</span>
                        <span className="sm:hidden">Add New Article</span>
                      </button>
                    </div>

                    {filteredNews.length === 0 ? (
                      <div className="text-center py-12">
                        <svg
                          className="w-16 h-16 text-gray-400 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          No news found in this category.
                        </p>
                        <button
                          onClick={handleAddNewClick}
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Create Your First News Article
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {filteredNews.map((news) => (
                          <NewsItem key={news._id} news={news} />
                        ))}
                      </div>
                    )}
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
