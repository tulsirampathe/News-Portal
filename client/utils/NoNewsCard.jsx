import React from "react";

const NoNewsCard = () => {
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
        There’s currently no news available for this category. Try selecting a
        different one or check back later.
      </p>
    </div>
  );
};

export default NoNewsCard;
