'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import { BlogPost } from '../models/BlogPost';

interface BlogPostFormProps {
  post?: BlogPost;
  onSubmit: (postData: BlogPost) => void;
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
    imageUrl: post?.imageUrl || '',
    tags: post?.tags?.join(', ') || '',
    featured: post?.featured || false,
    published: post?.published || false,
    addToHome: post?.addToHome || false
  });
  
  const [previewImage, setPreviewImage] = useState<string | undefined>(post?.imageUrl);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };
  
  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };
  
  const handleImageSelected = async (file: File, previewUrl: string) => {
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
    
    // Clear previous validation errors
    setValidationErrors({});

    // Validate the form
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }
    
    if (!formData.excerpt.trim()) {
      errors.excerpt = 'Excerpt is required';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Format the date properly
      const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Process tags if they exist
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      // Include the _id if editing
      const submittedData = {
        ...(post?._id ? { _id: post._id } : {}),
        ...formData,
        date: formattedDate,
        tags: tagsArray
      };
      
      // Submit the blog post data
      onSubmit(submittedData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border-t-4 border-blue-600">
      <h2 className="text-xl font-semibold text-gray-900">
        {isEditing ? 'Edit Blog Post' : 'Add New Blog Post'}
      </h2>
      
      <div>
        <label htmlFor="title" className="block text-base font-medium text-gray-900 mb-2">
          Post Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg px-4 py-3 text-gray-900 bg-white ${validationErrors.title ? 'border-red-500' : ''}`}
          placeholder="Enter your post title"
        />
        {validationErrors.title && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="excerpt" className="block text-base font-medium text-gray-900 mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          required
          value={formData.excerpt}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg px-4 py-3 text-gray-900 bg-white ${validationErrors.excerpt ? 'border-red-500' : ''}`}
          placeholder="Brief summary of your post"
        />
        {validationErrors.excerpt && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.excerpt}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content" className="block text-base font-medium text-gray-900 mb-2">
          Content
        </label>
        <RichTextEditor
          value={formData.content}
          onChange={handleContentChange}
          placeholder="Write your blog post content here..."
          minHeight="400px"
        />
        {validationErrors.content && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.content}</p>
        )}
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
          <label htmlFor="slug" className="block text-base font-medium text-gray-900 mb-2">
            URL Slug
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              /blog/
            </span>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className={`flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${validationErrors.slug ? 'border-red-500' : ''}`}
            />
          </div>
          {validationErrors.slug && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.slug}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-base font-medium text-gray-900 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg px-4 py-3 text-gray-900 bg-white"
            placeholder="data, coding, tutorial"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-base font-medium text-gray-900 mb-2">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg px-4 py-3 text-gray-900 bg-white"
            placeholder="e.g. Data Analytics, Tutorial"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-base font-medium text-gray-900 mb-2">
            Publication Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg px-4 py-3 text-gray-900 bg-white"
          />
        </div>
        
        <div>
          <label htmlFor="imageColor" className="block text-base font-medium text-gray-900 mb-2">
            Banner Color (if no image)
          </label>
          <select
            id="imageColor"
            name="imageColor"
            value={formData.imageColor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg px-4 py-3 text-gray-900 bg-white"
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
          <label htmlFor="readTime" className="block text-base font-medium text-gray-900 mb-2">
            Read Time
          </label>
          <input
            type="text"
            id="readTime"
            name="readTime"
            required
            value={formData.readTime}
            onChange={handleChange}
            placeholder="e.g. 5 min"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg px-4 py-3 text-gray-900 bg-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
            Featured Post
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="published"
            name="published"
            type="checkbox"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
            Publish Post
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="addToHome"
            name="addToHome"
            type="checkbox"
            checked={formData.addToHome}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="addToHome" className="ml-2 block text-sm text-gray-700">
            Show on Homepage
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-8">
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
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Post' : 'Publish Post'}
        </button>
      </div>
    </form>
  );
} 