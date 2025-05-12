// src/components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling menu

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white text-2xl font-semibold">
            Dashboard
          </Link>
          {/* Conditionally render different links based on the user role */}
          {user?.role === 'Manager' ? (
            <Link to="/manager" className="text-white hidden md:inline">
              Manager Dashboard
            </Link>
          ) : (
            <Link to="/model" className="text-white hidden md:inline">
              Model Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white md:hidden"
        >
          <i className="fas fa-bars"></i>{' '}
          {/* You can use FontAwesome or any icon */}
        </button>

        {/* Navigation Links */}
        <div
          className={`md:flex space-x-4 ${
            isMenuOpen ? 'block' : 'hidden'
          } md:block`}
        >
          <Link to="/profile" className="text-white">
            Profile
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
