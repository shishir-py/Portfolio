'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogPostForm from '../../components/BlogPostForm';
import { useRouter } from 'next/navigation';

// Mock data - in a real app, this would come from a database
const initialPosts = [
  {
    id: 1,
    title: 'Data Visualization Best Practices',
    slug: 'data-visualization-best-practices',
    excerpt: 'Learn how to create effective data visualizations that communicate insights clearly and efficiently.',
    content: 'This is where the full content of the blog post would appear...',
    author: 'Tara Pandey',
    category: 'Data Visualization',
    date: 'May 15, 2024',
    imageColor: 'bg-blue-700',
    readTime: '5 min'
  },
  {
    id: 2,
    title: 'Predictive Analytics in Retail',
    slug: 'predictive-analytics-retail',
    excerpt: 'Discover how machine learning models can predict customer behavior and optimize retail operations.',
    content: 'This is where the full content of the blog post would appear...',
    author: 'Tara Pandey',
    category: 'Machine Learning',
    date: 'April 22, 2024',
    imageColor: 'bg-blue-600',
    readTime: '7 min'
  },
  {
    id: 3,
    title: 'The Future of Data Science',
    slug: 'future-of-data-science',
    excerpt: 'Exploring emerging trends in data science and how they will shape business intelligence in the coming years.',
    content: 'This is where the full content of the blog post would appear...',
    author: 'Tara Pandey',
    category: 'Trends',
    date: 'March 10, 2024',
    imageColor: 'bg-blue-500',
    readTime: '6 min'
  }
];

export default function BlogManagement() {
  const [posts, setPosts] = useState(initialPosts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [postImages, setPostImages] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosts = localStorage.getItem('blog_posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      } else {
        // Initialize with default posts if nothing in localStorage
        localStorage.setItem('blog_posts', JSON.stringify(initialPosts));
      }
      
      // Load blog images
      const savedImages = localStorage.getItem('blog_images');
      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages);
          setPostImages(parsedImages);
        } catch (error) {
          console.error('Error parsing blog images from localStorage:', error);
        }
      }
      
      const authStatus = localStorage.getItem('dashboard_auth');
      if (authStatus !== 'true') {
        router.push('/dashboard');
      } else {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Save updated posts to localStorage when posts change
    if (typeof window !== 'undefined' && posts) {
      localStorage.setItem('blog_posts', JSON.stringify(posts));
    }
  }, [posts]);

  const handleAddNew = () => {
    setCurrentPost(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (post) => {
    setCurrentPost(post);
    setIsFormOpen(true);
  };
  
  const handleDelete = (post) => {
    setPostToDelete(post);
    setIsDeleting(true);
  };
  
  const confirmDelete = () => {
    const updatedPosts = posts.filter(p => p.id !== postToDelete.id);
    setPosts(updatedPosts);
    setIsDeleting(false);
    setPostToDelete(null);
    
    // Save updated posts to localStorage
    localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
    
    // Show success message
    setSuccessMessage('Blog post deleted successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleFormSubmit = (postData) => {
    let updatedPosts;
    
    if (postData.id) {
      // Update existing post
      updatedPosts = posts.map(p => p.id === postData.id ? postData : p);
      setPosts(updatedPosts);
    } else {
      // Add new post
      const newPost = {
        ...postData,
        id: Math.max(0, ...posts.map(p => p.id)) + 1
      };
      updatedPosts = [...posts, newPost];
      setPosts(updatedPosts);
    }
    
    // Save updated posts to localStorage
    localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
    
    setIsFormOpen(false);
    
    // Show success message
    setSuccessMessage(postData.id ? 'Blog post updated successfully' : 'Blog post added successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleFormCancel = () => {
    setIsFormOpen(false);
  };
  
  if (isFormOpen) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogPostForm 
            post={currentPost} 
            onSubmit={handleFormSubmit} 
            onCancel={handleFormCancel} 
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Post
          </button>
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-16 h-16 ${post.imageColor} rounded overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-medium text-gray-900">{post.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {post.excerpt.length > 100 
                          ? `${post.excerpt.substring(0, 100)}...` 
                          : post.excerpt}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded mr-2">
                          {post.category}
                        </span>
                        <span>{post.date} • {post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-gray-400 hover:text-gray-500"
                      target="_blank"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(post)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Blog Post
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleting(false);
                    setPostToDelete(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 