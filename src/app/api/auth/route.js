import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

// Initialize default admin if none exists
async function initializeAdmin() {
  const adminExists = await Admin.findOne({});
  
  if (!adminExists) {
    // Create a default admin user
    const defaultAdmin = new Admin({
      username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'tarapandey',
    });
    
    // Set the password
    defaultAdmin.setPassword(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123');
    
    // Save the admin user
    await defaultAdmin.save();
    console.log('Default admin user created');
  }
}

// POST handler for login
export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    await dbConnect();
    
    // Initialize default admin if needed
    await initializeAdmin();
    
    // Find the admin user
    const admin = await Admin.findOne({ username });
    
    if (!admin || !admin.validPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();
    
    // Return success but don't include sensitive data
    return NextResponse.json(
      { 
        success: true,
        user: {
          username: admin.username,
          lastLogin: admin.lastLogin
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// PUT handler to change admin password
export async function PUT(request) {
  try {
    const { username, currentPassword, newPassword } = await request.json();
    
    await dbConnect();
    
    // Find the admin user
    const admin = await Admin.findOne({ username });
    
    if (!admin || !admin.validPassword(currentPassword)) {
      return NextResponse.json(
        { error: 'Invalid username or current password' },
        { status: 401 }
      );
    }
    
    // Update the password
    admin.setPassword(newPassword);
    await admin.save();
    
    return NextResponse.json(
      { success: true, message: 'Password updated successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
} 