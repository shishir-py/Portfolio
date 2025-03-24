import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import mongoose from 'mongoose';

// Default profile data
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

// Helper function to serialize MongoDB documents
function serializeDocument(doc) {
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

// GET /api/profile - Get profile
export async function GET() {
  try {
    console.log('Attempting to connect to database...');
    await dbConnect();
    console.log('Successfully connected to database, fetching profile...');

    // Attempt to get the profile from the database
    const profile = await mongoose.connection.collection('profile').findOne({});

    // If profile exists, return it (serialized)
    if (profile) {
      console.log('Profile found in database:', profile);
      return NextResponse.json(serializeDocument(profile));
    }

    console.log('No profile found, creating default profile...');
    // If no profile exists, create a default one
    try {
      const result = await mongoose.connection.collection('profile').insertOne(defaultProfile);
      const newProfile = { ...defaultProfile, _id: result.insertedId };
      console.log('Default profile created:', newProfile);
      return NextResponse.json(serializeDocument(newProfile));
    } catch (insertError) {
      console.error('Failed to insert default profile:', insertError);
      return NextResponse.json(defaultProfile);
    }
  } catch (error) {
    console.error('Database error in GET /api/profile:', error);
    return NextResponse.json(defaultProfile);
  }
}

// PUT /api/profile - Update profile
export async function PUT(request) {
  try {
    console.log('Attempting to connect to database for profile update...');
    await dbConnect();
    
    const profileData = await request.json();
    console.log('Received profile update data:', profileData);
    
    // Check if profile exists
    const existingProfile = await mongoose.connection.collection('profile').findOne({});
    console.log('Existing profile:', existingProfile);
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      const { _id, ...updateData } = profileData;
      console.log('Updating existing profile with data:', updateData);
      
      result = await mongoose.connection.collection('profile').findOneAndUpdate(
        { _id: existingProfile._id },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      console.log('Profile updated successfully:', result);
      return NextResponse.json(serializeDocument(result));
    } else {
      // Create new profile if none exists
      console.log('Creating new profile with data:', profileData);
      result = await mongoose.connection.collection('profile').insertOne(profileData);
      const newProfile = { ...profileData, _id: result.insertedId };
      
      console.log('New profile created successfully:', newProfile);
      return NextResponse.json(serializeDocument(newProfile));
    }
  } catch (error) {
    console.error('Database error in PUT /api/profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile data' },
      { status: 500 }
    );
  }
} 