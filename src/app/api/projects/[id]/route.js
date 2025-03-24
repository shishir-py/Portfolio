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

// GET handler to retrieve a single project
export async function GET(request, { params }) {
  try {
    const { id } = params;
    await dbConnect();
    
    // First try to find by MongoDB ID
    let project = await Project.findById(id);
    
    // If not found, try to find by slug
    if (!project) {
      project = await Project.findOne({ slug: id });
    }
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(serializeDocument(project), { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT handler to update a project
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    await dbConnect();
    
    // First try to update by MongoDB ID
    let updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        ...body,
        featured: body.featured || false,
        technologies: Array.isArray(body.technologies) ? body.technologies : [],
        tags: Array.isArray(body.tags) ? body.tags : [],
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    // If not found, try to update by slug
    if (!updatedProject) {
      updatedProject = await Project.findOneAndUpdate(
        { slug: id },
        {
          ...body,
          featured: body.featured || false,
          technologies: Array.isArray(body.technologies) ? body.technologies : [],
          tags: Array.isArray(body.tags) ? body.tags : [],
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );
    }
    
    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
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
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log(`Attempting to delete project with ID: ${id}`);
    
    await dbConnect();
    console.log('Database connected successfully');
    
    // Try to delete by MongoDB ID first
    let deletedProject = await Project.findByIdAndDelete(id);
    
    // If not found, try to delete by slug
    if (!deletedProject) {
      deletedProject = await Project.findOneAndDelete({ slug: id });
    }
    
    if (!deletedProject) {
      console.log(`Project with ID ${id} not found`);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    console.log(`Project deleted successfully: ${deletedProject.title}`);
    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      error: 'Failed to delete project',
      details: error.message 
    }, { status: 500 });
  }
} 