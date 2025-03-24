'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Profile {
  name: string;
  title: string;
  _id?: string;
  [key: string]: any;
}

interface HeaderProps {
  profile: Profile | null;
}

export default function Header({ profile }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [localProfile, setLocalProfile] = useState<Profile | null>(profile);
  const pathname = usePathname();

  // If profile is null, try to load from localStorage on client
  useEffect(() => {
    if (!profile && typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('profile_data');
      if (savedProfile) {
        try {
          setLocalProfile(JSON.parse(savedProfile));
        } catch (error) {
          console.error('Error parsing profile data:', error);
        }
      }
    }
  }, [profile]);

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when navigation occurs
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'bg-white py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo/Name */}
          <div>
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              {localProfile?.name || 'Portfolio'}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="/" current={pathname} onClick={closeMenu}>Home</NavLink>
            <NavLink href="/about" current={pathname} onClick={closeMenu}>About</NavLink>
            <NavLink href="/projects" current={pathname} onClick={closeMenu}>Projects</NavLink>
            <NavLink href="/blog" current={pathname} onClick={closeMenu}>Blog</NavLink>
            <NavLink href="/contact" current={pathname} onClick={closeMenu}>Contact</NavLink>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {/* Icon when menu is closed */}
            <svg
              className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            {/* Icon when menu is open */}
            <svg
              className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          <MobileNavLink href="/" current={pathname} onClick={closeMenu}>Home</MobileNavLink>
          <MobileNavLink href="/about" current={pathname} onClick={closeMenu}>About</MobileNavLink>
          <MobileNavLink href="/projects" current={pathname} onClick={closeMenu}>Projects</MobileNavLink>
          <MobileNavLink href="/blog" current={pathname} onClick={closeMenu}>Blog</MobileNavLink>
          <MobileNavLink href="/contact" current={pathname} onClick={closeMenu}>Contact</MobileNavLink>
        </div>
      </div>
    </header>
  );
}

// Desktop navigation link component
function NavLink({ href, current, onClick, children }: { href: string; current: string; onClick: () => void; children: React.ReactNode }) {
  const isActive = current === href || (href !== '/' && current?.startsWith(href));
  
  return (
    <Link
      href={href}
      className={`text-gray-600 hover:text-blue-600 transition-colors py-2 border-b-2 ${
        isActive ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

// Mobile navigation link component
function MobileNavLink({ href, current, onClick, children }: { href: string; current: string; onClick: () => void; children: React.ReactNode }) {
  const isActive = current === href || (href !== '/' && current?.startsWith(href));
  
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
} 