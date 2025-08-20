import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const goToAdmin = () => navigate("/admin/login");

  return (
    <nav className="bg-red-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold cursor-pointer select-none">
          News Portal
        </h1>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu Items (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <button className="hover:underline font-medium">Home</button>
          <button
            onClick={goToAdmin}
            className="hover:underline font-medium"
          >
            Admin
          </button>
          <button
            onClick={onLoginClick}
            className="bg-white text-red-600 px-4 py-1 rounded-md font-semibold hover:bg-red-100 transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <button className="block w-full text-left font-medium hover:underline">
            Home
          </button>
          <button
            onClick={goToAdmin}
            className="block w-full text-left font-medium hover:underline"
          >
            Admin
          </button>
          <button
            onClick={onLoginClick}
            className="block w-full text-left bg-white text-red-600 px-4 py-1 rounded-md font-semibold hover:bg-red-100 transition"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
