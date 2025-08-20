// src/components/NewsGrid.jsx
import React from "react";
import NewsCard from "./NewsCard";

const NewsGrid = ({ newsList, onNewsSelect }) => {
  return (
    <div className="space-y-6 px-6">
      {newsList.map((news) => (
        <NewsCard 
          key={news.id} 
          news={news} 
          onClick={() => onNewsSelect(news)}
        />
      ))}
    </div>
  );
};

export default NewsGrid;