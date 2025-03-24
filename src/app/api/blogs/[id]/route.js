import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

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

// GET handler to retrieve a single blog
export async function GET(request, { params }) {
  try {
    const { id } = params;
    await dbConnect();
    
    // First try to find by MongoDB ID
    let blog = await Blog.findById(id);
    
    // If not found, try to find by slug
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json(serializeDocument(blog), { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

// DELETE handler to delete a blog
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log(`Attempting to delete blog with ID: ${id}`);
    
    await dbConnect();
    console.log('Database connected successfully');
    
    // Try to delete by MongoDB ID first
    let deletedBlog = await Blog.findByIdAndDelete(id);
    
    // If not found, try to delete by slug
    if (!deletedBlog) {
      deletedBlog = await Blog.findOneAndDelete({ slug: id });
    }
    
    if (!deletedBlog) {
      console.log(`Blog with ID ${id} not found`);
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    console.log(`Blog deleted successfully: ${deletedBlog.title}`);
    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ 
      error: 'Failed to delete blog',
      details: error.message 
    }, { status: 500 });
  }
} 