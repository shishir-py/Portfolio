import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import mongoose from 'mongoose';

// Helper function to serialize MongoDB documents
function serializeDocument(doc) {
  if (!doc) return null;
  
  // Handle array of documents
  if (Array.isArray(doc)) {
    return doc.map(item => serializeDocument(item));
  }
  
  // Convert Mongoose document to plain object if it has a toObject method
  const object = doc.toObject ? doc.toObject() : doc;
  
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      // Convert ObjectId to string
      if (key === '_id' || key === 'id') {
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

// GET handler to retrieve a single blog post by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog post ID' }, { status: 400 });
    }
    
    await dbConnect();
    
    const post = await BlogPost.findById(id);
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    // Serialize MongoDB document before sending response
    return NextResponse.json(serializeDocument(post), { status: 200 });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT handler to update a blog post by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog post ID' }, { status: 400 });
    }
    
    await dbConnect();
    
    // Set the updated time
    body.updatedAt = new Date();
    
    // Ensure boolean fields are properly set
    if (body.featured !== undefined) body.featured = Boolean(body.featured);
    if (body.published !== undefined) body.published = Boolean(body.published);
    if (body.addToHome !== undefined) body.addToHome = Boolean(body.addToHome);
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    // Serialize MongoDB document before sending response
    return NextResponse.json(serializeDocument(updatedPost), { status: 200 });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE handler to delete a blog post by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog post ID' }, { status: 400 });
    }
    
    await dbConnect();
    
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
} 