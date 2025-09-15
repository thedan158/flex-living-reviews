'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 w-full bg-[#4A5D5A] z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
            <div className="text-white font-bold text-xl">Flex Living</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
              Dashboard
            </Link>
            <Link href="/property" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
              Properties
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
              Support
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Language & Currency */}
            <div className="hidden sm:flex items-center space-x-4 text-white/80">
              <span className="text-sm">EN</span>
              <span className="text-sm">|</span>
              <span className="text-sm">GBP (£)</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#4A5D5A] border-t border-white/10">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/dashboard"
                className="block text-white/80 hover:text-white transition-colors duration-200 font-medium"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/property"
                className="block text-white/80 hover:text-white transition-colors duration-200 font-medium"
                onClick={closeMobileMenu}
              >
                Properties
              </Link>
              <Link
                href="/about"
                className="block text-white/80 hover:text-white transition-colors duration-200 font-medium"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block text-white/80 hover:text-white transition-colors duration-200 font-medium"
                onClick={closeMobileMenu}
              >
                Support
              </Link>
              <div className="flex items-center space-x-4 text-white/80 pt-4 border-t border-white/10">
                <span className="text-sm">EN</span>
                <span className="text-sm">|</span>
                <span className="text-sm">GBP (£)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
