// src/components/NewsCard.jsx
import React from "react";

const NewsCard = ({ news, onClick }) => {
  return (
    <div 
      className="flex flex-col md:flex-row bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <img
        src={news.imageUrl}
        alt={news.title}
        className="w-full md:w-1/3 h-64 object-cover"
      />

      {/* Content */}
      <div className="p-4 flex flex-col justify-between md:w-2/3">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {news.category} • {new Date(news.date).toLocaleDateString()}
          </p>
          <h2 className="text-xl font-bold mb-2">{news.title}</h2>
          <p className="text-gray-700 text-sm line-clamp-3">{news.content}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;