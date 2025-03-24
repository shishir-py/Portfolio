import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

// GET handler to retrieve all blog posts
export async function GET() {
  try {
    await dbConnect();
    const posts = await BlogPost.find({}).sort({ createdAt: -1 }); // Sort by newest first
    
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST handler to create a new blog post
export async function POST(request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    // Create the new blog post
    const newPost = await BlogPost.create(body);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
} 