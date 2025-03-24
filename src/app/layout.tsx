'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { init as initEmailJS } from 'emailjs-com';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [profileData, setProfileData] = useState({
    name: 'Tara Prasad Pandey',
    title: 'Data Analyst',
    email: 'sheahead22@gmail.com'
  });

  // Initialize EmailJS
  useEffect(() => {
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
    if (userId) {
      initEmailJS(userId);
      console.log('EmailJS initialized');
    } else {
      console.warn('EmailJS User ID not found. Email functionality will not work.');
    }
  }, []);

  // Load profile data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('profile_data');
      if (savedProfile) {
        const data = JSON.parse(savedProfile);
        setProfileData(data);
      }
    }
  }, []);

  const siteTitle = `${profileData.name} | ${profileData.title}`;

  return (
    <html lang="en">
      <head>
        <title>{siteTitle}</title>
        <meta name="description" content="Professional portfolio and blog showcasing data analysis and visualization work" />
      </head>
      <body className={inter.className}>
        <header className="py-6 bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  {profileData.name}
                </Link>
              </div>
              <nav className="flex space-x-8">
                <Link href="/" className="text-gray-600 hover:text-blue-600 hover:underline">Home</Link>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 hover:underline">About</Link>
                <Link href="/projects" className="text-gray-600 hover:text-blue-600 hover:underline">Projects</Link>
                <Link href="/blog" className="text-gray-600 hover:text-blue-600 hover:underline">Blog</Link>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 hover:underline">Contact</Link>
              </nav>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:justify-between">
              <div className="mb-8 md:mb-0">
                <Link href="/" className="text-xl font-semibold text-gray-900">
                  {profileData.name}
                </Link>
                <p className="mt-2 text-gray-600">{profileData.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wider">Navigation</h3>
                  <ul className="mt-4 space-y-2">
                    <li><Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link></li>
                    <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
                    <li><Link href="/projects" className="text-gray-600 hover:text-blue-600">Projects</Link></li>
                    <li><Link href="/blog" className="text-gray-600 hover:text-blue-600">Blog</Link></li>
                    <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wider">Contact</h3>
                  <ul className="mt-4 space-y-2">
                    <li><a href={`mailto:${profileData.email}`} className="text-gray-600 hover:text-blue-600">Email</a></li>
                    <li><a href="https://www.linkedin.com/in/Brainwave1999" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">LinkedIn</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
              <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {profileData.name}. All rights reserved.</p>
              <div className="mt-4 md:mt-0">
                <p className="text-sm text-gray-500">Built with Next.js and Tailwind CSS</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
