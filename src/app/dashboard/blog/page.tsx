'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogPostForm from '../../components/BlogPostForm';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Empty initial state - we'll load from the API
const initialPosts = [];

export default function BlogManagement() {
  const [posts, setPosts] = useState(initialPosts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Check authentication and load posts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('dashboard_auth');
      if (authStatus !== 'true') {
        router.push('/dashboard');
      } else {
        setIsAuthenticated(true);
        fetchPosts();
      }
    }
  }, [router]);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/blog');
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
  
  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/blog/${postToDelete.slug}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete blog post');
      }
      
      // Refresh the posts list
      await fetchPosts();
      
      setIsDeleting(false);
      setPostToDelete(null);
      
      // Show success message
      setSuccessMessage('Blog post deleted successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting blog post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFormSubmit = async (postData) => {
    try {
      setIsSubmitting(true);
      let response;
      
      if (postData._id) {
        // Update existing post
        response = await fetch(`/api/blog/${postData.slug}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      } else {
        // Add new post
        response = await fetch('/api/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      }
      
      if (!response.ok) {
        throw new Error(`Failed to ${postData._id ? 'update' : 'create'} blog post`);
      }
      
      // Refresh the posts list
      await fetchPosts();
      
      setIsFormOpen(false);
      
      // Show success message
      setSuccessMessage(`Blog post ${postData._id ? 'updated' : 'created'} successfully`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting blog post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setIsFormOpen(false);
    setCurrentPost(null);
  };
  
  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we load your blog posts.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600">Manage your blog posts</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/dashboard">
              <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Back to Dashboard
              </button>
            </Link>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Post
            </button>
          </div>
        </div>
        
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
            {successMessage}
          </div>
        )}
        
        {isFormOpen ? (
          <BlogPostForm
            post={currentPost}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {posts.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No blog posts found. Click "Add New Post" to create one.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <li key={post._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        {post.imageUrl ? (
                          <div className="flex-shrink-0 h-16 w-24 relative overflow-hidden rounded bg-gray-100">
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className={`flex-shrink-0 h-16 w-24 rounded ${post.imageColor}`}></div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                          <div className="mt-1 flex space-x-3 text-sm text-gray-500">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <button className="text-gray-600 hover:text-gray-800">
                            View
                          </button>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      
      {/* Delete confirmation modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Blog Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{postToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 