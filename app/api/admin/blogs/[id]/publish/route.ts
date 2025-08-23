// app/api/admin/blogs/[id]/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import { getUser } from '@/lib/getUser';
import { connectToDb } from '@/lib/mongodb';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser()
    
    if (!user || user.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDb();
    const awaitedParams = await params
    const { published } = await req.json();
    const blogId = awaitedParams.id;

    // Ensure blog is approved before publishing
    if (published) {
      const blogToPublish = await Blog.findById(blogId);
      if (!blogToPublish.approved) {
        return NextResponse.json(
          { error: 'Blog must be approved before publishing' },
          { status: 400 }
        );
      }
    }

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { published },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog publish status:', error);
    return NextResponse.json(
      { error: 'Failed to update blog publish status' },
      { status: 500 }
    );
  }
}