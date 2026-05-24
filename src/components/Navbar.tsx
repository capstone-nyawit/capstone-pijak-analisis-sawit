/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { TreePalm, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#' },
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'About', href: '/#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/10">
              <TreePalm className="text-brand-500 w-6 h-6" />
            </div>
            <span className={`font-black text-2xl tracking-tighter transition-colors duration-300 ${scrolled ? 'text-brand-950' : 'text-white'}`}>
              Nyawit<span className="text-brand-500">AI</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-1 py-2 text-sm font-bold tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-slate-600 hover:text-brand-600' : 'text-white/80 hover:text-white'
                }`}
                onClick={(e) => {
                  if (window.location.pathname !== '/') {
                    navigate('/');
                  }
                }}
              >
                {link.name}
              </a>
            ))}
            <div className={`flex items-center gap-4 pl-4 border-l transition-colors duration-300 ${scrolled ? 'border-slate-200' : 'border-white/20'}`}>
              <Link to="/auth" className={`px-6 py-2.5 rounded-full text-sm font-black transition-all hover:scale-105 active:scale-95 ${
                scrolled ? 'bg-brand-900 text-white shadow-xl shadow-brand-900/10 hover:bg-brand-800' : 'bg-white/15 text-white border border-white/30 backdrop-blur-sm hover:bg-white/25'
              }`}>
                Log In
              </Link>
              <Link to="/auth" className="bg-brand-600 text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-brand-500 transition-all shadow-lg hover:scale-105 active:scale-95">
                Sign Up
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-950 p-2"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-slate-200 shadow-2xl p-6 flex flex-col space-y-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-brand-950 hover:text-brand-600 block px-4 py-3 rounded-xl bg-slate-50 text-lg font-black transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  if (window.location.pathname !== '/') {
                    navigate('/');
                  }
                }}
              >
                {link.name}
              </a>
            ))}
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-3 pt-2">
               <Link 
                 to="/auth" 
                 onClick={() => setIsOpen(false)}
                 className="w-full py-4 text-brand-950 font-black border-2 border-slate-100 rounded-xl text-center"
               >
                 Login
               </Link>
               <Link 
                 to="/auth" 
                 onClick={() => setIsOpen(false)}
                 className="w-full py-4 bg-brand-900 text-white font-black rounded-xl shadow-xl text-center"
               >
                 Sign Up
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
