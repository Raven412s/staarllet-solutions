// app/api/blogs/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import { connectToDb } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDb();
    const {slug} = await params
    const blog = await Blog.findOne({ 
      slug: slug,
      approved: true, 
      published: true 
    }).populate('createdBy', 'name email');
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}