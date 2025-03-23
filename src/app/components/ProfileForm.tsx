'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface ProfileFormProps {
  profile?: {
    name: string;
    title: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    linkedin: string;
    github: string;
    imageUrl?: string;
  };
  onSubmit: (profileData: any) => void;
  onCancel: () => void;
}

export default function ProfileForm({ profile, onSubmit, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || 'Tara Prasad Pandey',
    title: profile?.title || 'Data Analyst',
    email: profile?.email || 'sheahead22@gmail.com',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    linkedin: profile?.linkedin || 'https://www.linkedin.com/in/Brainwave1999',
    github: profile?.github || '',
    imageUrl: profile?.imageUrl || '/images/profile/admin-profile.jpg'
  });
  
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    profile?.imageUrl && profile.imageUrl.startsWith('/') 
      ? profile.imageUrl 
      : undefined
  );
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageSelected = (file: File, previewUrl: string) => {
    setImageFile(file);
    setPreviewImage(previewUrl);
    // In a real app, you would upload this to a server
    // For now, we'll just use the preview URL directly for the form data
    setFormData(prev => ({ 
      ...prev, 
      imageUrl: previewUrl // Use the data URL directly instead of a file path
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit the profile data
    onSubmit(formData);
    
    // In a real application, you would handle the image upload here
    if (imageFile) {
      console.log('Would upload profile image:', imageFile);
      // Implement actual upload logic
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border-t-4 border-blue-600">
      <h2 className="text-xl font-semibold text-gray-900">
        Edit Profile
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Profile Photo
        </label>
        <ImageUpload 
          onImageSelected={handleImageSelected}
          previewUrl={previewImage}
          aspectRatio={1}
          className="mt-1"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
            LinkedIn
          </label>
          <input
            type="text"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="linkedin.com/in/username"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Professional Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
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
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
} 