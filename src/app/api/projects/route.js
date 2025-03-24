import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

// GET handler to retrieve all projects
export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ featured: -1, createdAt: -1 });
    
    return NextResponse.json(projects, { status: 200 });
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
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
} 