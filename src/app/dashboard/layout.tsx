import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Helper function to serialize MongoDB documents
function serializeDocument(doc: any) {
  if (!doc) return null;
  
  return Object.fromEntries(
    Object.entries(doc).map(([key, value]) => {
      // Convert ObjectId to string
      if (key === '_id') {
        return [key, value.toString()];
      }
      // Handle nested objects (if any)
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        return [key, serializeDocument(value)];
      }
      // Handle arrays (if any)
      if (Array.isArray(value)) {
        return [key, value.map(item => 
          typeof item === 'object' && item !== null ? serializeDocument(item) : item
        )];
      }
      // Regular values
      return [key, value];
    })
  );
}

// Default profile data as fallback
const defaultProfile = {
  name: 'Tara Prasad Pandey',
  title: 'Data Analyst',
  bio: 'Results-driven Data Analyst specializing in automation, machine learning models, and data visualization with advanced skills in Python, SQL, and Power BI.',
  imageUrl: '/images/profile/admin-profile.jpg'
};

async function getProfileData() {
  try {
    await dbConnect();
    const profile = await mongoose.connection.collection('profile').findOne({});
    return profile ? serializeDocument(profile) : defaultProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return defaultProfile;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfileData();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Navbar profile={profile} />
        <main className="flex-1 pb-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 