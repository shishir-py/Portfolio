'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Blog } from '../models/Blog';
import ImageUpload from './ImageUpload';

// Dynamically import the editor to avoid SSR issues
const Editor = dynamic(() => import('./RichTextEditor'), { ssr: false });

interface BlogFormProps {
  blog?: {
    _id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    imageUrl?: string;
    tags?: string[];
    featured?: boolean;
    published?: boolean;
    addToHome?: boolean;
  };
  onSubmit: (data: any, isEditing: boolean) => Promise<void>;
  onCancel: () => void;
}

export default function BlogForm({ blog, onSubmit, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    content: blog?.content || '',
    excerpt: blog?.excerpt || '',
    imageUrl: blog?.imageUrl || '',
    tags: blog?.tags?.join(', ') || '',
    featured: blog?.featured || false,
    published: blog?.published || false,
    addToHome: blog?.addToHome || false
  });

  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  
  // Load initial image preview if editing
  useEffect(() => {
    if (blog && blog.imageUrl) {
      setPreviewImage(blog.imageUrl);
    }
  }, [blog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const blogData = {
      ...(blog?._id ? { _id: blog._id } : {}),
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt,
      imageUrl: formData.imageUrl || '',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      featured: formData.featured,
      published: formData.published,
      addToHome: formData.addToHome
    };
    
    await onSubmit(blogData, !!blog);
  };

  const handleImageSelected = async (file: File, previewUrl: string) => {
    try {
      setIsUploading(true);
      setImageError('');
      
      // Set preview image
      setPreviewImage(previewUrl);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'blog');
      
      // Upload image
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update form data with the new image URL
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageError('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <label htmlFor="title" className="block text-base font-medium text-gray-900 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-4 py-3 placeholder-gray-500"
          required
          placeholder="Enter blog post title"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-base font-medium text-gray-900 mb-2">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-4 py-3 placeholder-gray-500"
          required
          placeholder="your-blog-post-url"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-base font-medium text-gray-900 mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-4 py-3 placeholder-gray-500"
          required
          placeholder="Brief summary of your blog post (will appear in previews)"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-base font-medium text-gray-900 mb-2">
          Content
        </label>
        <div className="mt-1">
          <Editor
            value={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          />
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-base font-medium text-gray-900 mb-2">
          Featured Image
        </label>
        <ImageUpload 
          onImageSelected={handleImageSelected}
          previewUrl={previewImage}
          aspectRatio={1.91}
          className="mt-1"
        />
        {isUploading && (
          <p className="mt-2 text-sm text-blue-600">Uploading image...</p>
        )}
        {imageError && (
          <p className="mt-2 text-sm text-red-600">{imageError}</p>
        )}
        {formData.imageUrl && !isUploading && !imageError && (
          <p className="mt-2 text-sm text-green-600">Image ready to save with blog post</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-base font-medium text-gray-900 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-4 py-3 placeholder-gray-500"
          placeholder="data-analysis, python, machine-learning"
        />
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-5 w-5"
          />
          <span className="ml-2 text-base text-gray-900">Featured on homepage</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-5 w-5"
          />
          <span className="ml-2 text-base text-gray-900">Published</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.addToHome}
            onChange={(e) => setFormData(prev => ({ ...prev, addToHome: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-5 w-5"
          />
          <span className="ml-2 text-base text-gray-900">Add to homepage</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {blog ? 'Update Blog' : 'Create Blog'}
        </button>
      </div>
    </form>
  );
} 