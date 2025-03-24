import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

// GET handler to retrieve a single project by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    await dbConnect();
    
    const project = await Project.findOne({ slug });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT handler to update a project
export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    
    await dbConnect();
    
    // Set the updated time
    body.updatedAt = new Date();
    
    const updatedProject = await Project.findOneAndUpdate(
      { slug },
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE handler to delete a project
export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    await dbConnect();
    
    const deletedProject = await Project.findOneAndDelete({ slug });
    
    if (!deletedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
} 