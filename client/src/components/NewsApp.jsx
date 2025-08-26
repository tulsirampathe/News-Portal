import { useEffect, useRef, useState } from "react";
import Categories from "./Categories";
import ContactForm from "./ContactForm";
import LoginModal from "./LoginModal";
import Navbar from "./Navbar";
import axiosInstance from "../../api/axiosInstance";
// import { dummyNews } from "../data/dummyNews";

const NewsApp = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const newsGridRef = useRef(null);
  const newsDetailRef = useRef(null);

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axiosInstance.get("/news");
        setNewsList(res.data.data); // assuming { success: true, data: [...] }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news.");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const openLoginModal = () => setLoginOpen(true);
  const closeLoginModal = () => setLoginOpen(false);

  const handleLogin = () => {
    alert("Logged in! (You can replace this with actual login logic)");
    setLoginOpen(false);
  };

  const smoothScrollTo = (element, position, duration = 300) => {
    if (!element) return;

    const start = element.scrollTop;
    const change = position - start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      element.scrollTop = start + change * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleNewsSelect = (news) => {
    setIsTransitioning(true);

    if (newsGridRef.current) {
      setScrollPosition(newsGridRef.current.scrollTop);
    }

    setSelectedNews(news);

    setTimeout(() => {
      if (newsDetailRef.current) {
        smoothScrollTo(newsDetailRef.current, 0, 400);
      }
      setIsTransitioning(false);
    }, 10);
  };

  const handleBackToList = () => {
    setIsTransitioning(true);
    setSelectedNews(null);

    setTimeout(() => {
      if (newsGridRef.current) {
        smoothScrollTo(newsGridRef.current, scrollPosition, 400);
      }
      setIsTransitioning(false);
    }, 10);
  };

  // Component to render media in news items
  const NewsMedia = ({ news, isDetail = false, position = "afterContent" }) => {
    if (!news) return null;

    return (
      <div className={position === "afterContent" ? "mt-8" : "mt-3"}>
        {/* Image (always present) - shown at top for detail view */}
        {news.imageUrl && position === "top" && (
          <div className={`${isDetail ? "mb-6" : "mb-3"}`}>
            <img
              src={news.imageUrl}
              alt={news.title}
              className={`w-full ${
                isDetail ? "rounded-lg" : "rounded"
              } object-cover ${isDetail ? "max-h-96" : "h-48"}`}
            />
            {isDetail && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Photo: {news.author || "Unknown"}
              </p>
            )}
          </div>
        )}

        {/* Video - shown after content in detail view */}
        {news.videoUrl && position === "afterContent" && (
          <div
            className={`bg-gray-50 p-6 rounded-lg ${
              isDetail ? "my-8" : "mb-3"
            }`}
          >
            <div className="flex items-center text-lg font-semibold text-gray-800 mb-4">
              <svg
                className="w-6 h-6 mr-2 text-blue-600"
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
              Related Video
            </div>
            <video
              src={news.videoUrl}
              controls
              className="w-full rounded-lg object-cover h-96"
              // poster={news.imageUrl}
            />
            <p className="text-sm text-gray-500 mt-2">
              Video content related to this story
            </p>
          </div>
        )}

        {/* Audio - shown after content in detail view */}
        {news.audioUrl && position === "afterContent" && (
          <div
            className={`bg-gray-50 p-6 rounded-lg ${
              isDetail ? "my-8" : "mb-3"
            }`}
          >
            <div className="flex items-center text-lg font-semibold text-gray-800 mb-4">
              <svg
                className="w-6 h-6 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                ></path>
              </svg>
              Audio Report
            </div>
            <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
              <audio src={news.audioUrl} controls className="w-full" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Audio content related to this story
            </p>
          </div>
        )}
      </div>
    );
  };

  // Updated NewsDetail component to include media in a more professional layout
  const NewsDetail = ({ news, onBack }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to News
        </button>

        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {news.category}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {news.title}
        </h1>

        <div className="flex items-center text-gray-500 text-sm mb-6 border-b pb-4">
          <span className="font-medium">
            By {news.author || "Unknown Author"}
          </span>
          <span className="mx-2">•</span>
          <span>
            {new Date(news.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="mx-2">•</span>
          <span>5 min read</span>
        </div>

        {/* Main image at the top */}
        <NewsMedia news={news} isDetail={true} position="top" />

        <div className="prose max-w-none mt-6">
          {/* Summary as lead paragraph */}
          <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium border-l-4 border-blue-500 pl-4">
            {news.summary}
          </p>

          {/* Main content */}
          <div className="text-gray-800 leading-relaxed space-y-4">
            {news.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-lg leading-8">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Media displayed after content like professional news sites */}
        <NewsMedia news={news} isDetail={true} position="afterContent" />

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {news.category}
            </span>
            {news.videoUrl && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
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
                Video
              </span>
            )}
            {news.audioUrl && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
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
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  ></path>
                </svg>
                Audio
              </span>
            )}
          </div>
        </div>

        {/* Social sharing buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Share this article:
          </h3>
          <div className="flex space-x-3">
            <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
            <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Updated NewsGrid component to show media indicators
  const NewsGrid = ({ newsList = [], onNewsSelect }) => {

    if (newsList.length == 0) {
      return (
        <div className="max-w-sm mx-auto bg-white shadow-md rounded-2xl p-6 text-center">
          {/* Animated Icon */}
          <div className="text-6xl mb-4 animate-bounce">📰</div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No News Found
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500">
            There’s currently no news available for this category. Try selecting
            a different one or check back later.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-2">
        {newsList.map((news) => (
          <div
            key={news._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNewsSelect(news)}
          >
            {/* Image thumbnail */}
            {news.imageUrl && (
              <div className="relative">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />

                {/* Media type indicators */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  {news.videoUrl && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
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
                      Video
                    </span>
                  )}
                  {news.audioUrl && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        ></path>
                      </svg>
                      Audio
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                  {news.category}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(news.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {news.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {news.summary}
              </p>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>By {news.author || "Admin"}</span>

                {/* Media type indicators at bottom */}
                <div className="flex items-center space-x-2">
                  {news.videoUrl && (
                    <span className="flex items-center text-blue-600">
                      <svg
                        className="w-3 h-3 mr-1"
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
                    </span>
                  )}
                  {news.audioUrl && (
                    <span className="flex items-center text-green-600">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        ></path>
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar onLoginClick={openLoginModal} />

      {/* Mobile: Categories Horizontal Scroll */}
      <div className="block md:hidden bg-white shadow-sm px-2 py-3 overflow-x-auto whitespace-nowrap flex gap-4">
        <Categories
          horizontal
          onCategorySelect={(label) => setSelectedCategory(label)}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row">
          {/* Left: Categories */}
          <div className="md:w-1/5 flex-shrink-0">
            <div className="hidden md:block h-[calc(100vh-6rem)] overflow-y-auto py-6 pr-2 scrollbar-hide">
              <Categories
                onCategorySelect={(label) => setSelectedCategory(label)}
              />
            </div>
          </div>

          {/* Middle: News Feed or News Detail */}
          <div className="w-full md:w-3/5 flex-shrink-0">
            <div
              ref={selectedNews ? newsDetailRef : newsGridRef}
              className="h-[calc(100vh-6rem)] overflow-y-auto py-6 scrollbar-hide transition-opacity duration-300"
              style={{ opacity: isTransitioning ? 0.7 : 1 }}
            >
              {selectedNews ? (
                <NewsDetail news={selectedNews} onBack={handleBackToList} />
              ) : loading ? (
                <div className="text-center text-gray-500 mt-12">
                  Loading news...
                </div>
              ) : error ? (
                <div className="text-center text-red-500 mt-12">{error}</div>
              ) : (
                <NewsGrid
                  newsList={
                    selectedCategory && selectedCategory !== "All"
                      ? newsList.filter((n) => n.category === selectedCategory)
                      : newsList
                  }
                  onNewsSelect={handleNewsSelect}
                />
              )}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="md:w-1/5 flex-shrink-0">
            <div className="hidden md:block h-[calc(100vh-6rem)] overflow-y-auto py-6 pl-2 scrollbar-hide">
              <ContactForm />
            </div>

            {/* Mobile Contact Form */}
            <div className="block md:hidden px-4 py-4 bg-white shadow-inner">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={loginOpen}
        onClose={closeLoginModal}
        onLoginClick={handleLogin}
      />
    </div>
  );
};

export default NewsApp;
