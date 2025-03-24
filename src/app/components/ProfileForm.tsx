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
    <div className="min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Profile Information</h3>
            <p className="mt-2 text-sm text-gray-600">
              Update your personal information which will be displayed on your portfolio.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {/* Profile Image */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-4">Profile Photo</label>
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="relative h-48 w-48 overflow-hidden rounded-full ring-4 ring-gray-100">
                  {imagePreview ? (
                    <Image 
                      src={imagePreview} 
                      alt="Profile preview" 
                      fill
                      className="object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500 text-lg font-medium">Add Photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
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
                    className="w-full md:w-auto inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    disabled={isUploading || isSubmitting}
                  >
                    {isUploading ? 'Uploading...' : 'Change Image'}
                  </button>
                  <p className="mt-3 text-sm text-gray-600">
                    Recommended: Square image, at least 300x300 pixels.
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-base font-medium text-gray-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 py-3 text-gray-900 border-gray-300 rounded-lg transition-colors duration-200 bg-white placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-base font-medium text-gray-900 mb-2">Professional Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 py-3 text-gray-900 border-gray-300 rounded-lg transition-colors duration-200 bg-white placeholder-gray-500"
                    placeholder="e.g. Data Analyst, Software Engineer"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-base font-medium text-gray-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 py-3 text-gray-900 border-gray-300 rounded-lg transition-colors duration-200 bg-white placeholder-gray-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-base font-medium text-gray-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 py-3 text-gray-900 border-gray-300 rounded-lg transition-colors duration-200 bg-white placeholder-gray-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Professional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-base font-medium text-gray-900 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 py-3 text-gray-900 border-gray-300 rounded-lg transition-colors duration-200 bg-white placeholder-gray-500"
                    placeholder="e.g. New York, USA"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label htmlFor="linkedin" className="block text-base font-medium text-gray-900 mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedin"
                    id="linkedin"
                    value={formData.linkedin || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 py-3 text-gray-900 border-gray-300 rounded-lg transition-colors duration-200 bg-white placeholder-gray-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label htmlFor="github" className="block text-base font-medium text-gray-900 mb-2">GitHub Profile</label>
                  <input
                    type="url"
                    name="github"
                    id="github"
                    value={formData.github || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 py-3 text-gray-900 border-gray-300 rounded-lg transition-colors duration-200 bg-white placeholder-gray-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div>
                <label htmlFor="bio" className="block text-base font-medium text-gray-900 mb-2">Professional Bio</label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={5}
                  value={formData.bio || ''}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full text-lg px-4 py-3 text-gray-900 border-gray-300 rounded-lg transition-colors duration-200 bg-white placeholder-gray-500"
                  placeholder="Write a brief professional bio highlighting your skills, experience, and expertise..."
                ></textarea>
                <p className="mt-2 text-sm text-gray-600">
                  Keep your bio concise and focused on your professional achievements and skills.
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end pt-4 gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={isUploading || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 