'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import { Project } from '../models/Project';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (projectData: Project) => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const isEditing = !!project?._id;
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    content: project?.content || '',
    imageUrl: project?.imageUrl || '',
    tags: project?.tags?.join(', ') || '',
    slug: project?.slug || '',
    repoUrl: project?.repoUrl || '',
    demoUrl: project?.demoUrl || '',
    featured: project?.featured || false,
    published: project?.published || false,
    addToHome: project?.addToHome || false
  });
  
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Load initial image preview from localStorage if editing
  useEffect(() => {
    if (isEditing && project && typeof window !== 'undefined') {
      console.log('Editing project:', project);
      
      // Make sure checkbox state matches the project data
      setFormData(prev => ({
        ...prev,
        title: project.title || '',
        description: project.description || '',
        content: project.content || '',
        imageUrl: project.imageUrl || '',
        tags: project.tags?.join(', ') || '',
        slug: project.slug || '',
        repoUrl: project.repoUrl || '',
        demoUrl: project.demoUrl || '',
        featured: !!project.featured,
        published: !!project.published,
        addToHome: !!project.addToHome
      }));
      
      // Handle image preview
      if (project.imageUrl) {
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
    }
  }, [isEditing, project]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    try {
      setIsUploading(true);
      setImageError('');
      setImageFile(file);
      
      // Set preview image
      setPreviewImage(previewUrl);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'project');
      
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
      setFormData(prev => ({
        ...prev,
        imageUrl: data.url
      }));
      
      // Log for debugging
      console.log('Image uploaded successfully:', data.url);
      
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
        ...(project?._id ? { _id: project._id } : {}),
        title: formData.title,
        description: formData.description,
        content: formData.content,
        imageUrl: formData.imageUrl,
        tags: tagsArray,
        slug: formData.slug,
        repoUrl: formData.repoUrl,
        demoUrl: formData.demoUrl,
        featured: formData.featured,
        published: formData.published,
        addToHome: formData.addToHome
      };
      
      // Pass the form data to the parent component
      onSubmit(projectData);
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
          Short Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
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
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Detailed Content
        </label>
        <div className="mt-1">
          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write detailed information about your project here..."
            minHeight="300px"
          />
        </div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            URL Slug
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              /projects/
            </span>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className={`flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm ${validationErrors.slug ? 'border-red-500' : ''}`}
            />
          </div>
          {validationErrors.slug && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.slug}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700">
            Repository URL (Optional)
          </label>
          <input
            type="url"
            id="repoUrl"
            name="repoUrl"
            value={formData.repoUrl}
            onChange={handleChange}
            placeholder="https://github.com/yourusername/repository"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        
        <div>
          <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700">
            Demo URL (Optional)
          </label>
          <input
            type="url"
            id="demoUrl"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            placeholder="https://your-demo-site.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
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
            Mark as Featured Project
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
            Publish this Project
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
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? 'Update Project' : 'Save Project'}
        </button>
      </div>
    </form>
  );
} 