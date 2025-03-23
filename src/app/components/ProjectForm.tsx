'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

interface ProjectFormProps {
  project?: {
    id?: number;
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    slug: string;
  };
  onSubmit: (projectData: any) => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const isEditing = !!project?.id;
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    imageUrl: project?.imageUrl || '',
    tags: project?.tags?.join(', ') || '',
    slug: project?.slug || ''
  });
  
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Load initial image preview from localStorage if editing
  useEffect(() => {
    if (isEditing && project?.imageUrl && typeof window !== 'undefined') {
      const savedImages = localStorage.getItem('portfolio_project_images');
      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages);
          if (parsedImages[project.imageUrl]) {
            setPreviewImage(parsedImages[project.imageUrl]);
          } else {
            // If no cached version exists, use the URL directly
            setPreviewImage(project.imageUrl);
          }
        } catch (error) {
          console.error('Error parsing project images from localStorage:', error);
          setPreviewImage(project.imageUrl);
        }
      } else {
        setPreviewImage(project.imageUrl);
      }
    }
  }, [isEditing, project]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  
  const handleImageSelected = (file: File | null, previewUrl: string) => {
    setImageError('');
    
    if (!file && !previewUrl) {
      setImageFile(null);
      setPreviewImage(undefined);
      setFormData(prev => ({ ...prev, imageUrl: '' }));
      return;
    }
    
    setImageFile(file);
    setPreviewImage(previewUrl);
    
    // When an image is selected, save it immediately
    saveImage(file, previewUrl);
  };
  
  const saveImage = async (file: File | null, previewUrl: string) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // In a real app, you would upload the file to a server here
      // For this example, we'll simulate an upload by creating a timestamp-based filename
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = `/images/projects/${fileName}`;
      
      // For now, since we can't actually save the file on the server,
      // we'll use data URLs instead for demonstration
      
      // This would be where you'd make an API call to upload the file
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set the image URL to the actual path
      setFormData(prev => ({ ...prev, imageUrl: filePath }));
      
      // Store the image data in localStorage for demonstration purposes
      // In a real app, you wouldn't do this
      if (typeof window !== 'undefined') {
        // First, load existing images
        const existingImages = JSON.parse(localStorage.getItem('portfolio_project_images') || '{}');
        
        // Add or update the new image
        existingImages[filePath] = previewUrl;
        
        // Save back to localStorage
        localStorage.setItem('portfolio_project_images', JSON.stringify(existingImages));
        
        // Log for debugging
        console.log('Image saved to localStorage:', filePath);
        console.log('Total images in localStorage:', Object.keys(existingImages).length);
      }
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageError('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
  };
  
  const handleSubmit = (e) => {
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
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    // Convert tags string to array for validation
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
      
    if (tagsArray.length === 0) {
      errors.tags = 'At least one tag is required';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Create a copy of formData that includes the image preview URL if available
      const projectData = {
        ...(project?.id ? { id: project.id } : {}),
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        tags: tagsArray, // Use the parsed tags array
        slug: formData.slug,
        imageFile: imageFile,
        imagePreviewUrl: previewImage
      };
      
      // Pass the form data to the parent component
      onSubmit(projectData, !!project); // Pass isEditing as true if project exists
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border-t-4 border-blue-600">
      <h2 className="text-xl font-semibold text-gray-900">
        {isEditing ? 'Edit Project' : 'Add New Project'}
      </h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Project Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 ${validationErrors.title ? 'border-red-500' : ''}`}
        />
        {validationErrors.title && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 ${validationErrors.description ? 'border-red-500' : ''}`}
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Project Image
        </label>
        <ImageUpload 
          onImageSelected={handleImageSelected}
          previewUrl={previewImage}
          aspectRatio={1.5}
          className="mt-1"
        />
        {isUploading && (
          <p className="mt-2 text-sm text-blue-600">Uploading image...</p>
        )}
        {imageError && (
          <p className="mt-2 text-sm text-red-600">{imageError}</p>
        )}
        {formData.imageUrl && !isUploading && !imageError && (
          <p className="mt-2 text-sm text-green-600">Image ready to save with project</p>
        )}
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          required
          value={formData.tags}
          onChange={handleChange}
          placeholder="Python, Pandas, Data Visualization"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 ${validationErrors.tags ? 'border-red-500' : ''}`}
        />
        {validationErrors.tags && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.tags}</p>
        )}
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
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 ${validationErrors.slug ? 'border-red-500' : ''}`}
        />
        <p className="mt-1 text-sm text-gray-500">
          This will be used in the URL: /projects/{formData.slug}
        </p>
        {validationErrors.slug && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.slug}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isEditing ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </form>
  );
} 