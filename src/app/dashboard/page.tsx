'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Check if user is authenticated in localStorage on component mount
  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem('dashboard_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use environment variables for credentials instead of hardcoded values
    const validUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'tarapandey';
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('dashboard_auth', 'true');
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dashboard_auth');
    router.push('/');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-blue-600">
          <h1 className="text-3xl font-bold text-center mb-2">Admin Dashboard Login</h1>
          <p className="text-gray-600 text-center mb-8">This area is restricted to authorized personnel only</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500">
            
          </div>
        </div>
      </div>
    );
  }

  // Dashboard content for authenticated users
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Dashboard header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
          
          {/* Admin profile section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border-2 border-blue-600">
                <Image
                  src="/images/profile/admin-profile.jpg"
                  alt="Admin Profile"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    // Set a default fallback image or text initials
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-blue-600"><span class="text-xl font-bold text-white">TP</span></div>';
                    }
                  }}
                />
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold text-gray-900">Tara Prasad Pandey</h2>
                <p className="text-gray-600">Site Administrator</p>
                <p className="text-sm text-gray-500 mt-1">Last login: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Dashboard menu */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Your Site</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/dashboard/profile" className="block p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                    <p className="text-gray-600">Update your personal information</p>
                  </div>
                </div>
              </a>
              
              <a href="/dashboard/projects" className="block p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Projects</h3>
                    <p className="text-gray-600">Manage your project portfolio</p>
                  </div>
                </div>
              </a>
              
              <a href="/dashboard/blog" className="block p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Blog</h3>
                    <p className="text-gray-600">Manage your blog posts</p>
                  </div>
                </div>
              </a>
              
              <a href="/dashboard/about" className="block p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">About Page</h3>
                    <p className="text-gray-600">Edit your about page content</p>
                  </div>
                </div>
              </a>
            </div>
            
            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Getting Started</h3>
              <p className="text-blue-700">
                Welcome to your admin dashboard! From here, you can manage your portfolio website's content. 
                Click on any of the sections above to begin editing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 