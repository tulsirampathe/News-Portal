// src/App.jsx
import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewsGrid from "./components/NewsGrid";
import NewsDetail from "./components/NewsDetail";
import ContactForm from "./components/ContactForm";
import Categories from "./components/Categories";
import LoginModal from "./components/LoginModal";

import { dummyNews } from "./data/dummyNews";
import { AuthProvider } from "./context/AuthContext";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

const NewsApp = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const newsGridRef = useRef(null);
  const newsDetailRef = useRef(null);

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar onLoginClick={openLoginModal} />

      {/* Mobile: Categories Horizontal Scroll */}
      <div className="block md:hidden bg-white shadow-sm px-2 py-3 overflow-x-auto whitespace-nowrap flex gap-4">
        <Categories horizontal />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row">
          {/* Left: Categories */}
          <div className="md:w-1/5 flex-shrink-0">
            <div className="hidden md:block h-[calc(100vh-6rem)] overflow-y-auto py-6 pr-2 scrollbar-hide">
              <Categories />
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
              ) : (
                <NewsGrid
                  newsList={dummyNews}
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

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<NewsApp />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
