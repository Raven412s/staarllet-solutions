import { getUser } from '@/lib/getUser';
import { connectToDb } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
      const requestUser = await getUser();
    if (!requestUser) {
        return NextResponse.json(
            { error: "Unauthorized: Please login first" },
            { status: 401 }
        );
    }
    if (requestUser.role !== "Admin") {
        return NextResponse.json(
            { error: "Forbidden: You are not an admin" },
            { status: 403 }
        );
    }
    if (!requestUser || requestUser.role !== 'Admin') {
        return NextResponse.json(
            { error: "Unauthorized: Please login first" },
            { status: 401 }
        );
    }

    await connectToDb();
    const awaitedParams = await params;
    const blogId = awaitedParams.blogId;

    const blog = await Blog.findOneAndDelete({ blogId }); // Use blogId instead of _id

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await params;
    const requestUser = await getUser(); // This returns the user object directly
    
    
    
    // Check if user is authenticated - user should be the object directly
    if (!requestUser) {
      console.log('Unauthorized access attempt - no user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Optional: Add role-based access control
    if (requestUser.role !== 'Admin') {
      console.log('Forbidden access attempt - not admin');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDb();
    
    const blog = await Blog.findOne({ blogId: blogId })
      .populate('createdBy', 'name email')
      .lean();

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}