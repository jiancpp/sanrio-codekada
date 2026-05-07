import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import { HiOutlineLogout } from "react-icons/hi";

import NotificationBell from '../ui/NotificationBell';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = ({ variant = "public" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isLoggedIn = variant === "auth";
  const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  const userId = user?.id;

  const handleLogOut = () => {
    logout();
    navigate('/')
  }
  return (
    <>
      {/* ================= PUBLIC NAVBAR ================= */}
      {!isLoggedIn && (
        <nav className="fixed w-full z-50 top-0 border-b border-olive-light bg-egg/90 backdrop-blur-md">
          <div className="max-w-screen-xl flex items-center justify-between mx-auto px-6 py-4">

            <a href="/" className="flex items-center gap-2 group">
              <img
                src={logo}
                alt="TalaCare Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-110"
              />
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

              <button
                onClick={() => navigate('/register')}
                className="bg-midnight text-egg px-6 py-2.5 rounded-full font-bold text-sm hover:-translate-y-0.5 hover:cursor-pointer active:scale-95 transition-all">
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
            <Link to="/dashboard" className="flex items-center gap-2 font-display font-black text-midnight text-lg group">
              <img
                src={logo}
                alt="TalaCare Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-110"
              />
              <span>
                TalaCare
              </span>
            </Link>

            {/* Center */}
            <div className="hidden md:flex gap-8 text-sm font-bold text-mauve">
              <Link to="/dashboard" className="hover:text-olive">Dashboard</Link>
              <Link to="/medications" className="hover:text-olive">Medication</Link>
              <Link to="/family-calendar" className="hover:text-olive">Calendar</Link>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="bg-midnight text-egg px-5 py-2 rounded-full text-sm font-bold"
              >
                Profile
              </Link>
              <NotificationBell />
              <button
                onClick={(e) => handleLogOut()}
                className="relative bg-egg border border-olive-light rounded-full p-2 shadow-sm hover:shadow-md transition"
              >
                <HiOutlineLogout className="w-5 h-5" />
              </button>
            </div>

          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;