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

// POST handler to toggle a blog post property (featured, published, addToHome)
export async function POST(request) {
  try {
    const { id, property } = await request.json();
    
    // Validate input
    if (!id || !property) {
      return NextResponse.json({ 
        error: 'Missing required fields. "id" and "property" are required.' 
      }, { status: 400 });
    }
    
    // Validate property name
    const allowedProperties = ['featured', 'published', 'addToHome'];
    if (!allowedProperties.includes(property)) {
      return NextResponse.json({ 
        error: `Invalid property. Must be one of: ${allowedProperties.join(', ')}` 
      }, { status: 400 });
    }
    
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid blog post ID' }, { status: 400 });
    }
    
    await dbConnect();
    
    // Find the blog post
    const post = await BlogPost.findById(id);
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    // Toggle the specified property
    const updateData = {
      [property]: !post[property],
      updatedAt: new Date()
    };
    
    // Update the blog post
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // Serialize and return the updated post
    return NextResponse.json({
      success: true,
      message: `Blog post ${property} toggled successfully`,
      post: serializeDocument(updatedPost)
    }, { status: 200 });
  } catch (error) {
    console.error('Error toggling blog post property:', error);
    return NextResponse.json({ 
      error: 'Failed to toggle blog post property' 
    }, { status: 500 });
  }
} 