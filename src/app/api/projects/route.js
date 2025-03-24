import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

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

// GET handler to retrieve all projects
export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ featured: -1, createdAt: -1 });
    
    // Serialize MongoDB documents before sending response
    return NextResponse.json(serializeDocument(projects), { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST handler to create a new project
export async function POST(request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    // Create the new project
    const newProject = await Project.create(body);
    
    // Serialize MongoDB document before sending response
    return NextResponse.json(serializeDocument(newProject), { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
} 