import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ variant = "public" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isLoggedIn = variant === "auth";
  const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  const userId = user?.id;
  return (
    <>
      {/* ================= PUBLIC NAVBAR ================= */}
      {!isLoggedIn && (
        <nav className="fixed w-full z-50 top-0 border-b border-olive-light bg-egg/90 backdrop-blur-md">
          <div className="max-w-screen-xl flex items-center justify-between mx-auto px-6 py-4">

            <a href="/" className="flex items-center gap-2 group">
              <span className="font-display font-black text-2xl text-midnight">
                TalaCare
              </span>
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse"></span>
            </a>

            <div className="hidden md:flex items-center gap-10">
              <div className="flex gap-8 font-bold text-sm text-mauve">
                <a href="#features" className="hover:text-olive">Features</a>
                <a href="#who" className="hover:text-olive">Who it's for</a>
              </div>

              <button className="bg-midnight text-egg px-6 py-2.5 rounded-full font-bold text-sm">
                Get Started
              </button>
            </div>

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? '✕' : '☰'}
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden bg-egg border-b px-6 py-6 space-y-4">
              <a href="#features" onClick={() => setIsOpen(false)}>Features</a>
              <a href="#who" onClick={() => setIsOpen(false)}>Who it's for</a>
            </div>
          )}
        </nav>
      )}

      {/* ================= AUTH NAVBAR ================= */}
      {isLoggedIn && (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
          <nav className="bg-white w-full max-w-5xl bg-egg/95 backdrop-blur-md border border-olive-light shadow-lg rounded-full px-6 py-3 flex items-center justify-between">

            {/* Left */}
            <Link to="/dashboard" className="font-display font-black text-midnight text-lg">
              TalaCare
            </Link>

            {/* Center */}
            <div className="hidden md:flex gap-8 text-sm font-bold text-mauve">
              <Link to="/dashboard" className="hover:text-olive">Dashboard</Link>
              <Link to="/medications" className="hover:text-olive">Medication</Link>
              <Link to="/family-calendar" className="hover:text-olive">Calendar</Link>
            </div>

            {/* Right */}
            <Link
              to={userId ? `/profile/${userId}` : "/profile"}
              className="bg-midnight text-egg px-5 py-2 rounded-full text-sm font-bold"
            >
              Profile
            </Link>

          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;