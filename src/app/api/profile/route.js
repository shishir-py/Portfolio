import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

// GET handler to retrieve the profile
export async function GET() {
  try {
    await dbConnect();
    
    // Get the profile or create a default one if it doesn't exist
    let profile = await Profile.findOne({});
    
    if (!profile) {
      // Create a default profile if none exists
      profile = await Profile.create({});
    }
    
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT handler to update the profile
export async function PUT(request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    // Set the updated time
    body.updatedAt = new Date();
    
    // Find the profile or create a new one with the updated data
    const profile = await Profile.findOneAndUpdate(
      {}, // Empty filter to match any profile (we should only have one)
      body,
      { 
        new: true, 
        runValidators: true,
        upsert: true, // Create if it doesn't exist
        setDefaultsOnInsert: true // Use schema defaults for new documents
      }
    );
    
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
} 