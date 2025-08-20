import React from "react";

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className="bg-red-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side: Logo */}
        <h1 className="text-2xl font-bold cursor-pointer select-none">
          News Portal
        </h1>

        {/* Right side: Home and Login buttons */}
        <div className="flex items-center gap-6">
          <button
            className="text-white hover:underline font-medium cursor-pointer"
            aria-label="Go to Home"
          >
            Home
          </button>
          <button
            onClick={onLoginClick}
            className="bg-white text-red-600 px-4 py-1 rounded-md font-semibold hover:bg-red-100 transition"
            aria-label="Login"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
