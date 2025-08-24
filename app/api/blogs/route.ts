// app/api/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import { connectToDb } from '@/lib/mongodb';
import { getUser } from '@/lib/getUser';


// GET all published blogs (for public listing)
export async function GET() {
  try {
    await connectToDb();
    
    const blogs = await Blog.find({ 
      approved: true, 
      published: true 
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .select('-content'); // Exclude content for listing
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST create a new blog
export async function POST(request: NextRequest) {
  try {
    await connectToDb();
    
    // Check if user is authenticated
    const user = await getUser();
    console.log("user :::::::::: user", user)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { title, description, coverImg, content, slug, blogId } = await request.json();
    
    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this title already exists' },
        { status: 400 }
      );
    }
    
    // Create new blog
    const blog = new Blog({
      title,
      description,
      coverImg,
      content,
      slug,
      blogId,
      createdBy: user._id,
      approved: false, // Needs admin approval
      published: false, // Not published until approved
    });
    
    await blog.save();
    
    // Populate createdBy field
    await blog.populate('createdBy', 'name email');
    
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}