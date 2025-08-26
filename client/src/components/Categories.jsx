import React from "react";

const categories = [
  { label: "All", icon: "📰" },
  { label: "Politics", icon: "🏛️" },
  { label: "Business", icon: "💼" },
  { label: "Technology", icon: "💻" },
  { label: "Health", icon: "🩺" },
  { label: "Entertainment", icon: "🎭" },
  { label: "Sports", icon: "🏅" },
  { label: "Science", icon: "🔬" },
  { label: "World", icon: "🌍" },
];

const Categories = ({ horizontal = false, onCategorySelect }) => {
  if (horizontal) {
    return (
      <div className="flex gap-2 overflow-x-auto px-1 no-scrollbar">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => onCategorySelect?.(cat.label)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full text-sm whitespace-nowrap bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <span className="text-base">{cat.icon}</span>
            <span className="font-medium">{cat.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Default vertical desktop view
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Categories</h3>
      <ul className="space-y-2">
        {categories.map((cat, index) => (
          <li
            key={index}
            onClick={() => onCategorySelect?.(cat.label)}
            className="flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-transform duration-200 active:scale-95"
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="text-sm font-medium">{cat.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
