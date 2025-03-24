import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

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

// GET handler to retrieve all blog posts
export async function GET() {
  try {
    await dbConnect();
    const posts = await BlogPost.find({}).sort({ createdAt: -1 }); // Sort by newest first
    
    // Serialize MongoDB documents before sending response
    return NextResponse.json(serializeDocument(posts), { status: 200 });
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
    
    // Serialize MongoDB document before sending response
    return NextResponse.json(serializeDocument(newPost), { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
} 