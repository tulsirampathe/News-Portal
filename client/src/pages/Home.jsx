// src/pages/Home.jsx
import React from "react";
import { dummyNews } from "../data/dummyNews";
import NewsGrid from "../components/NewsGrid";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold my-6 px-6">Top Headlines</h2>
      <NewsGrid newsList={dummyNews} />
    </div>
  );
};

export default Home;
