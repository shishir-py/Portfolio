import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear authentication cookies if they exist
    const cookieStore = cookies();
    cookieStore.delete('auth_token');
    cookieStore.delete('user_id');
    
    // Return success
    return NextResponse.json({ success: true, message: 'Successfully signed out' });
  } catch (error) {
    console.error('Error during sign out:', error);
    return NextResponse.json(
      { success: false, message: 'Error during sign out' },
      { status: 500 }
    );
  }
} 