import React, { useState } from 'react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 border-b border-olive-light bg-egg/90 backdrop-blur-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-6 py-4">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="font-display font-black text-2xl text-midnight transition-transform group-hover:scale-105">
            TalaCare
          </span>
          <span className="w-2 h-2 rounded-full bg-coral animate-pulse"></span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8 font-bold text-sm text-mauve">
            <a href="#features" className="hover:text-olive transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-olive transition-all group-hover:w-full"></span>
            </a>
            <a href="#who" className="hover:text-olive transition-colors relative group">
              Who it's for
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-olive transition-all group-hover:w-full"></span>
            </a>
          </div>
          
          <button className="bg-midnight text-egg px-6 py-2.5 rounded-full font-bold text-sm hover:bg-mauve hover:shadow-lg active:scale-95 transition-all">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden text-midnight p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-egg border-b border-olive-light px-6 py-6 space-y-4 shadow-xl">
          <a href="#features" onClick={() => setIsOpen(false)} className="block font-bold text-mauve">Features</a>
          <a href="#who" onClick={() => setIsOpen(false)} className="block font-bold text-mauve">Who it's for</a>
          <button className="w-full bg-midnight text-egg px-6 py-3 rounded-full font-bold text-sm">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;