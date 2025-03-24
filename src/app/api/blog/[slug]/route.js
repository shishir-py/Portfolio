import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

// GET handler to retrieve a single blog post by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    await dbConnect();
    
    const post = await BlogPost.findOne({ slug });
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT handler to update a blog post
export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    
    await dbConnect();
    
    // Set the updated time
    body.updatedAt = new Date();
    
    const updatedPost = await BlogPost.findOneAndUpdate(
      { slug },
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE handler to delete a blog post
export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    await dbConnect();
    
    const deletedPost = await BlogPost.findOneAndDelete({ slug });
    
    if (!deletedPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
} 