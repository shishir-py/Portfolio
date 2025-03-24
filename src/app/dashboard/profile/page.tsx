'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProfileForm from '../../components/ProfileForm';

// Default profile data as fallback
const defaultProfile = {
  name: 'Tara Prasad Pandey',
  title: 'Data Analyst',
  email: 'sheahead22@gmail.com',
  phone: '+1 (555) 123-4567',
  bio: 'Results-driven Data Analyst specializing in automation, machine learning models, and data visualization with advanced skills in Python, SQL, and Power BI.',
  location: 'Seattle, WA',
  linkedin: 'https://www.linkedin.com/in/Brainwave1999',
  github: 'github.com/tarapandey',
  imageUrl: '/images/profile/admin-profile.jpg'
};

export default function ProfileManagement() {
  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Check authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('dashboard_auth');
      if (authStatus !== 'true') {
        router.push('/dashboard');
      } else {
        // Fetch profile from the database API
        fetchProfile();
      }
    }
  }, [router]);

  // Fetch profile from the API
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      setProfile(data);
      
      // Also store in localStorage for compatibility with other components
      localStorage.setItem('profile_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data. Please try again.');
      
      // Use profile from localStorage as fallback
      const savedProfile = localStorage.getItem('profile_data');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleFormSubmit = async (profileData) => {
    try {
      setIsSubmitting(true);
      
      // Save to the database via API
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      // Get the updated profile
      const updatedProfile = await response.json();
      
      // Update state
      setProfile(updatedProfile);
      setIsEditing(false);
      setHasUpdated(true);
      
      // Store in localStorage for compatibility with other components
      localStorage.setItem('profile_data', JSON.stringify(updatedProfile));
      
      // Hide success message after a delay
      setTimeout(() => {
        setHasUpdated(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFormCancel = () => {
    setIsEditing(false);
  };
  
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
            <p className="text-gray-500">Please wait while we load your profile.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (isEditing) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileForm 
            profile={profile} 
            onSubmit={handleFormSubmit} 
            onCancel={handleFormCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {hasUpdated && (
          <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Profile updated successfully! All pages will now show the updated information.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden p-6 border-t-4 border-blue-600">
          <div className="md:flex">
            <div className="md:flex-shrink-0 mb-4 md:mb-0">
              <div className="h-48 w-48 rounded-lg bg-gray-100 overflow-hidden relative">
                {profile.imageUrl ? (
                  <Image 
                    src={profile.imageUrl} 
                    alt={profile.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600">
                    <span className="text-3xl font-bold text-white">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:ml-6 md:flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-lg text-blue-600 font-medium">{profile.title}</p>
              
              <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-gray-900">{profile.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1 text-gray-900">{profile.phone || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1 text-gray-900">{profile.location || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">LinkedIn</h3>
                  <p className="mt-1 text-gray-900">{profile.linkedin || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Professional Bio</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-line">{profile.bio || 'No bio provided.'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Website Appearance</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your profile information is displayed on various pages throughout your portfolio website.
            </p>
            
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900">About Page</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Your comprehensive profile, experience, and skills.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900">Contact Page</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Your email, phone, and social media links.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900">Homepage</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Your name, title, and basic introduction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 