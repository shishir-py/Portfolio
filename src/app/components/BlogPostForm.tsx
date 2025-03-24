'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface BlogPostFormProps {
  post?: {
    _id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    author: string;
    category: string;
    date: string;
    imageColor: string;
    readTime: string;
    imageUrl?: string;
  };
  onSubmit: (postData: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function BlogPostForm({ post, onSubmit, onCancel, isSubmitting = false }: BlogPostFormProps) {
  const isEditing = !!post?._id;
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || 'Tara Pandey',
    category: post?.category || '',
    date: post?.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    imageColor: post?.imageColor || 'bg-blue-700',
    readTime: post?.readTime || '5 min',
    imageUrl: post?.imageUrl || ''
  });
  
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };
  
  const handleImageSelected = async (file: File, previewUrl: string) => {
    setImageFile(file);
    setPreviewImage(previewUrl);
    
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'blog');
      
      // Upload to Cloudinary through our API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update the form data with the Cloudinary URL
      setFormData(prev => ({ 
        ...prev, 
        imageUrl: data.url  // Use the Cloudinary URL
      }));
      
      console.log('Image uploaded successfully:', data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the date properly
    const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Include the _id if editing
    const submittedData = {
      ...(post?._id ? { _id: post._id } : {}),
      ...formData,
      date: formattedDate
    };
    
    // Submit the blog post data
    onSubmit(submittedData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border-t-4 border-blue-600">
      <h2 className="text-xl font-semibold text-gray-900">
        {isEditing ? 'Edit Blog Post' : 'Add New Blog Post'}
      </h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Post Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
      </div>
      
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          required
          value={formData.excerpt}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          required
          value={formData.content}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cover Image
        </label>
        <ImageUpload 
          onImageSelected={handleImageSelected}
          previewUrl={previewImage}
          aspectRatio={1.5}
          className="mt-1"
        />
        <p className="mt-1 text-sm text-gray-500">
          If no image is uploaded, a colored banner will be used.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Publication Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        
        <div>
          <label htmlFor="imageColor" className="block text-sm font-medium text-gray-700">
            Banner Color (if no image)
          </label>
          <select
            id="imageColor"
            name="imageColor"
            value={formData.imageColor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="bg-blue-700">Blue</option>
            <option value="bg-blue-600">Light Blue</option>
            <option value="bg-blue-500">Sky Blue</option>
            <option value="bg-green-600">Green</option>
            <option value="bg-indigo-600">Indigo</option>
            <option value="bg-purple-600">Purple</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">
            Read Time
          </label>
          <input
            type="text"
            id="readTime"
            name="readTime"
            required
            value={formData.readTime}
            onChange={handleChange}
            placeholder="5 min"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          URL Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          required
          value={formData.slug}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
        <p className="mt-1 text-sm text-gray-500">
          This will be used in the URL: /blog/{formData.slug}
        </p>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update Post' : 'Publish Post')}
        </button>
      </div>
    </form>
  );
} 