'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ProfileData {
  _id?: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  imageUrl?: string;
}

interface ProfileFormProps {
  profile: ProfileData;
  onSubmit: (profileData: ProfileData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ProfileForm({ profile, onSubmit, onCancel, isSubmitting = false }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [imagePreview, setImagePreview] = useState<string | null>(profile.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when profile changes
  useEffect(() => {
    setFormData(profile);
    setImagePreview(profile.imageUrl || null);
  }, [profile]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setIsUploading(true);
      setUploadProgress(10);
      setUploadError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'profile');

      setUploadProgress(30);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      setUploadProgress(100);
      
      // Update form data with the uploaded image URL
      setFormData(prev => ({
        ...prev,
        imageUrl: data.url
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Include the _id if it exists
    onSubmit({ 
      ...formData,
      _id: profile._id
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Update your personal information which will be displayed on your portfolio.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Profile Image */}
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <div className="mt-2 flex items-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full">
                {imagePreview ? (
                  <Image 
                    src={imagePreview} 
                    alt="Profile preview" 
                    fill
                    className="object-cover" 
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="ml-5 flex-1">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageSelected}
                  disabled={isUploading || isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUploading || isSubmitting}
                >
                  {isUploading ? 'Uploading...' : 'Change Image'}
                </button>
                <p className="mt-2 text-xs text-gray-500">
                  Recommended: Square image, at least 300x300 pixels.
                </p>
                
                {isUploading && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Uploading: {uploadProgress}%</p>
                  </div>
                )}
                
                {uploadError && (
                  <p className="mt-2 text-xs text-red-600">{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Title */}
          <div className="sm:col-span-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Professional Title</label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Email */}
          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="sm:col-span-3">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="mt-1">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Location */}
          <div className="sm:col-span-3">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <div className="mt-1">
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div className="sm:col-span-3">
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
            <div className="mt-1">
              <input
                type="url"
                name="linkedin"
                id="linkedin"
                value={formData.linkedin || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourname"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* GitHub */}
          <div className="sm:col-span-3">
            <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub Profile</label>
            <div className="mt-1">
              <input
                type="url"
                name="github"
                id="github"
                value={formData.github || ''}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="sm:col-span-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Professional Bio</label>
            <div className="mt-1">
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio || ''}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">Brief description of your professional background and expertise.</p>
          </div>
        </div>
      </div>

      <div className="pt-5 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
} 