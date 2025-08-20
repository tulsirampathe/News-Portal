// src/components/NewsDetail.jsx
import React from "react";

const NewsDetail = ({ news, onBack }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mx-6">
      {/* Back Button - Fixed to use consistent styling */}
      <button 
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
            clipRule="evenodd" 
          />
        </svg>
        Back to News
      </button>

      {/* Article Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          {news.category} • {new Date(news.date).toLocaleDateString()}
        </p>
        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
        <p className="text-gray-600 italic">{news.summary}</p>
      </div>

      {/* Featured Image */}
      <img
        src={news.imageUrl}
        alt={news.title}
        className="w-full h-96 object-cover rounded-xl mb-6"
      />

      {/* Article Content */}
      <div className="prose max-w-none mb-8">
        {news.fullContent ? (
          <p className="text-gray-700 leading-7 whitespace-pre-line">
            {news.fullContent}
          </p>
        ) : (
          <p className="text-gray-700 leading-7">
            {news.content} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        )}
      </div>

      {/* Article Footer */}
      <div className="border-t pt-4">
        <p className="text-sm text-gray-500">
          By {news.author || "News Staff"} • Published on {new Date(news.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
};

export default NewsDetail;