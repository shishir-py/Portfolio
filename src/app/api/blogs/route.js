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

// GET handler to retrieve all blogs
export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find({}).sort({ featured: -1, publishedAt: -1 });
    return NextResponse.json(serializeDocument(blogs), { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST handler to create a new blog
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Attempting to create blog with data:', body);
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'content', 'excerpt'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: `Missing fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    await dbConnect();
    console.log('Database connected successfully');
    
    let blog;
    
    // Check if we have an _id and if it exists
    if (body._id) {
      // Try to update existing blog
      blog = await Blog.findByIdAndUpdate(
        body._id,
        {
          ...body,
          featured: body.featured || false,
          published: body.published || false,
          publishedAt: body.published ? new Date() : null,
          tags: Array.isArray(body.tags) ? body.tags : [],
          updatedAt: new Date()
        },
        { new: true, runValidators: true, upsert: true }
      );
      
      console.log('Blog updated successfully:', blog);
    } else {
      // Create the new blog with featured flag and published status
      blog = await Blog.create({
        ...body,
        featured: body.featured || false,
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
        tags: Array.isArray(body.tags) ? body.tags : []
      });
      
      console.log('Blog created successfully:', blog);
    }
    
    // Serialize MongoDB document before sending response
    const serializedBlog = serializeDocument(blog);
    return NextResponse.json(serializedBlog, { status: 201 });
  } catch (error) {
    console.error('Detailed error creating blog:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    return NextResponse.json({ 
      error: 'Failed to create blog',
      details: error.message 
    }, { status: 500 });
  }
}

// PUT handler to update a blog
export async function PUT(request) {
  try {
    const body = await request.json();
    console.log('Attempting to update blog with data:', body);
    
    if (!body._id) {
      return NextResponse.json({ 
        error: 'Missing blog ID',
        details: 'Blog ID is required for updates'
      }, { status: 400 });
    }
    
    await dbConnect();
    console.log('Database connected successfully');
    
    // Update the blog with featured flag and ensure tags are arrays
    const updatedBlog = await Blog.findByIdAndUpdate(
      body._id,
      {
        ...body,
        featured: body.featured || false,
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
        tags: Array.isArray(body.tags) ? body.tags : [],
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedBlog) {
      return NextResponse.json({ 
        error: 'Blog not found',
        details: 'Could not find blog with the provided ID'
      }, { status: 404 });
    }
    
    console.log('Blog updated successfully:', updatedBlog);
    return NextResponse.json(serializeDocument(updatedBlog), { status: 200 });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ 
      error: 'Failed to update blog',
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE handler to delete a blog
export async function DELETE(request) {
  try {
    // First try to get the ID from the URL
    const url = new URL(request.url);
    const idFromUrl = url.pathname.split('/').pop();
    
    // If the ID is not part of the URL, try to get it from the request body
    let id;
    if (idFromUrl && idFromUrl !== 'blogs') {
      id = idFromUrl;
    } else {
      // Try to get the ID from the request body
      const body = await request.json().catch(() => ({}));
      id = body._id;
      
      if (!id) {
        return NextResponse.json({ 
          error: 'Missing blog ID',
          details: 'Blog ID is required for deletion'
        }, { status: 400 });
      }
    }
    
    console.log('Attempting to delete blog with ID:', id);
    await dbConnect();
    
    const deletedBlog = await Blog.findByIdAndDelete(id);
    
    if (!deletedBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    console.log('Blog deleted successfully:', id);
    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ 
      error: 'Failed to delete blog',
      details: error.message  
    }, { status: 500 });
  }
} 