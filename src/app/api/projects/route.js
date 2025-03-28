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
    return NextResponse.json(serializeDocument(projects), { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST handler to create a new project
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Attempting to create project with data:', body);
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'description'];
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
    
    let project;
    
    // Check if we have an _id and if it exists
    if (body._id) {
      // Try to update existing project
      project = await Project.findByIdAndUpdate(
        body._id,
        {
          ...body,
          featured: body.featured || false,
          tags: Array.isArray(body.tags) ? body.tags : [],
          technologies: Array.isArray(body.technologies) ? body.technologies : [],
          updatedAt: new Date()
        },
        { new: true, runValidators: true, upsert: true }
      );
      
      console.log('Project updated successfully:', project);
    } else {
      // Create new project
      project = await Project.create({
        ...body,
        featured: body.featured || false,
        tags: Array.isArray(body.tags) ? body.tags : [],
        technologies: Array.isArray(body.technologies) ? body.technologies : []
      });
      
      console.log('Project created successfully:', project);
    }
    
    // Serialize MongoDB document before sending response
    const serializedProject = serializeDocument(project);
    return NextResponse.json(serializedProject, { status: 201 });
  } catch (error) {
    console.error('Detailed error creating project:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    return NextResponse.json({ 
      error: 'Failed to create project',
      details: error.message 
    }, { status: 500 });
  }
}

// PUT handler to update a project
export async function PUT(request) {
  try {
    const body = await request.json();
    console.log('Attempting to update project with data:', body);
    
    if (!body._id) {
      return NextResponse.json({ 
        error: 'Missing project ID',
        details: 'Project ID is required for updates'
      }, { status: 400 });
    }
    
    await dbConnect();
    console.log('Database connected successfully');
    
    // Update the project with featured flag and ensure tags are arrays
    const updatedProject = await Project.findByIdAndUpdate(
      body._id,
      {
        ...body,
        featured: body.featured || false,
        tags: Array.isArray(body.tags) ? body.tags : [],
        technologies: Array.isArray(body.technologies) ? body.technologies : [],
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return NextResponse.json({ 
        error: 'Project not found',
        details: 'Could not find project with the provided ID'
      }, { status: 404 });
    }
    
    console.log('Project updated successfully:', updatedProject);
    return NextResponse.json(serializeDocument(updatedProject), { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ 
      error: 'Failed to update project',
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE handler to delete a project
export async function DELETE(request) {
  try {
    // First try to get the ID from the URL
    const url = new URL(request.url);
    const idFromUrl = url.pathname.split('/').pop();
    
    // If the ID is not part of the URL, try to get it from the request body
    let id;
    if (idFromUrl && idFromUrl !== 'projects') {
      id = idFromUrl;
    } else {
      // Try to get the ID from the request body
      const body = await request.json().catch(() => ({}));
      id = body._id;
      
      if (!id) {
        return NextResponse.json({ 
          error: 'Missing project ID',
          details: 'Project ID is required for deletion'
        }, { status: 400 });
      }
    }
    
    console.log('Attempting to delete project with ID:', id);
    await dbConnect();
    
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    console.log('Project deleted successfully:', id);
    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      error: 'Failed to delete project',
      details: error.message  
    }, { status: 500 });
  }
} 